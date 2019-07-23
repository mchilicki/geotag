import { Pipe, PipeTransform } from '@angular/core';
import { ExifGpsInfo } from '../models/exif-gps-info';

@Pipe({
  name: 'latitude'
})
export class LatitudePipe implements PipeTransform {

  transform(value: ExifGpsInfo): string {
    if (!value || !value.latitude) {
      return 'Not set';
    }
    if (Number(value.latitude) >= 0) {
      return value.latitude + '° E';
    } else {
      return (Number(value.latitude) * -1) + '° W';
    }
  }

}
