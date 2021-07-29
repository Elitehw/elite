import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElitestateComponent } from './elitestate.component';

describe('ElitestateComponent', () => {
  let component: ElitestateComponent;
  let fixture: ComponentFixture<ElitestateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElitestateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElitestateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
