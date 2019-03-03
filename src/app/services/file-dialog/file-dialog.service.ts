import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

const IMAGE_EXTENSIONS = ['jpg', 'png', 'gif'];

@Injectable({
  providedIn: 'root'
})
export class FileDialogService {
  files: string[];
  constructor(private electronService: ElectronService) { }

  loadImageFiles(): string[] {
    return this.electronService.remote.dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Images', extensions: IMAGE_EXTENSIONS }
        ]
      });
  }

  loadFilesFromDirectory(): string[] {
    const dirPaths = this.electronService.remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      });
    if (dirPaths && dirPaths.length > 0) {
      const fs = this.electronService.remote.require('fs');
      const path = this.electronService.remote.require('path');
      const directory = dirPaths[0];
      return fs.readdirSync(directory)
          .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).replace('.', '')))
          .map(file => path.join(directory, file));
    }
  }
}
