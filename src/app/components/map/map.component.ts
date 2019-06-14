import { Component, OnInit, Input } from '@angular/core';
import { FileInfo } from 'src/app/models/file-info';
import { FileDialogService } from 'src/app/services/file-dialog/file-dialog.service';
import { ExifGpsInfo } from 'src/app/models/exif-gps-info';
import { ExifCoordinatesMapper } from 'src/app/services/mappers/ExifCoordinatesMapper';
import { ExifService } from 'src/app/services/exif/exif.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  files: FileInfo[];

  startLongitude = 19.029561;
  startLatitude = 50.254831;
  startZoom = 12;
  mapContainerId = 'map';
  map: any;

  currentMarkers: Array<any> = [];

  constructor(private fileService: FileDialogService,
              private coordinatesMapper: ExifCoordinatesMapper,
              private exifService: ExifService) { }

  ngOnInit() {
    this.initializeMap();
    this.fileService.uploadedFiles.subscribe(
      data => {
        this.files = data;
        this.redrawImageMarkers(this.files);
      });
  }

  private initializeMap() {
    this.map = L
      .map(this.mapContainerId)
      .setView([this.startLatitude, this.startLongitude], this.startZoom);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
          <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoia2lwaWM5NiIsImEiOiJjandob3M1b2owMjZvNDVuNmkxZnkzdGgxIn0.tYO090kjAYA-Ge6Dpb-69w'
    }).addTo(this.map);
  }

  private redrawImageMarkers(files: Array<FileInfo>) {
    if (files) {
      for (const file of files) {
        if (this.exifService.hasExifGpsSection(file.name)) {
          this.drawMarker(file.coordinates);
        }
      }
    }
  }

  private drawMarker(coordinates: ExifGpsInfo) {
    const marker = L
      .marker([coordinates.latitude, coordinates.longitude])
      .addTo(this.map);
    this.currentMarkers.push(marker);
  }
}

declare var L: any;
