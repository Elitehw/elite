import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerSellerComponent } from './buyer-seller.component';

describe('BuyerSellerComponent', () => {
  let component: BuyerSellerComponent;
  let fixture: ComponentFixture<BuyerSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
