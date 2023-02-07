import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        BrowserModule,
        RouterModule,
        RouterTestingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    
    fixture = TestBed.createComponent(LoginComponent);

    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`form should not have initial values `, () => {
    const expectForm = {
      Email: "",
      Password: ""
    }
    const myForm = component.LoginForm;
    expect(myForm.value).toEqual(expectForm);
  });

  it(`should call the login method if form is valid`,() => {
    spyOn(component, 'login');
    
    component.LoginForm.controls['Email'].setValue('mirkovicka01@gmail.com');
    component.LoginForm.controls['Password'].setValue('Password123');
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.login).toHaveBeenCalled();
  });

  it(`form should be invalid if nothing set`, () => {
    expect(component.LoginForm.valid).toBeFalsy();
  });

  it(`form should be invalid if password is invalid`, () => {
    component.LoginForm.controls['Email'].setValue('mirkovicka01@gmail.com');
    component.LoginForm.controls['Password'].setValue('Password');
    expect(component.LoginForm.valid).toBeFalsy();
  });

  it(`form should be invalid if email is too short`, () => {
    component.LoginForm.controls['Email'].setValue('mi');
    component.LoginForm.controls['Password'].setValue('Password123');
    expect(component.LoginForm.valid).toBeFalsy();
  });

  it(`should open forgot password dialog`, () => {
    spyOn(component, 'resetPassword');
    el = fixture.debugElement.query(By.css('#forgotPass')).nativeElement;
    el.click();
    
    expect(component.resetPassword).toHaveBeenCalled();
  });

});
