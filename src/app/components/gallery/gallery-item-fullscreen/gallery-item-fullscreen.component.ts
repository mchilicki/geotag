import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExifGpsInfo} from '../../../models/exif-gps-info';
import {ExifService} from '../../../services/exif/exif.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-gallery-item-fullscreen',
  templateUrl: './gallery-item-fullscreen.component.html',
  styleUrls: ['./gallery-item-fullscreen.component.scss']
})
export class GalleryItemFullscreenComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private exifService: ExifService,
              private router: Router) {
  }
  name: string;

  latitudeValue: number;
  latitudeDirection: string;
  longitudeValue: number;
  longitudeDirection: string;
  exifForm: FormGroup;

  itemExifInfo: ExifGpsInfo;
  exifEditMode = false;

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
      case 'E' : {
        return 1;
      }
      case 'N' : {
        return 1;
      }
      case 'W' : {
        return -1;
      }
      case 'S' : {
        return -1;
      }
      default : {
        return 1;
      }
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.name = params.name;
      this.initExifInfo();
      this.initForm();
    });
  }

  onBackButtonClick() {
    this.router.navigate(['']);
  }

  private initExifInfo() {
    if (this.exifService.hasExifGpsSection(this.name)) {
      this.itemExifInfo = this.exifService.getExifGpsInfoFromImageFile(this.name);
    } else {
      this.itemExifInfo = null;
    }
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
      latitudeValue: new FormControl(this.latitudeValue, [Validators.required, Validators.min(0), Validators.max(90)]),
      latitudeDirection: new FormControl(this.latitudeDirection, Validators.required),
      longitudeValue: new FormControl(this.longitudeValue, [Validators.required, Validators.min(0), Validators.max(180)]),
      longitudeDirection: new FormControl(this.longitudeDirection, Validators.required)
    });
  }

  editButtonClicked() {
    this.exifEditMode = true;
  }

  onSubmit() {
    const latitude = GalleryItemFullscreenComponent.convertGeographicalCoordinateToNumber(this.exifForm.get('latitudeValue').value, this.exifForm.get('latitudeDirection').value);
    const longitude = GalleryItemFullscreenComponent.convertGeographicalCoordinateToNumber(this.exifForm.get('longitudeValue').value, this.exifForm.get('longitudeDirection').value);
    const exifGpsInfo: ExifGpsInfo = {latitude, longitude};
    this.exifService.setExifGpsOfImageFile(exifGpsInfo, this.name);
    this.initExifInfo();
    this.onClose();
  }

  onClose() {
    this.exifEditMode = false;
  }
}
