import { ExifGpsInfo } from './exif-gps-info';

export interface FileInfo {
    path: string;
    name: string;
    shortName: string;
    coordinates: ExifGpsInfo;
}
