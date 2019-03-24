import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import * as piexif from 'node_modules/piexifjs/piexif';
import {GpsExifInfo} from '../../models/gps-exif-info';

@Injectable()
export class ExifService {

  constructor(private electronService: ElectronService) {
  }

  public getExifGps(imagePath: string) {
    try {
      let gpsExifInfo;
      const imageAsBase64 = this.base64_encode(imagePath);
      const exifObject = piexif.load('data:image/jpeg;base64,' + imageAsBase64);
      if (exifObject !== 'undefined' && exifObject.GPS !== 'undefined') {
        gpsExifInfo = new GpsExifInfo(
          this.dmsRationalToDeg(exifObject.GPS[2]).toString(),
          this.dmsRationalToDeg(exifObject.GPS[4]).toString()
        );
      }
      return gpsExifInfo;
    } catch (e) {
      console.log(e);
    }
  }

  private base64_encode(imagePath: string) {
    const fs = this.electronService.remote.require('fs');
    // read binary data
    const bitmap = fs.readFileSync(imagePath);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
  }



  private dmsRationalToDeg(coordinates) {
     const deg = coordinates[0][0] / coordinates[0][1];
     const min = coordinates[1][0] / coordinates[1][1];
     const sec = coordinates[2][0] / coordinates[2][1];
     // console.log('deg: ' + deg + ' min: ' + min + ' sec: ' + sec);
     return deg + (min + sec / 60) / 60;
  }
}
