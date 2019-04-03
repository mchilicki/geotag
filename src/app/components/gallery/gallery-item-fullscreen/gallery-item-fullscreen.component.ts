import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-gallery-item-fullscreen',
  templateUrl: './gallery-item-fullscreen.component.html',
  styleUrls: ['./gallery-item-fullscreen.component.scss']
})
export class GalleryItemFullscreenComponent implements OnInit {
  path: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.path = params['path'];
    })
  }

  onBackButtonClick() {
    this.router.navigate(['']);
  }
}
