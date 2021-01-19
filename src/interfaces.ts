export interface Coordinate {
    latitude: number;
    longitude: number;
};

export interface WeatherCity {
    name: string;
    max: number;
    min: number;
    humidity: number;
    icon: string;
}
