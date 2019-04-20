import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExifGpsInfo} from "../../../models/exif-gps-info";
import {ExifService} from "../../../services/exif/exif.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-gallery-item-fullscreen',
  templateUrl: './gallery-item-fullscreen.component.html',
  styleUrls: ['./gallery-item-fullscreen.component.scss']
})
export class GalleryItemFullscreenComponent implements OnInit {
  name: string;

  latitudeValue: number;
  latitudeDirection: string;
  longitudeValue: number;
  longitudeDirection: string;
  exifForm: FormGroup;

  itemExifInfo: ExifGpsInfo;
  exifEditMode = false;

  constructor(private route: ActivatedRoute, private exifService: ExifService,private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.name = params['name'];
      console.log(this.name);
      if (this.exifService.hasExifGpsSection(this.name)) {
        this.itemExifInfo = this.exifService.getExifGpsInfoFromImageFile(this.name);
      } else {
        this.itemExifInfo = null;
      }
      console.log(this.itemExifInfo);
    })
  }

  onBackButtonClick() {
    this.router.navigate(['']);
  }

  private initForm() {
    this.createFormGroup();
    if (this.itemExifInfo) {
      Math.abs(this.itemExifInfo.latitude)

    }
  }

  private createFormGroup() {
    this.exifForm = new FormGroup({
      'latitudeValue': new FormControl(this.latitudeValue),
      'latitudeDirection': new FormControl(this.latitudeDirection),
      'longitudeValue': new FormControl(this.longitudeValue),
      'longitudeDirection': new FormControl(this.longitudeDirection)
    });
  }

  private static resolveLatitudeDirection(latitude: number): string {
    return latitude >= 0 ? 'E' : 'W';
  }

  private static resolveLongitudeDirection(longitude: number): string {
    return longitude >= 0 ? 'N' : 'S';
  }
}
