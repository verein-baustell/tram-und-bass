<script lang="ts">
    /**
     * MapInlineSVG Component
     *
     * This component renders SVG map data from the CMS.
     * It accepts mapData as a string containing the SVG content.
     *
     * Usage:
     * - Add map data to the city object in the CMS
     * - The component will automatically render the SVG content
     * - Falls back to default map components if no data is provided
     */
    export let mapData: string | undefined;
</script>

{#if mapData}
    {@html mapData}
{:else}
    <!-- Fallback content if no map data is provided -->
    <g id="lines">
        <g id="placeholder">
            <text
                x="1280"
                y="1280"
                text-anchor="middle"
                fill="#ccc"
                font-size="24"
            >
                No map data available
            </text>
        </g>
    </g>
    <g id="stations">
        <!-- Empty stations group -->
    </g>
{/if}
