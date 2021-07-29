import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifiedserviceproviderComponent } from './certifiedserviceprovider.component';

describe('CertifiedserviceproviderComponent', () => {
  let component: CertifiedserviceproviderComponent;
  let fixture: ComponentFixture<CertifiedserviceproviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertifiedserviceproviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertifiedserviceproviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
