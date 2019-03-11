import { Component, OnInit, Input } from '@angular/core';
import { FileInfo } from 'src/app/models/file-info';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  @Input() files: FileInfo[];

  constructor() { }

  ngOnInit() {
  }

}
