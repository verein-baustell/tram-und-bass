#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the data directory and config file
const dataDir = path.join(__dirname, "../src/data");
const configPath = path.join(__dirname, "../static/admin/config.yml");

// Function to load station names from all JSON files in data directory
function loadStationNames() {
    const stationNames = new Set(); // Use Set to avoid duplicates

    try {
        // Check if data directory exists
        if (!fs.existsSync(dataDir)) {
            console.log("Data directory not found:", dataDir);
            return [];
        }

        // Get all JSON files in the data directory
        const files = fs
            .readdirSync(dataDir)
            .filter((file) => file.endsWith(".json"));

        if (files.length === 0) {
            console.log("No JSON files found in data directory");
            return [];
        }

        console.log(`Found ${files.length} JSON files in data directory`);

        // Load stations from each JSON file
        files.forEach((file) => {
            const filePath = path.join(dataDir, file);
            try {
                const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));

                // Handle both array format and object format
                const stations = Array.isArray(fileData)
                    ? fileData
                    : Object.values(fileData);

                stations.forEach((station) => {
                    if (station && station.name) {
                        stationNames.add(station.name);
                    }
                });

                console.log(`Loaded ${stations.length} stations from ${file}`);
            } catch (fileError) {
                console.error(`Error loading ${file}:`, fileError.message);
            }
        });
    } catch (error) {
        console.error("Error loading station data:", error.message);
        process.exit(1);
    }

    return Array.from(stationNames).sort(); // Convert to sorted array
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
    console.log("Starting station options update...");

    // Load station names from data files
    const stationNames = loadStationNames();

    if (stationNames.length === 0) {
        console.log("No station names found in data files");
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
