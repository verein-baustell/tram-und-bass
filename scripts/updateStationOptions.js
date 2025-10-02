#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the files
const citiesMdPath = path.join(__dirname, "../src/content/cities.md");
const configPath = path.join(__dirname, "../static/admin/config.yml");

// Function to parse YAML frontmatter from cities.md
function parseCitiesMd() {
    try {
        const content = fs.readFileSync(citiesMdPath, "utf8");

        // Split content by the first --- to separate frontmatter from markdown
        const parts = content.split("---");
        if (parts.length < 3) {
            throw new Error(
                "Invalid markdown file format - no frontmatter found"
            );
        }

        const frontmatter = parts[1].trim();
        return frontmatter;
    } catch (error) {
        console.error("Error parsing cities.md:", error.message);
        return null;
    }
}

// Function to parse YAML-like structure and extract station names
function parseYamlStations(yamlContent) {
    const stationNames = new Set();
    const lines = yamlContent.split("\n");
    let inStationsSection = false;
    let currentCity = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if we're entering a city section (look for "    name:" with proper indentation)
        if (line.startsWith("    name:") && !line.startsWith("      - name:")) {
            // This is a city name line
            const cityName = line.split("name:")[1].trim();
            currentCity = cityName;
            console.log(`Processing city: ${cityName}`);
        }

        // Check if we're entering the stations section
        if (line === "    stations:") {
            inStationsSection = true;
            continue;
        }

        // Check if we're leaving the stations section (next section or next city)
        if (
            inStationsSection &&
            (line.startsWith("    lines:") ||
                line.startsWith("  - color:") ||
                line.startsWith("cities:"))
        ) {
            inStationsSection = false;
            currentCity = null;
        }

        // If we're in the stations section and this is a station entry
        if (inStationsSection && line.startsWith("      - name:")) {
            const stationName = line.split("- name:")[1].trim();
            if (stationName) {
                stationNames.add(stationName);
            }
        }
    }

    return Array.from(stationNames).sort();
}

// Function to load station names from cities.md file
function loadStationNames() {
    try {
        console.log("Loading station names from cities.md...");

        // Parse the cities.md file
        const yamlContent = parseCitiesMd();
        if (!yamlContent) {
            console.log("Failed to parse cities.md. Exiting.");
            return [];
        }

        // Extract station names from the YAML content
        const stationNames = parseYamlStations(yamlContent);

        console.log(
            `Found ${stationNames.length} unique station names from cities.md`
        );
        return stationNames;
    } catch (error) {
        console.error("Error loading station data:", error.message);
        process.exit(1);
    }
}

// Function to update the config.yml file
function updateConfigFile(stationNames) {
    try {
        let configContent = fs.readFileSync(configPath, "utf8");

        // Create the new options array content as inline array
        const optionsContent = `[${stationNames
            .map((name) => `"${name}"`)
            .join(", ")}]`;

        // Replace [STATION_NAMES] placeholder with actual station names
        const newConfigContent = configContent.replace(
            "[STATION_NAMES]",
            optionsContent
        );

        // Write the updated content back to the file
        fs.writeFileSync(configPath, newConfigContent, "utf8");

        console.log(
            `Successfully updated config.yml with ${stationNames.length} station options`
        );
    } catch (error) {
        console.error("Error updating config file:", error.message);
        process.exit(1);
    }
}

// Main execution
function main() {
    console.log("Starting station options update from cities.md...");

    // Load station names from cities.md file
    const stationNames = loadStationNames();

    if (stationNames.length === 0) {
        console.log("No station names found in cities.md");
        return;
    }

    console.log(`Found ${stationNames.length} unique station names`);

    // Update the config file
    updateConfigFile(stationNames);

    console.log("Station options update completed successfully!");
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { loadStationNames, updateConfigFile };
