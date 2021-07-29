import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyitemsComponent } from './buyitems.component';

describe('BuyitemsComponent', () => {
  let component: BuyitemsComponent;
  let fixture: ComponentFixture<BuyitemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyitemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
