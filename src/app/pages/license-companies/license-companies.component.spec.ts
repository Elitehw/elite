import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseCompaniesComponent } from './license-companies.component';

describe('LicenseCompaniesComponent', () => {
  let component: LicenseCompaniesComponent;
  let fixture: ComponentFixture<LicenseCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
