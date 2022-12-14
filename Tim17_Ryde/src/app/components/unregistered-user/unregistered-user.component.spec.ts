import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredUserComponent } from './unregistered-user.component';

describe('UnregisteredUserComponent', () => {
  let component: UnregisteredUserComponent;
  let fixture: ComponentFixture<UnregisteredUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnregisteredUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnregisteredUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
