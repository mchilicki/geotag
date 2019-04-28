import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subject } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FileInfo } from 'src/app/models/file-info';

const IMAGE_EXTENSIONS = ['jpg', 'png', 'gif'];

@Injectable({
  providedIn: 'root'
})
export class FileDialogService {
  files: FileInfo[];
  filePaths: string[];

  private subject = new Subject<FileInfo[]>();
  getFiles = this.subject.asObservable();

  constructor(private electronService: ElectronService,
              private imageCompress: NgxImageCompressService) { }

  loadImageFiles() {
    this.filePaths = this.electronService.remote.dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Images', extensions: IMAGE_EXTENSIONS }
        ]
      })
      .map(file => `file:///${file}`);

    this.files = this.compressImages(this.filePaths); // .then(result => {
        // this.files = result;
    this.subject.next(this.files);
        // });
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
      this.filePaths = fs.readdirSync(directory)
        .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).replace('.', '')))
        .map(file => `file:///${path.join(directory, file)}`);

      this.files = this.compressImages(this.filePaths); // .then(result => {
      // this.files = result;
      this.subject.next(this.files);
      // });
    }
  }

  compressImages(images: string[]): FileInfo[] {
    const compressedImages: FileInfo[] = [];
    images.forEach(async image => {
      await this.imageCompress.compressFile(image, 1, 30, 30).then(
        result => {
          compressedImages.push({
            name: image,
            path: result
          });
        }
      );
    });

    return compressedImages;
  }
}
