import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FileInfo } from 'src/app/models/file-info';
import { ExifService } from '../exif/exif.service';

const IMAGE_EXTENSIONS = ['jpg', 'tif'];

@Injectable({
  providedIn: 'root'
})
export class FileDialogService {
  files: FileInfo[];
  filePaths: string[];

  private subject = new BehaviorSubject<FileInfo[]>(null);
  uploadedFiles = this.subject.asObservable();

  constructor(private electronService: ElectronService,
    private imageCompress: NgxImageCompressService,
    private exifService: ExifService) { }

  loadImageFiles() {
    const filePaths = this.electronService.remote.dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Images', extensions: IMAGE_EXTENSIONS }
        ]
      });

    if (filePaths && filePaths.length > 0) {
      this.filePaths = filePaths.map(file => `${file}`);

      this.compressImages(this.filePaths).then(data => {
        this.files = this.exifService.getExifGpsInfoForImages(data);
        this.subject.next(this.files);
      });
    }
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
        .map(file => `${path.join(directory, file)}`);

      this.compressImages(this.filePaths).then(data => {
        this.files = this.exifService.getExifGpsInfoForImages(data);
        this.subject.next(this.files);
      });
    }
  }

  async compressImages(images: string[]): Promise<FileInfo[]> {
    const compressedImages: FileInfo[] = [];
    for (const image of images) {
      const compressedImage = await this.imageCompress.compressFile(image, 1, 30, 30);
      compressedImages.push({
        name: image,
        path: compressedImage,
        coordinates: null,
      });
    }
    return compressedImages;
  }
}
