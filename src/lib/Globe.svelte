<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

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
    let isHovering = false;

    let handleResize: (() => void) | null = null;

    // Function to update tooltip position
    function updateTooltipPosition() {
        if (tooltip && tooltipVisible && tooltipData) {
            // Calculate position based on the hovered city
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Position tooltip to the right of the center
            tooltip.style.left = `${centerX + 100}px`;
            tooltip.style.top = `${centerY - 50}px`;
        }
    }

    // Function to handle mouse move for tooltip positioning
    function handleMouseMove(event: MouseEvent) {
        if (tooltip && tooltipVisible) {
            // Position tooltip near mouse cursor
            tooltip.style.left = `${event.clientX + 15}px`;
            tooltip.style.top = `${event.clientY - 15}px`;
        }
    }

    onMount(() => {
        // Only run on client side
        if (!browser) return;

        // Dynamic import to avoid SSR issues
        import("globe.gl").then(({ default: Globe }) => {
            // Initialize the globe
            globe = new Globe(container)
                .globeImageUrl(
                    "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                )
                .bumpImageUrl(
                    "//unpkg.com/three-globe/example/img/earth-topology.png"
                )
                .width(container.offsetWidth)
                .showAtmosphere(false)
                .pointOfView({
                    lat: initialLat,
                    lng: initialLng,
                    altitude: initialAltitude,
                });

            // Add some sample data points for cities
            const cities = [
                {
                    lat: 47.3769,
                    lng: 8.5417,
                    name: "Zürich",
                    size: 0.5,
                    color: "#FFFFFF",
                    url: "/zurich",
                },
                {
                    lat: 50.8278,
                    lng: 12.9214,
                    name: "Chemnitz",
                    size: 0.5,
                    color: "#FFFFFF",
                    url: "/chemnitz",
                },
            ];

            // Add city markers
            globe
                .pointsData(cities)
                .pointLat("lat")
                .pointLng("lng")
                .pointColor("color")
                .pointAltitude(0.01)
                .pointRadius("size")
                .pointResolution(100)
                .onPointHover((point: any) => {
                    // Change cursor to pointer when hovering over cities
                    if (point) {
                        container.style.cursor = "pointer";
                        isHovering = true;

                        // Stop auto-rotation on hover
                        if (globe.controls()) {
                            globe.controls().autoRotate = false;
                        }

                        // Show tooltip on point hover
                        if (point.name) {
                            tooltipData = point;
                            tooltipVisible = true;
                            updateTooltipPosition();
                        }
                    } else {
                        container.style.cursor = "default";
                        isHovering = false;
                        tooltipVisible = false;

                        // Resume auto-rotation when not hovering
                        if (globe.controls() && enableAutoRotate) {
                            globe.controls().autoRotate = true;
                        }
                    }
                })
                .onPointClick((point: any) => {
                    // Navigate to the city page when a city is clicked
                    if (point && point.url) {
                        goto(point.url);
                    }
                });

            // Add city labels with proper UTF-8 support
            globe
                .labelsData(cities)
                .labelLat("lat")
                .labelLng("lng")
                .labelText("name")
                .labelSize(1.5)
                .labelDotRadius(0.6)
                .labelColor(() => "#ffffff")
                .labelAltitude(0.02)
                .labelResolution(3)
                .labelTypeFace("Arial, Helvetica, sans-serif")
                .onLabelHover((label: any, prevLabel: any) => {
                    // Show tooltip on hover
                    if (label && label.name) {
                        isHovering = true;

                        // Stop auto-rotation on hover
                        if (globe.controls()) {
                            globe.controls().autoRotate = false;
                        }

                        tooltipData = label;
                        tooltipVisible = true;
                        updateTooltipPosition();
                    } else {
                        isHovering = false;
                        tooltipVisible = false;

                        // Resume auto-rotation when not hovering
                        if (globe.controls() && enableAutoRotate) {
                            globe.controls().autoRotate = true;
                        }
                    }
                })
                .onLabelClick((label: any) => {
                    // Navigate to the city page when a label is clicked
                    if (label && label.url) {
                        goto(label.url);
                    }
                });

            // Handle window resize
            handleResize = () => {
                if (globe && container) {
                    globe.width(container.offsetWidth);
                }
            };

            window.addEventListener("resize", handleResize);
            container.addEventListener("mousemove", handleMouseMove);

            // Add container hover handlers for rotation control
            container.addEventListener("mouseenter", () => {
                if (globe.controls() && enableAutoRotate) {
                    globe.controls().autoRotate = false;
                }
            });

            container.addEventListener("mouseleave", () => {
                if (globe.controls() && enableAutoRotate && !isHovering) {
                    globe.controls().autoRotate = true;
                }
            });

            // Configure auto-rotate if enabled
            if (enableAutoRotate) {
                globe.controls().autoRotate = true;
                globe.controls().autoRotateSpeed = autoRotateSpeed;
            }

            // Set loading to false once globe is initialized
            isLoading = false;
        });

        // Cleanup function
        return () => {
            if (handleResize && typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
                handleResize = null;
            }
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
            }
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
{#if tooltipVisible && tooltipData}
    <div class="tooltip" bind:this={tooltip} class:expanded={tooltipVisible}>
        <div class="tooltip-content">
            <div class="tooltip-header">
                <h3 class="tooltip-title">{tooltipData.name}</h3>
                <div class="tooltip-icon">📍</div>
            </div>
            <div class="tooltip-body">
                <p class="tooltip-description">Click to explore this city</p>
                <div class="tooltip-actions">
                    <button
                        class="tooltip-button"
                        on:click={() => goto(tooltipData.url)}
                    >
                        Explore {tooltipData.name}
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .globe-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    :global(.globe-container canvas) {
        border-radius: 15px;
    }

    .tooltip {
        position: fixed;
        z-index: 1000;
        pointer-events: auto;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.3);
        max-width: 280px;
        min-width: 200px;
        transform: translateX(100px) translateY(-50%);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
    }

    .tooltip.expanded {
        transform: translateX(0) translateY(-50%);
        opacity: 1;
    }

    .tooltip-content {
        padding: 16px 20px;
    }

    .tooltip-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tooltip-title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 0.5px;
    }

    .tooltip-icon {
        font-size: 20px;
        opacity: 0.8;
    }

    .tooltip-body {
        animation: slideIn 0.3s ease-out 0.1s both;
    }

    .tooltip-description {
        margin: 0 0 16px 0;
        font-size: 14px;
        color: #cccccc;
        line-height: 1.4;
    }

    .tooltip-actions {
        display: flex;
        justify-content: center;
    }

    .tooltip-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .tooltip-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .tooltip-button:active {
        transform: translateY(0);
    }

    /* Arrow pointing down */
    .tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 8px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.95);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
