import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyeliteComponent } from './whyelite.component';

describe('WhyeliteComponent', () => {
  let component: WhyeliteComponent;
  let fixture: ComponentFixture<WhyeliteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyeliteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyeliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
