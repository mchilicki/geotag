import { ExifGpsInfo } from 'src/app/models/exif-gps-info';
import { Injectable } from '@angular/core';
import { LatLng } from 'src/app/models/latLng';

@Injectable({
    providedIn: 'root'
})
export class ExifCoordinatesMapper {
    constructor() {

    }

    public toLatLng(coordinates: ExifGpsInfo): LatLng {
        return {
            lat: this.toNumber(coordinates.latitude),
            lng: this.toNumber(coordinates.longitude),
        };
    }

    public toExifGpsInfo(coordinates: LatLng): ExifGpsInfo {
        return {
            latitude: this.toString(coordinates.lat),
            longitude: this.toString(coordinates.lng),
        };
    }

    private toNumber(str: string): number {
        return Number(str);
    }

    private toString(num: number): string {
        return num.toString();
    }
}