import { MapComponent } from './components/map/map.component';
import { GalleryListItemComponent } from './components/gallery/gallery-list-item/gallery-list-item.component';
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
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {NgxImageCompressService} from 'ngx-image-compress';
import {GalleryItemFullscreenComponent} from "./components/gallery/gallery-item-fullscreen/gallery-item-fullscreen.component";
import {ExifService} from './services/exif/exif.service';
import { LatitudePipe } from './shared/latitude.pipe';
import { LongitudePipe } from './shared/longitude.pipe';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SafePipe,
    GalleryComponent,
    GalleryItemComponent,
    BasenamePipe,
    SidebarComponent,
    GalleryItemFullscreenComponent,
    LatitudePipe,
    LongitudePipe,
    GalleryListItemComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CookieService, NgxImageCompressService, ExifService],
  bootstrap: [AppComponent]
})
export class AppModule { }
