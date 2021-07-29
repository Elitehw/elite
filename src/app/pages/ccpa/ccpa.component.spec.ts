import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CCPAComponent } from './ccpa.component';

describe('CCPAComponent', () => {
  let component: CCPAComponent;
  let fixture: ComponentFixture<CCPAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CCPAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CCPAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
