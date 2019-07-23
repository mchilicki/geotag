import { Component, OnInit, Input } from '@angular/core';
import { FileInfo } from 'src/app/models/file-info';

@Component({
  selector: 'app-gallery-list-item',
  templateUrl: './gallery-list-item.component.html',
  styleUrls: ['./gallery-list-item.component.scss']
})
export class GalleryListItemComponent implements OnInit {

  @Input() file: FileInfo;
  loaded = false;

  constructor() { }

  ngOnInit() {
  }

}
