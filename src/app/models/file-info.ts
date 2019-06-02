import { ExifGpsInfo } from './exif-gps-info';

export interface FileInfo {
    path: string;
    name: string;
    coordinates: ExifGpsInfo;
}
