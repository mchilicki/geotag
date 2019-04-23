import {Component, OnInit} from '@angular/core';
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

  constructor(private route: ActivatedRoute, private exifService: ExifService, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.name = params['name'];
      if (this.exifService.hasExifGpsSection(this.name)) {
        this.itemExifInfo = this.exifService.getExifGpsInfoFromImageFile(this.name);
      } else {
        this.itemExifInfo = null;
      }
      this.initForm();
    })
  }

  onBackButtonClick() {
    this.router.navigate(['']);
  }

  private initForm() {
    this.createFormGroup();
    if (this.itemExifInfo) {
      this.latitudeValue = Math.abs(Number(this.itemExifInfo.latitude));
      this.latitudeDirection = GalleryItemFullscreenComponent.resolveLatitudeDirection(Number(this.itemExifInfo.latitude));
      this.longitudeValue = Math.abs(Number(this.itemExifInfo.longitude));
      this.longitudeDirection = GalleryItemFullscreenComponent.resolveLongitudeDirection(Number(this.itemExifInfo.longitude));
      this.createFormGroup();
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

  editButtonClicked() {
    this.exifEditMode = true;
  }

  onSubmit() {
    const latitude = GalleryItemFullscreenComponent.convertGeographicalCoordinateToNumber(this.exifForm.get('latitudeValue').value, this.exifForm.get('latitudeDirection').value);
    const longitude = GalleryItemFullscreenComponent.convertGeographicalCoordinateToNumber(this.exifForm.get('longitudeValue').value, this.exifForm.get('longitudeDirection').value)
    const exifGpsInfo : ExifGpsInfo = {latitude: latitude, longitude: longitude};
    this.exifService.setExifGpsOfImageFile(exifGpsInfo, this.name);
    this.onClose();
  }

  onClose() {
    this.exifEditMode = false;
  }

  private static convertGeographicalCoordinateToNumber(value: number, direction: string): string {
    return String(value * GalleryItemFullscreenComponent.resolveGeographicCoordinateMultiplier(direction));
  }
  private static resolveLatitudeDirection(latitude: number): string {
    return latitude >= 0 ? 'E' : 'W';
  }

  private static resolveLongitudeDirection(longitude: number): string {
    return longitude >= 0 ? 'N' : 'S';
  }

  private static resolveGeographicCoordinateMultiplier(coordinate: string): number {
    switch (coordinate) {
      case "E" : {
        return 1;
      }
      case "N" : {
        return 1;
      }
      case "W" : {
        return -1;
      }
      case "S" : {
        return -1;
      }
      default : {
        return 1;
      }
    }
  }
}
