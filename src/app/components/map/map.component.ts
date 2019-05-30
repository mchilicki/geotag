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
  
  constructor(private fileService: FileDialogService) { }

  ngOnInit() {
    this.fileService.getFiles.subscribe(
      data => this.files = data);
  }

}
