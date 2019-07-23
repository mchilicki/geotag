import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { FileDialogService } from 'src/app/services/file-dialog/file-dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  darkMode = false;

  constructor(private themeService: ThemeService,
              private fileDialogService: FileDialogService,
              private router: Router) { }

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

  goToMap() {
    this.router.navigate(['map']);
  }

  goToGallery() {
    this.router.navigate(['']);
    document.getElementById('saving').style.display = 'none';
    document.getElementById('allSaved').style.display = 'none';
  }
}
