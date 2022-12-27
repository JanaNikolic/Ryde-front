import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredUserNavbarComponent } from './registered-user-navbar.component';

describe('RegisteredUserNavbarComponent', () => {
  let component: RegisteredUserNavbarComponent;
  let fixture: ComponentFixture<RegisteredUserNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredUserNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredUserNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
