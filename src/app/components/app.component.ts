import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'geotag';
  darkMode = false;

  constructor(private themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.themeService.isDarkMode.subscribe(
      data => this.darkMode = data
    );
  }
}
