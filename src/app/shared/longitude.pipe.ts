import { Pipe, PipeTransform } from '@angular/core';
import {ExifGpsInfo} from '../models/exif-gps-info';

@Pipe({
  name: 'longitude'
})
export class LongitudePipe implements PipeTransform {

  transform(value: ExifGpsInfo): string {
    if (!value || !value.longitude) {
      return 'Not set';
    }
    if (Number(value.longitude) >= 0) {
      return value.longitude + '° N';
    } else {
      return (Number(value.longitude) * -1) + '° S';
    }
  }

}
