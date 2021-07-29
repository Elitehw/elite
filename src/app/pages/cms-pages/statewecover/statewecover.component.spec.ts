import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatewecoverComponent } from './statewecover.component';

describe('StatewecoverComponent', () => {
  let component: StatewecoverComponent;
  let fixture: ComponentFixture<StatewecoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatewecoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatewecoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
