import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import * as piexif from 'node_modules/piexifjs/piexif';
import {ExifGpsInfo} from '../../models/exif-gps-info';

@Injectable()
export class ExifService {

  constructor(private electronService: ElectronService) {
  }
  /*
    Returns true if image file has exif GPS section,
    otherwise returns false
   */
  public hasExifGpsSection(imagePath: string): boolean {
    const exifObject = this.getExifObjectFromImageFile(imagePath);
    return this.containExifGpsSection(exifObject);
  }

  /*
    Returns latitude and longitude in ExifGpsInfo interface format if
    image contains exif gps section, otherwise throws exception.
    It is recommended to combine this method with "hasExifGpsSection" method first.
   */
  public getExifGpsInfoFromImageFile(imagePath: string): ExifGpsInfo {
    let gpsExifInfo: ExifGpsInfo;
    try {
      const exifObject = this.getExifObjectFromImageFile(imagePath);
      console.log(exifObject);
      if (this.containExifGpsSection(exifObject)) {
        gpsExifInfo = {
          latitude: this.dmsRationalToDeg(exifObject.GPS[1], exifObject.GPS[2]).toString(),
          longitude: this.dmsRationalToDeg(exifObject.GPS[3], exifObject.GPS[4]).toString()};
      }
    } catch (e) {
      console.log(e);
    }
    return gpsExifInfo;
  }

  /*
    Set or update (if exists) exif gps section of image file.
    As parameters takes latitude and longitude in ExifGpsInfo interface format
    and path to image file.
   */
  public setExifGps(exifGpsInfo: ExifGpsInfo, imagePath: string) {
    const imageAsBase64 = this.readImageFileAsBase64(imagePath);
    const exifObject = this.getExifObjectFromBase64(imageAsBase64);
    exifObject.GPS[1] = Number(exifGpsInfo.latitude) < 0 ? 'W' : 'E';
    exifObject.GPS[2] = this.DegToDmsRational(Number(exifGpsInfo.latitude));
    exifObject.GPS[3] = Number(exifGpsInfo.longitude) < 0 ? 'S' : 'N';
    exifObject.GPS[4] = this.DegToDmsRational(Number(exifGpsInfo.longitude));
    const exifBytes = piexif.dump(exifObject);
    this.updateImageExifSection(exifBytes, imagePath, imageAsBase64);
  }

  private updateImageExifSection(exifBytes: any, imagePath: string, imageAsBase64: string) {
    let base64Img: string = piexif.insert(exifBytes, 'data:image/jpeg;base64,' + imageAsBase64);
    base64Img = base64Img.substr(22); // Image file can't contain imageURI "header"
    this.updateImageFile(base64Img, imagePath);
}

  private updateImageFile(data: string, imagePath: string) {
    const fs = this.electronService.remote.require('fs');
    const buffer = Buffer.from(data, 'base64'); // decode from base64 format
    fs.writeFileSync(imagePath, buffer);
  }

  private containExifGpsSection(exifObject): boolean {
    return exifObject !== 'undefined' && exifObject.GPS !== 'undefined' && typeof exifObject.GPS[1] !== 'undefined';
  }

  private getExifObjectFromImageFile(imagePath: string) {
    const imageAsBase64 = this.readImageFileAsBase64(imagePath);
    return this.getExifObjectFromBase64(imageAsBase64);
  }

  private getExifObjectFromBase64(imageAsBase64: string) {
    return piexif.load('data:image/jpeg;base64,' + imageAsBase64);
  }

  private readImageFileAsBase64(imagePath: string): string {
    const fs = this.electronService.remote.require('fs');
    const bitmap = fs.readFileSync(imagePath);
    return Buffer.from(bitmap).toString('base64');
  }

  /*
    Converts latitude or longitude into degrees, minutes and seconds
    as three rational numbers.
   */
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
    let coordinate =  deg + (min + sec / 60) / 60;
    if (cardinalDirection === 'S' || cardinalDirection === 'W') {
      coordinate = -coordinate;
    }
    return coordinate;
  }
}
