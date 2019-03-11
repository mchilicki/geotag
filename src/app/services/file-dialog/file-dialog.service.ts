import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs';

const IMAGE_EXTENSIONS = ['jpg', 'png', 'gif'];

@Injectable({
  providedIn: 'root'
})
export class FileDialogService {
  files: string[];

  private subject = new Subject<string[]>();
  getFiles = this.subject.asObservable();

  constructor(private electronService: ElectronService) { }

  loadImageFiles() {
    this.files = this.electronService.remote.dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Images', extensions: IMAGE_EXTENSIONS }
        ]
      });

    this.subject.next(this.files);
  }

  loadFilesFromDirectory() {
    const dirPaths = this.electronService.remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      });
    if (dirPaths && dirPaths.length > 0) {
      const fs = this.electronService.remote.require('fs');
      const path = this.electronService.remote.require('path');
      const directory = dirPaths[0];
      this.files = fs.readdirSync(directory)
        .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).replace('.', '')))
        .map(file => path.join(directory, file));

      this.subject.next(this.files);
    }
  }
}
