import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileaclaimComponent } from './fileaclaim.component';

describe('FileaclaimComponent', () => {
  let component: FileaclaimComponent;
  let fixture: ComponentFixture<FileaclaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileaclaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileaclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
