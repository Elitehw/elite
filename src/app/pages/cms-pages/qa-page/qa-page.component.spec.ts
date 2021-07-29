import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QaPageComponent } from './qa-page.component';

describe('QaPageComponent', () => {
  let component: QaPageComponent;
  let fixture: ComponentFixture<QaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
