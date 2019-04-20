import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import {GalleryItemFullscreenComponent} from "./components/gallery/gallery-item-fullscreen/gallery-item-fullscreen.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'image/:name', component: GalleryItemFullscreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
