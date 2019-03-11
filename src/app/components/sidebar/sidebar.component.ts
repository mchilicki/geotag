import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { FileDialogService } from 'src/app/services/file-dialog/file-dialog.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  darkMode = false;

  constructor(private themeService: ThemeService,
              private fileDialogService: FileDialogService) { }

  ngOnInit() {
    this.themeService.isDarkMode.subscribe(
      data => this.darkMode = data
    );
  }


  openFileDialog() {
    this.fileDialogService.loadImageFiles();
  }

  openDirectoryDialog() {
    this.fileDialogService.loadFilesFromDirectory();
  }

  toggleThemeMode() {
    this.themeService.toggleMode();
  }

}
