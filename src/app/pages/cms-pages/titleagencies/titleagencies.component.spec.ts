import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleagenciesComponent } from './titleagencies.component';

describe('TitleagenciesComponent', () => {
  let component: TitleagenciesComponent;
  let fixture: ComponentFixture<TitleagenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleagenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleagenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
