import { TestBed } from '@angular/core/testing';

import { FileDialogService } from './file-dialog.service';

describe('FileDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileDialogService = TestBed.get(FileDialogService);
    expect(service).toBeTruthy();
  });
});
