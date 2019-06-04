import { Coordinates } from 'src/app/models/coordinates';
import { ExifGpsInfo } from 'src/app/models/exif-gps-info';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExifCoordinatesMapper {
    public toExifGpsInfo(coordinates: Coordinates): ExifGpsInfo {
        return {
            longitude: this.toString(coordinates.longitude),
            latitude: this.toString(coordinates.latitude),
        };
    }

    public toCoordinates(gpsInfo: ExifGpsInfo): Coordinates {
        return {
            longitude: this.toNumber(gpsInfo.longitude),
            latitude: this.toNumber(gpsInfo.latitude),
        };
    }

    private toNumber(str: string): number {
        return Number(str);
    }

    private toString(num: number): string {
        return num.toString();
    }
}