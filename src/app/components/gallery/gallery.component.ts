import { Component, OnInit, Input } from '@angular/core';
import { FileInfo } from 'src/app/models/file-info';
import {Router} from "@angular/router";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  @Input() files: FileInfo[];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onGalleryItemClicked(name: string) {
    console.log(name);
    this.router.navigate(['image', name]);
  }
}
