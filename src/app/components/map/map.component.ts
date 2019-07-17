import { Component, OnInit, Input } from '@angular/core';
import { FileInfo } from 'src/app/models/file-info';
import { FileDialogService } from 'src/app/services/file-dialog/file-dialog.service';
import { ExifGpsInfo } from 'src/app/models/exif-gps-info';
import { ExifCoordinatesMapper } from 'src/app/services/mappers/ExifCoordinatesMapper';
import { ExifService } from 'src/app/services/exif/exif.service';
import { LatLng } from 'src/app/models/latLng';

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
  draggedFileDiv: any;

  currentMarkers: Array<any> = [];

  constructor(private fileService: FileDialogService,
              private coordinatesMapper: ExifCoordinatesMapper,
              private exifService: ExifService) { }

  ngOnInit() {
    this.initializeMap();
    this.initializeDragAndDrop();
    this.fileService.uploadedFiles.subscribe(
      data => {
        this.files = data;
        this.removeAllMarkers();
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

  private initializeDragAndDrop() {
    const mapDiv = document.getElementById(this.mapContainerId);
    mapDiv.ondragover = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };
    mapDiv.ondrop = (event) => {
      event.preventDefault();
      const imagePath: string = event.dataTransfer.getData('text/plain');
      const latLng: LatLng = this.map.containerPointToLatLng(L.point([event.layerX, event.layerY]));
      this.updateExifGpsInfo(latLng);
      this.drawMarker(imagePath, latLng, [this.draggedFileDiv.offsetWidth, this.draggedFileDiv.offsetHeight]);
    };
    document.addEventListener('dragstart', (event) => {
      this.draggedFileDiv = event.target;
    }, false);
  }

  private updateExifGpsInfo(latLng: LatLng) {
    const coordinates: ExifGpsInfo = this.coordinatesMapper.toExifGpsInfo(latLng);
    const draggedFileName = this.draggedFileDiv.id;
    this.exifService.setExifGpsOfImageFile(coordinates, draggedFileName);
  }

  private redrawImageMarkers(files: Array<FileInfo>) {
    if (files) {
      for (const file of files) {
        if (this.exifService.hasExifGpsSection(file.name)) {
          const coordinates: ExifGpsInfo = this.exifService.getExifGpsInfoFromImageFile(file.name);
          const latLng: LatLng = this.coordinatesMapper.toLatLng(coordinates);
          const imageDiv: HTMLImageElement = document.querySelector('[title="' + file.shortName + '"]');
          this.drawMarker(file.name, latLng, [30, 30]);
        }
      }
    }
  }

  private removeAllMarkers() {
    if (this.currentMarkers) {
      for (const marker of this.currentMarkers) {
        this.map.removeLayer(marker);
      }
    }
  }

  private drawMarker(iconUrl: string, coordinates: LatLng, iconSize: Array<number>) {
    const marker = L.marker(coordinates,
      {
        icon: L.icon(
          {
            iconUrl,
            iconSize,
          }),
        draggable: true
      }).addTo(this.map);
    this.map.addLayer(marker);
    this.currentMarkers.push(marker);
  }
}

declare var L: any;
