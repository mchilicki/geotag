import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import * as piexif from 'node_modules/piexifjs/piexif';
import {ExifGpsInfo} from '../../models/exif-gps-info';

@Injectable()
export class ExifService {

  constructor(private electronService: ElectronService) {
  }

  public getExifGps(imagePath: string) {
    let gpsExifInfo;
    try {
      const exifObject = this.getExifObject(imagePath);
      if (this.containExifGpsSection(exifObject)) {
        gpsExifInfo = new ExifGpsInfo(
          this.dmsRationalToDeg(exifObject.GPS[1], exifObject.GPS[2]).toString(),
          this.dmsRationalToDeg(exifObject.GPS[3], exifObject.GPS[4]).toString()
        );
      }
    } catch (e) {
      console.log(e);
    }
    return gpsExifInfo;
  }

  public hasExifGps(imagePath: string): boolean {
    const exifObject = this.getExifObject(imagePath);
    return this.containExifGpsSection(exifObject);
  }

  private containExifGpsSection(exifObject): boolean {
    return exifObject !== 'undefined' && exifObject.GPS !== 'undefined' && typeof exifObject.GPS[1] !== 'undefined';
  }

  private getExifObject(imagePath: string) {
    const imageAsBase64 = this.base64_encode(imagePath);
    return piexif.load('data:image/jpeg;base64,' + imageAsBase64);
  }

  private base64_encode(imagePath: string) {
    const fs = this.electronService.remote.require('fs');
    // read binary data
    const bitmap = fs.readFileSync(imagePath);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
  }



  private dmsRationalToDeg(cardinalDirection, coordinates) {
    const deg = coordinates[0][0] / coordinates[0][1];
    const min = coordinates[1][0] / coordinates[1][1];
    const sec = coordinates[2][0] / coordinates[2][1];
    let result =  deg + (min + sec / 60) / 60;
    if (cardinalDirection === 'S' || cardinalDirection === 'W') {
      result = -result;
    }
    return result;
  }
}
