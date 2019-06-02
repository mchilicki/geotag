import { Component, OnInit, Input } from '@angular/core';
import { FileInfo } from 'src/app/models/file-info';
import { FileDialogService } from 'src/app/services/file-dialog/file-dialog.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() files: FileInfo[];

  startLongitude = 19.029561;
  startLatitude = 50.254831;
  startZoom = 12;
  mapContainerId = 'map';
  map: any;

  //currentMarkers: ol.

  constructor(private fileService: FileDialogService) { }

  ngOnInit() {
    this.initializeMap();
    this.fileService.getFiles.subscribe(
      data => {
        this.files = data;
        this.redrawImageMarkers();
      });
  }

  private initializeMap() {
    this.map = new ol.Map({
      target: this.mapContainerId,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.startLongitude, this.startLatitude]),
        zoom: this.startZoom
      })
    });
  }

  private redrawImageMarkers() {

  }
}

declare var ol: any;
