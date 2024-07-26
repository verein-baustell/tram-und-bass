import re
import argparse

# Define the mappings of incorrectly encoded characters to their correct counterparts
encoding_corrections = {
    '&#195;&#188;': 'ü',
    '&#195;&#182;': 'ö',
    '&#195;&#164;': 'ä'
}

def correct_svg_encoding(input_file):
    # Read the SVG file
    with open(input_file, 'r', encoding='utf-8') as file:
        svg_content = file.read()

    # Replace all occurrences of the encoded strings with the correct characters
    for encoded, correct in encoding_corrections.items():
        svg_content = svg_content.replace(encoded, correct)

    # Write the corrected content back to the file
    output_file = f"{input_file.split('.svg')[0]}_corrected.svg"
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(svg_content)

    print(f"All special characters corrected successfully. Output file: {output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Correct encoded characters in an SVG file.")
    parser.add_argument('input_file', type=str, help="The input SVG file to be corrected.")
    args = parser.parse_args()
    correct_svg_encoding(args.input_file)
