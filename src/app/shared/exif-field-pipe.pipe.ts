import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exifFieldPipe'
})
export class ExifFieldPipePipe implements PipeTransform {

  transform(value: string): string {
    return value === null || value.length === 0 ? "Not set" : value;
  }

}
