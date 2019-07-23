import { Pipe, PipeTransform } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Pipe({
  name: 'basename'
})
export class BasenamePipe implements PipeTransform {
  constructor(private electronService: ElectronService) { }

  transform(value: string): string {
    const path = this.electronService.remote.require('path');
    return path.basename(value);
  }

}
