import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import * as piexif from 'node_modules/piexifjs/piexif';
import {ExifGpsInfo} from '../../models/exif-gps-info';

@Injectable()
export class ExifService {

  constructor(private electronService: ElectronService) {
  }

  public getExifGps(imagePath: string): ExifGpsInfo {
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

  public setExifGps(exifGpsInfo: ExifGpsInfo, imagePath: string) {
    const exifObject = this.getExifObject(imagePath);
    console.log(exifObject);
    exifObject.GPS[1] = Number(exifGpsInfo.latitude) < 0 ? 'W' : 'E';
    exifObject.GPS[2] = this.DegToDmsRational(Number(exifGpsInfo.latitude));
    exifObject.GPS[3] = Number(exifGpsInfo.longitude) < 0 ? 'S' : 'N';
    exifObject.GPS[4] = this.DegToDmsRational(Number(exifGpsInfo.longitude));
    const exifBytes = piexif.dump(exifObject);
    this.updateImageExifSection(exifBytes, imagePath, exifObject);
  }

  private updateImageExifSection(exifBytes: any, imagePath: string, exifObject: any) {
    const imageAsBase64 = this.base64_encode(imagePath);
    let base64Img: string = piexif.insert(exifBytes, 'data:image/jpeg;base64,' + imageAsBase64);
    base64Img = base64Img.substr(22);
    this.updateImageFile(base64Img, imagePath);
}

  private updateImageFile(data: string, imagePath: string) {
    const fs = this.electronService.remote.require('fs');
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(imagePath, buffer);
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


  private DegToDmsRational(degrees: number) {
    degrees = degrees > 0 ? degrees : -degrees;
    const minFloat = degrees % 1 * 60;
    const secFloat = minFloat % 1 * 60;
    const deg = Math.floor(degrees);
    const min = Math.floor(minFloat);
    const sec = Math.round(secFloat * 10000);
    return [[deg, 1], [min, 1], [sec, 10000]];
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
