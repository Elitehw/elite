import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceAndRepairsComponent } from './maintenance-and-repairs.component';

describe('MaintenanceAndRepairsComponent', () => {
  let component: MaintenanceAndRepairsComponent;
  let fixture: ComponentFixture<MaintenanceAndRepairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceAndRepairsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAndRepairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
