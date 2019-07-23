import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import {GalleryItemFullscreenComponent} from './components/gallery/gallery-item-fullscreen/gallery-item-fullscreen.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'image/:name', component: GalleryItemFullscreenComponent },
  { path: 'map', component: MapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
