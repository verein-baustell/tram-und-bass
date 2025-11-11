#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the files
const stationsJsonPath = path.join(
    __dirname,
    "../src/data/stationsZurich.json"
);
const citiesMdPath = path.join(__dirname, "../src/content/cities.md");

// Function to load stations from JSON file
function loadStationsFromJson() {
    try {
        const stationsData = JSON.parse(
            fs.readFileSync(stationsJsonPath, "utf8")
        );
        console.log(
            `Loaded ${stationsData.length} stations from stationsZurich.json`
        );
        return stationsData;
    } catch (error) {
        console.error("Error loading stations from JSON:", error.message);
        return [];
    }
}

// Function to parse the cities.md file and extract the YAML frontmatter
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
        const markdownContent = parts.slice(2).join("---");

        return { frontmatter, markdownContent };
    } catch (error) {
        console.error("Error parsing cities.md:", error.message);
        return null;
    }
}

// Function to convert stations array to YAML format
function stationsToYaml(stations) {
    return stations
        .map(
            (station) =>
                `      - name: ${station.name}\n        lat: ${station.lat}\n        lng: ${station.lng}`
        )
        .join("\n");
}

// Function to update the frontmatter with new stations
function updateFrontmatterWithStations(frontmatter, stations) {
    // Find the Zurich city section and replace its stations
    const lines = frontmatter.split("\n");
    const newLines = [];
    let inZurichSection = false;
    let inStationsSection = false;
    let stationsAdded = false;
    let skipOldStations = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if we're entering the Zurich city section
        if (line.includes("name: Zürich") || line.includes("slug: zurich")) {
            inZurichSection = true;
            newLines.push(line);
            continue;
        }

        // Check if we're leaving the Zurich city section (next city or end of cities)
        if (
            inZurichSection &&
            (line.startsWith("  - ") || line.startsWith("cities:"))
        ) {
            inZurichSection = false;
            inStationsSection = false;
            skipOldStations = false;
        }

        // If we're in the Zurich section and find the stations section
        if (inZurichSection && line.includes("stations:")) {
            inStationsSection = true;
            newLines.push(line);

            // Add all the stations
            if (!stationsAdded) {
                const stationsYaml = stationsToYaml(stations);
                newLines.push(stationsYaml);
                stationsAdded = true;
                skipOldStations = true;
            }
            continue;
        }

        // If we're in the stations section, skip the old stations
        if (
            inStationsSection &&
            skipOldStations &&
            line.startsWith("      - name:")
        ) {
            continue;
        }

        // If we're in the stations section and hit a non-station line, we're done with stations
        if (
            inStationsSection &&
            !line.startsWith("      -") &&
            line.trim() !== ""
        ) {
            inStationsSection = false;
            skipOldStations = false;
        }

        newLines.push(line);
    }

    return newLines.join("\n");
}

// Main function
function main() {
    console.log("Starting to populate Zurich stations...");

    // Load stations from JSON
    const stations = loadStationsFromJson();
    if (stations.length === 0) {
        console.log("No stations found in JSON file. Exiting.");
        return;
    }

    // Parse the cities.md file
    const parsed = parseCitiesMd();
    if (!parsed) {
        console.log("Failed to parse cities.md. Exiting.");
        return;
    }

    // Update the frontmatter with new stations
    const updatedFrontmatter = updateFrontmatterWithStations(
        parsed.frontmatter,
        stations
    );

    // Reconstruct the file
    const newContent = `---\n${updatedFrontmatter}\n---${parsed.markdownContent}`;

    // Write the updated content back to the file
    try {
        fs.writeFileSync(citiesMdPath, newContent, "utf8");
        console.log(
            `Successfully updated cities.md with ${stations.length} Zurich stations`
        );
    } catch (error) {
        console.error("Error writing updated cities.md:", error.message);
    }
}

// Run the script
main();
