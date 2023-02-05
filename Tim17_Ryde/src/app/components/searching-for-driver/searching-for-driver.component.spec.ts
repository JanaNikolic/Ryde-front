import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchingForDriverComponent } from './searching-for-driver.component';

describe('SearchingForDriverComponent', () => {
  let component: SearchingForDriverComponent;
  let fixture: ComponentFixture<SearchingForDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchingForDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchingForDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
