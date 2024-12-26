<script lang="ts">
    import stationNamesWithCoords from "../data/stationNamesWithCoords.json";
    type StationWithCoords = {name: string, lat: number, lng: number};
    let lat: number;
    let lng: number;
    let nearestStation: StationWithCoords | null = null;
const getNearestStation = (lat: number, lng: number): StationWithCoords | null => {
    let nearestStation: StationWithCoords | null = null;
    let nearestDistance = Infinity;
    for (const station of stationNamesWithCoords) {
        const distance = Math.sqrt((station.lat - lat) ** 2 + (station.lng - lng) ** 2);
        if (distance < nearestDistance) {
            nearestStation = station;
            nearestDistance = distance;
        }
    }
    return nearestStation;
};

const locateUser = () => {
    // use navigator.geolocation.getCurrentPosition
    navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        nearestStation = getNearestStation(lat, lng);
    });

};

</script>

<button id="locate-me" on:click={() => {
    locateUser()
}}>
    Locate Me
    <span>{nearestStation?.name} {nearestStation?.lat} {nearestStation?.lng}</span>
</button>

<style lang="scss">
    #locate-me {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
