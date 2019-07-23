import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryItemFullscreenComponent } from './gallery-item-fullscreen.component';

describe('GalleryItemFullscreenComponent', () => {
  let component: GalleryItemFullscreenComponent;
  let fixture: ComponentFixture<GalleryItemFullscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryItemFullscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryItemFullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
