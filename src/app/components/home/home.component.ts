import { Component, OnInit } from '@angular/core';
import { FileDialogService } from 'src/app/services/file-dialog/file-dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  files: string[];

  constructor(private fileService: FileDialogService) { }

  ngOnInit() {
    this.fileService.getFiles.subscribe(
      data => this.files = data);
  }
}
