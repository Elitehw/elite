import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareplanComponent } from './compareplan.component';

describe('CompareplanComponent', () => {
  let component: CompareplanComponent;
  let fixture: ComponentFixture<CompareplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
