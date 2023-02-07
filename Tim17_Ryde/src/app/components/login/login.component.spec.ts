import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { mockLogin } from 'src/app/mocks/login.service.mock';
import { AuthService } from 'src/app/services/auth/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let authService: AuthService;
  let router: Router;

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
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
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
    component.LoginForm.controls['Password'].setValue('Pass');
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

  it(`should call the login method and not get token with invalid form`,() => {
    spyOn(component, 'login').and.callThrough();
    component.LoginForm.controls['Email'].setValue('neca@perovic.com');
    component.LoginForm.controls['Password'].setValue('');
    fixture.detectChanges();
    
    spyOn(authService, 'login');//.and.returnValue(of(mockLogin));
    component.login();

    expect(component.login).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledTimes(0);
  });

  it(`should call the login method and get token with valid form`,() => {
    spyOn(component, 'login').and.callThrough();
    spyOn(router,'navigate');
    component.LoginForm.controls['Email'].setValue('neca@perovic.com');
    component.LoginForm.controls['Password'].setValue('Pasword123');
    fixture.detectChanges();
    
    spyOn(authService, 'login').and.returnValue(of(mockLogin));
    component.login();

    expect(component.login).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalled();
  });
});
