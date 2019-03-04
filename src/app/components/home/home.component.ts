import { Component, OnInit } from '@angular/core';
import { FileDialogService } from 'src/app/services/file-dialog/file-dialog.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  files: string[];
  darkMode = false;

  constructor(private fileDialogService: FileDialogService,
              private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.isDarkMode.subscribe(
      data => this.darkMode = data
    );
  }

  openFileDialog() {
    const files = this.fileDialogService.loadImageFiles();
    if (files) {
      this.files = files;
    }
  }

  openDirectoryDialog() {
    const files = this.fileDialogService.loadFilesFromDirectory();
    if (files) {
      this.files = files;
    }
  }

  toggleThemeMode() {
    this.themeService.toggleMode();
  }
}
