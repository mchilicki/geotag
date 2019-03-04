import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { NgxElectronModule } from 'ngx-electron';
import { HomeComponent } from './components/home/home.component';
import { SafePipe } from './shared/safe.pipe';
import { GalleryComponent } from './components/gallery/gallery.component';
import { GalleryItemComponent } from './components/gallery/gallery-item/gallery-item.component';
import { BasenamePipe } from './shared/basename.pipe';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SafePipe,
    GalleryComponent,
    GalleryItemComponent,
    BasenamePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
