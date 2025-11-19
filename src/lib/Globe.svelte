<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { attributes as citiesContent } from "../content/cities.md";

    // Props for initial camera position
    export let initialLat: number = 20; // Default: centered on Europe/Africa
    export let initialLng: number = 0; // Default: centered on Europe/Africa
    export let initialAltitude: number = 2.5; // Default: medium zoom (lower = more zoomed in)
    export let enableAutoRotate: boolean = true; // Enable automatic rotation
    export let autoRotateSpeed: number = 0.5; // Rotation speed

    let container: HTMLDivElement;
    let globe: any;
    let isLoading = true;
    let tooltip: HTMLDivElement;
    let tooltipVisible = false;
    let tooltipData: any = null;
    let tooltipX = 0;
    let tooltipY = 0;
    let isHovering = false;
    let hideTooltipTimeout: ReturnType<typeof setTimeout> | null = null;
    let mobilePopupVisible = false;
    let mobilePopupData: any = null;

    let handleResize: (() => void) | null = null;

    // Check if device is mobile/touch
    function isMobileDevice() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }

    // Function to close mobile popup
    function closeMobilePopup() {
        mobilePopupVisible = false;
        mobilePopupData = null;
    }

    // Function to update tooltip position based on hovered point location
    function updateTooltipPosition(point: any) {
        if (!globe || !container || !point) return;

        const rect = container.getBoundingClientRect();

        if (typeof globe.getScreenCoords === "function") {
            // Use globe.gl helper if available
            const { x, y } = globe.getScreenCoords(point.lat, point.lng);

            // Store the point position in screen space; wrapper will center above it
            tooltipX = rect.left + x;
            tooltipY = rect.top + y - 20; // 20px above the point
        } else {
            // Fallback: approximate position near center
            tooltipX = rect.left + rect.width / 2;
            tooltipY = rect.top + rect.height / 2 - 20;
        }
    }

    onMount(() => {
        // Only run on client side
        if (!browser) return;

        const cities = [];
        const isMobile = isMobileDevice();
        const pointSize = isMobile ? 0.9 : 0.5;
        const initialAltitudeValue = isMobile ? 0.75 : initialAltitude;

        citiesContent.cities.forEach((city) => {
            cities.push({
                lat: city.lat,
                lng: city.lng,
                name: city.name,
                released: city.released,
                url: `/${city.slug}`,
                size: pointSize,
                color: city.color,
            });
        });

        // Dynamic import to avoid SSR issues
        import("globe.gl").then(async (globeModule) => {
            const Globe = globeModule.default;
            // Access Three.js through globe.gl's internal instance
            const THREE = await import("three");
            // Initialize the globe
            globe = new Globe(container, {
                animateIn: true,
                waitForGlobeReady: true,
            })
                .globeImageUrl(
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4="
                ) // White texture
                .bumpImageUrl("") // Remove bump map
                .width(container.offsetWidth)
                .height(container.offsetHeight)
                .showAtmosphere(false)
                .backgroundColor("#000000")
                .pointOfView(
                    {
                        lat: initialLat,
                        lng: initialLng,
                        altitude: initialAltitudeValue,
                    },
                    0
                ); // Set transition duration to 0 for immediate positioning

            // Add some sample data points for cities
            // const cities = [
            //     {
            //         lat: 47.3769,
            //         lng: 8.5417,
            //         name: "Zürich",
            //         size: 0.5,
            //         color: "#AD46FF",
            //         released: true,
            //         url: "/zurich",
            //     },
            //     {
            //         lat: 50.8278,
            //         lng: 12.9214,
            //         name: "Chemnitz",
            //         size: 0.5,
            //         released: false,
            //         color: "#AD46FF",
            //         url: "/chemnitz",
            //     },
            // ];

            // Load countries GeoJSON data
            let countries: any = null;

            try {
                const response = await fetch(
                    "/data/Countries GeoJSON from radiating futures.geojson"
                );
                const countriesData = await response.json();
                countries = countriesData.features.filter(
                    (d: any) => d.properties.ISO_A2 !== "AQ"
                );
            } catch (error) {
                console.warn("Failed to load countries data:", error);
                // Fallback to empty array if loading fails
                countries = [];
            }

            // Add city markers
            globe
                .lights([new THREE.AmbientLight(0xffffff, 10)])
                .backgroundColor("#000000")
                .pointsData(cities)
                .pointLat("lat")
                .pointLng("lng")
                .pointColor("color")
                .pointAltitude(0.011)
                .pointRadius("size")
                .pointResolution(100)
                .pointLabel(() => null)
                .onPointHover((point: any) => {
                    // Only show tooltip on desktop devices
                    if (!isMobileDevice()) {
                        console.log(
                            "Point hover:",
                            point,
                            "isHovering:",
                            isHovering
                        ); // Debug log
                        // Change cursor to pointer when hovering over cities
                        if (point) {
                            // Cancel any pending hide so we don't flicker
                            if (hideTooltipTimeout) {
                                clearTimeout(hideTooltipTimeout);
                                hideTooltipTimeout = null;
                            }
                            console.log(
                                "Hovering over point, setting isHovering to true"
                            );
                            container.style.cursor = "pointer";
                            isHovering = true;

                            // Stop auto-rotation on hover
                            if (globe.controls()) {
                                console.log(
                                    "Stopping auto-rotate on point hover"
                                );
                                globe.controls().autoRotate = false;
                            }

                            // Show tooltip on point hover
                            if (point.name) {
                                console.log("Showing tooltip for:", point.name); // Debug log
                                tooltipData = point;
                                updateTooltipPosition(point);
                                tooltipVisible = true;
                            }
                        } else {
                            console.log(
                                "Not hovering over point, scheduling tooltip hide"
                            );
                            container.style.cursor = "default";
                            isHovering = false;

                            // Delay hiding slightly to avoid flicker when hover is intermittent
                            if (hideTooltipTimeout) {
                                clearTimeout(hideTooltipTimeout);
                            }
                            hideTooltipTimeout = setTimeout(() => {
                                tooltipVisible = false;
                                tooltipData = null;

                                // Resume auto-rotation when not hovering
                                if (globe.controls() && enableAutoRotate) {
                                    console.log(
                                        "Resuming auto-rotate after point hover ends"
                                    );
                                    globe.controls().autoRotate = true;
                                }
                            }, 50);
                        }
                    }
                })
                .onPointClick((point: any) => {
                    if (point && point.url) {
                        if (isMobileDevice()) {
                            // Mobile: show popup
                            mobilePopupData = point;
                            mobilePopupVisible = true;
                        } else {
                            // Desktop: direct navigation
                            if (point.released) {
                                goto(point.url);
                            }
                        }
                    }
                });

            // Add latitude and longitude lines
            const gridPaths = [];

            // Add latitude lines (every 10 degrees from -80 to 80)
            for (let lat = -80; lat <= 80; lat += 20) {
                const latPath = [];
                for (let lng = 0; lng <= 360; lng += 5) {
                    latPath.push([lat, lng]);
                }
                gridPaths.push(latPath);
            }

            // Add longitude lines (every 10 degrees from -180 to 180, but only between -80 and 80 lat)
            for (let lng = -180; lng <= 180; lng += 20) {
                const lngPath = [];
                for (let lat = -80; lat <= 80; lat += 5) {
                    lngPath.push([lat, lng]);
                }
                gridPaths.push(lngPath);
            }

            globe
                .pathTransitionDuration(0)
                .pathsData(gridPaths)
                .pathColor(() => "#000000")
                .pathStroke(2);

            // Add country polygons for black continent outlines
            if (countries && countries.length > 0) {
                globe
                    .polygonsData(countries)
                    .polygonAltitude(0.01)
                    .polygonsTransitionDuration(0)
                    .polygonCapColor(() => "#000000") // Black continents
                    .polygonSideColor(() => "#000000") // Black sides
                    .polygonStrokeColor(() => "#000000"); // Black outline
            }

            // Handle window resize
            handleResize = () => {
                if (globe && container) {
                    globe.width(container.offsetWidth);
                }
            };

            window.addEventListener("resize", handleResize);

            // Configure auto-rotate if enabled
            if (enableAutoRotate) {
                globe.controls().autoRotate = true;
                globe.controls().autoRotateSpeed = autoRotateSpeed;
            }

            // Disable zoom
            globe.controls().enableZoom = false;

            // Set loading to false once globe is initialized
            isLoading = false;
        });

        // Cleanup function
        return () => {
            if (handleResize && typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
                handleResize = null;
            }
            // Mousemove listener removed (no longer used for tooltip positioning)
        };
    });

    onDestroy(() => {
        if (globe && typeof globe === "object") {
            try {
                // Try different disposal methods based on globe.gl version
                if (
                    globe._globe &&
                    typeof globe._globe.dispose === "function"
                ) {
                    globe._globe.dispose();
                } else if (typeof globe.dispose === "function") {
                    globe.dispose();
                } else if (
                    globe._destructor &&
                    typeof globe._destructor === "function"
                ) {
                    globe._destructor();
                }
                // Clear the globe reference
                globe = null;
            } catch (error) {
                console.warn("Error disposing globe:", error);
            }
        }
    });
</script>

<div class="globe-container" bind:this={container}>
    <!-- Globe will be rendered here -->
</div>

<!-- Tooltip for city information -->
{#if tooltipData}
    <div
        class="tooltip-wrapper"
        class:expanded={tooltipVisible}
        style={`left: ${tooltipX}px; top: ${tooltipY}px;`}
    >
        <div class="tooltip" bind:this={tooltip}>
            <div class="tooltip-content">
                <div class="tooltip-header">
                    {#if tooltipData.released}
                        <h3 class="tooltip-title">{tooltipData.name}</h3>
                    {:else}
                        <h3 class="tooltip-title">
                            {tooltipData.name} - Coming Soon
                        </h3>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Mobile Popup -->
{#if mobilePopupVisible && mobilePopupData}
    <div class="mobile-popup-overlay" on:click={closeMobilePopup}>
        <div class="mobile-popup" on:click|stopPropagation>
            <button class="mobile-popup-close" on:click={closeMobilePopup}>
                ×
            </button>
            <div class="mobile-popup-content">
                <h2 class="mobile-popup-title">{mobilePopupData.name}</h2>
                {#if mobilePopupData.released}
                    <button
                        class="mobile-popup-button"
                        on:click={() => goto(mobilePopupData.url)}
                    >
                        Einsteigen
                    </button>
                {:else}
                    <button class="mobile-popup-button" disabled>
                        Coming Soon
                    </button>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .globe-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100dvh;
        overflow: hidden;
        background-color: #000000;
    }

    :global(.globe-container canvas) {
        background-color: #000000 !important;
    }

    .tooltip-wrapper {
        position: fixed;
        z-index: 1000;
        width: fit-content;
        pointer-events: none;
        display: flex;
        justify-content: center;
        opacity: 0;
        transform: translate(-50%, -100%);
        transition:
            opacity 0.2s ease,
            transform 0.2s ease;
    }

    .tooltip-wrapper.expanded {
        opacity: 1;
        /* transform: translate(-55%, -100%); */
    }

    .tooltip {
        pointer-events: auto;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .tooltip-content {
        padding: 16px 20px;
    }

    .tooltip-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .tooltip-title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 0.5px;
    }

    /* Mobile Popup Styles */
    .mobile-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        pointer-events: none;
    }

    .mobile-popup {
        background: #000000;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        max-width: 400px;
        width: 100%;
        position: relative;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        pointer-events: auto;
    }

    .mobile-popup-close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }

    .mobile-popup-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .mobile-popup-content {
        padding: 24px;
        text-align: center;
    }

    .mobile-popup-title {
        margin: 0 0 12px 0;
        font-size: 24px;
        font-weight: 700;
        color: white;
        letter-spacing: 0.5px;
    }

    .mobile-popup-button {
        background: #ff5e1f;
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
    }
    .mobile-popup-button:disabled {
        background: #555555;
        cursor: not-allowed;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
