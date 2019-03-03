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
    this.electronService.remote.dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Images', extensions: IMAGE_EXTENSIONS }
        ]
      },
      (filePaths) => this.onFileDialogClosed(filePaths));

    return this.files;
  }

  loadFilesFromDirectory(): string[] {
    this.electronService.remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      (filePaths) => this.onFileDialogClosed(filePaths, true));

    return this.files;
  }

  private onFileDialogClosed(filePaths: string[], isDirectory?: boolean) {
    if (!isDirectory) {
      this.files = filePaths;
    } else {
      if (filePaths && filePaths.length > 0) {
        const fs = this.electronService.remote.require('fs');
        const path = this.electronService.remote.require('path');
        const directory = filePaths[0];

        fs.readdir(directory, (_: any, files: string[]) => {
          this.files = files.map(file => path.join(directory, file));
        });
      } else {
        this.files = null;
      }
    }
  }
}
