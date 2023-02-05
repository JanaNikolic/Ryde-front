import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsDriverComponent } from './reviews-driver.component';

describe('ReviewsDriverComponent', () => {
  let component: ReviewsDriverComponent;
  let fixture: ComponentFixture<ReviewsDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewsDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
