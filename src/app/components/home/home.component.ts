import { Component, OnInit } from '@angular/core';
import { FileDialogService } from 'src/app/services/file-dialog/file-dialog.service';
import { FileInfo } from 'src/app/models/file-info';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  files: FileInfo[];

  constructor(private fileService: FileDialogService) { }

  ngOnInit() {
    this.fileService.getFiles.subscribe(
      data => this.files = data);
  }
}
