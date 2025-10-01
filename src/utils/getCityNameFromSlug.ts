import { attributes as citiesContent } from "../content/cities.md";

/**
 * Get the city name from a city slug
 * @param slug - The city slug to look up
 * @returns The city name if found, undefined otherwise
 */
export function getCityNameFromSlug(
    slug: string | undefined
): string | undefined {
    if (!slug) return undefined;

    const cities = citiesContent.cities || [];
    const city = cities.find((city) => city.slug === slug);
    return city?.name;
}

/**
 * Get the full city object from a city slug
 * @param slug - The city slug to look up
 * @returns The city object if found, undefined otherwise
 */
export function getCityFromSlug(slug: string | undefined): City | undefined {
    if (!slug) return undefined;

    const cities = citiesContent.cities || [];
    return cities.find((city) => city.slug === slug);
}

/**
 * Get the city short name from a city slug
 * @param slug - The city slug to look up
 * @returns The city short name if found, undefined otherwise
 */
export function getCityShortNameFromSlug(
    slug: string | undefined
): string | undefined {
    if (!slug) return undefined;
    const cities = citiesContent.cities || [];
    const city = cities.find((city) => city.slug === slug);
    return city?.shortName;
}
