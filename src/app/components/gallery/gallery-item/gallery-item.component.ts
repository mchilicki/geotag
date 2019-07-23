import { Component, OnInit, Input } from '@angular/core';
import { FileInfo } from 'src/app/models/file-info';

@Component({
  selector: 'app-gallery-item',
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.scss']
})
export class GalleryItemComponent implements OnInit {
  @Input() file: FileInfo;
  loaded = false;

  constructor() { }

  ngOnInit() {
  }

}
