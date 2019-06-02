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

  longitude = 19.029561;
  latitude = 50.254831;
  map: any;

  constructor(private fileService: FileDialogService) { }

  ngOnInit() {
    this.fileService.getFiles.subscribe(
      data => this.files = data);
    this.initializeMap();
  }

  initializeMap() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 12
      })
    });
  }

}

declare var ol: any;
