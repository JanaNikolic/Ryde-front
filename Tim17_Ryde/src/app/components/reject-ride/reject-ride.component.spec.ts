import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectRideComponent } from './reject-ride.component';

describe('RejectRideComponent', () => {
  let component: RejectRideComponent;
  let fixture: ComponentFixture<RejectRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectRideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
