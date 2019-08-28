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
  markersGroup: any = null;

  constructor(private fileService: FileDialogService,
              private coordinatesMapper: ExifCoordinatesMapper,
              private exifService: ExifService) { }

  ngOnInit() {
    this.initializeMap();
    this.initializeMarkersGrouping();
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

  private initializeMarkersGrouping() {
    this.markersGroup = L.markerClusterGroup({
      maxClusterRadius: 120,
      animate: true,
      animateAddingMarkers: true,
    });
    this.map.addLayer(this.markersGroup);
  }

  private initializeDragAndDrop() {
    const mapDiv = document.getElementById(this.mapContainerId);
    mapDiv.ondragover = (event) => {
      this.showSavingChangesComunicate();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };
    mapDiv.ondrop = (event) => {
      const draggedFilePath = this.draggedFileDiv.id;
      const draggedShortFilePath = this.fileService.takeOnlyNameFromFilePath(draggedFilePath);
      if (typeof draggedFilePath === 'undefined' || draggedFilePath === draggedShortFilePath) {
        this.hideSavingChangesComunicate();
        return;
      }
      this.showSavingChangesComunicate();
      event.preventDefault();
      const latLng: LatLng = this.map.containerPointToLatLng(L.point([event.layerX, event.layerY]));
      this.updateExifGpsInfo(latLng, draggedFilePath);
      this.removeMarkerByName(draggedFilePath);
      this.drawMarker(draggedFilePath, draggedShortFilePath, latLng);
    };
    document.addEventListener('dragstart', (event) => {
      this.showSavingChangesComunicate();
      this.draggedFileDiv = event.target;
    }, false);
  }

  private updateExifGpsInfo(latLng: LatLng, filePath: string) {
    const coordinates: ExifGpsInfo = this.coordinatesMapper.toExifGpsInfo(latLng);
    this.exifService.setExifGpsOfImageFile(coordinates, filePath);
    this.hideSavingChangesComunicate();
  }

  private redrawImageMarkers(files: Array<FileInfo>) {
    if (files) {
      for (const file of files) {
        if (this.exifService.hasExifGpsSection(file.name)) {
          const coordinates: ExifGpsInfo = this.exifService.getExifGpsInfoFromImageFile(file.name);
          const latLng: LatLng = this.coordinatesMapper.toLatLng(coordinates);
          this.drawMarker(file.name, file.shortName, latLng);
        }
      }
    }
  }

  private removeAllMarkers() {
    if (this.currentMarkers) {
      for (const marker of this.currentMarkers) {
        this.markersGroup.removeLayer(marker);
      }
    }
    this.currentMarkers.length = 0;
  }

  private removeMarkerByName(markerName: string) {
    const markersToRemove = [];
    if (this.currentMarkers) {
      for (const marker of this.currentMarkers) {
        if (marker.options.name === markerName) {
          this.markersGroup.removeLayer(marker);
          markersToRemove.push(markerName);
        }
      }
    }
    this.currentMarkers.filter((currentMarker) => currentMarker.options.name === markersToRemove);
  }

  private drawMarker(filePath: string, fileShortName: string, coordinates: LatLng) {
    const marker = L.marker(coordinates,
      {
        name: filePath,
        draggable: true
      })
      .addTo(this.map)
      .bindPopup(this.getPopupHtml(filePath), { className: 'themable' });
    L.DomUtil.addClass(marker._icon, 'marker-image');
    marker.addEventListener('dragstart', (event: DragEvent) => {
      this.showSavingChangesComunicate();
    });
    marker.addEventListener('dragend', (event: DragEvent) => {
      const latLng: LatLng = marker.getLatLng();
      this.updateExifGpsInfo(latLng, filePath);
    });
    this.currentMarkers.push(marker);
    this.markersGroup.addLayer(marker);
    this.markersGroup.refreshClusters();
  }

  private showSavingChangesComunicate() {
    document.getElementById('saving').style.display = 'block';
    document.getElementById('allSaved').style.display = 'none';
  }

  private hideSavingChangesComunicate() {
    document.getElementById('saving').style.display = 'none';
    document.getElementById('allSaved').style.display = 'block';
  }

  private getPopupHtml(filePath: string) {
    return '<img src="' + filePath + '"/>';
  }
}

declare var L: any;
