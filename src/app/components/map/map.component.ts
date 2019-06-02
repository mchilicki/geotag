import { Component, OnInit, Input } from '@angular/core';
import { FileInfo } from 'src/app/models/file-info';
import { FileDialogService } from 'src/app/services/file-dialog/file-dialog.service';
import 'ol/ol.css';
// import { Map, View } from 'ol';
// import Point from 'ol/geom/Point';
// import TileLayer from 'ol/layer/Tile';
// import VectorLayer from 'ol/layer/Vector';
// import Feature from 'ol/Feature';
// import Draw from 'ol/interaction/Draw';
// import OSM from 'ol/source/OSM';
// import VectorSource from 'ol/source/Vector';
// import Style from 'ol/style/Style';
// import Icon from 'ol/style/Icon';

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
  vectorSource: any;
  iconStyle: any;
  vectorLayer: any;

  currentMarkers: Array<any> = [];

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
    const rasterLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    this.iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'http://ol3js.org/en/master/examples/data/icon.png'
       })
    });
    this.vectorSource = new ol.source.Vector({
      features: this.currentMarkers
    });
    this.vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
      style: this.iconStyle
    });

    this.map = new ol.Map({
      target: this.mapContainerId,
      layers: [ rasterLayer, this.vectorLayer ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.startLongitude, this.startLatitude]),
        zoom: this.startZoom
      })
    });
  }

  private redrawImageMarkers() {
    let marker = new ol.Feature({
      source: this.vectorSource,
      geometry: new ol.geom.Point([this.startLatitude, this.startLongitude])
    });
    this.currentMarkers.push(marker);
    this.vectorSource = new ol.source.Vector({
      features: this.currentMarkers
    });
    this.vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
      style: this.iconStyle
    });
  }
}

declare var ol: any;
