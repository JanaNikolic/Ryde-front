import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateDriverVehicleComponent } from './rate-driver-vehicle.component';

describe('RateDriverVehicleComponent', () => {
  let component: RateDriverVehicleComponent;
  let fixture: ComponentFixture<RateDriverVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateDriverVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateDriverVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
