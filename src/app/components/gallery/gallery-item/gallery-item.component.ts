import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gallery-item',
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.scss']
})
export class GalleryItemComponent implements OnInit {
  @Input() file: string;
  loaded = false;

  constructor() { }

  ngOnInit() {
  }

}
