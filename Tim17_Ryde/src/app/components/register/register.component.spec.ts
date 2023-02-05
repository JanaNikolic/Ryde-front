import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent,
        
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);

    component = fixture.componentInstance; // ContactComponent test instance
      // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should not call the register method if button disabled`,() => {
    spyOn(component, 'register');
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.register).toHaveBeenCalledTimes(0);
  });

  it(`form should be invalid if nothing set`, () => {
    expect(component.RegisterForm.valid).toBeFalsy();
  });

  it(`form should be invalid if everything is blank`, () => {
    component.RegisterForm.controls['email'].setValue('');
    component.RegisterForm.controls['name'].setValue('');
    component.RegisterForm.controls['surname'].setValue('');
    component.RegisterForm.controls['address'].setValue('');
    component.RegisterForm.controls['telephoneNumber'].setValue('');
    component.RegisterForm.controls['password'].setValue('');
    component.RegisterForm.controls['confirmPassword'].setValue('');
    expect(component.RegisterForm.valid).toBeFalsy();
  });

  it(`form should not have initial values `, () => {
    const expectRegisterForm = {
      email: "",
      name: "",
      surname: "",
      address: "",
      telephoneNumber: "",
      password: "",
      confirmPassword: ""
    }
    const myRegisterForm = component.RegisterForm;
    expect(myRegisterForm.value).toEqual(expectRegisterForm);
  });

  it(`form should be invalid if phone number is not valid`, () => {
    component.RegisterForm.controls['email'].setValue('boki@gmail.com');
    component.RegisterForm.controls['name'].setValue('boki');
    component.RegisterForm.controls['surname'].setValue('bokic');
    component.RegisterForm.controls['address'].setValue('strazilovska 88');
    component.RegisterForm.controls['telephoneNumber'].setValue('hhhh3hh3');
    component.RegisterForm.controls['password'].setValue('Password123');
    component.RegisterForm.controls['confirmPassword'].setValue('Password123');
    expect(component.RegisterForm.valid).toBeFalsy();
  });

  it(`form should be invalid if email is not valid`, () => {
    component.RegisterForm.controls['email'].setValue('bokidshadh');
    component.RegisterForm.controls['name'].setValue('boki');
    component.RegisterForm.controls['surname'].setValue('bokic');
    component.RegisterForm.controls['address'].setValue('strazilovska 88');
    component.RegisterForm.controls['telephoneNumber'].setValue('+3812715420');
    component.RegisterForm.controls['password'].setValue('Password123');
    component.RegisterForm.controls['confirmPassword'].setValue('Password123');
    expect(component.RegisterForm.valid).toBeFalsy();
  });

  it(`form should be invalid if password length < 8`, () => {
    component.RegisterForm.controls['email'].setValue('boki@gmail.com');
    component.RegisterForm.controls['name'].setValue('boki');
    component.RegisterForm.controls['surname'].setValue('bokic');
    component.RegisterForm.controls['address'].setValue('strazilovska 88');
    component.RegisterForm.controls['telephoneNumber'].setValue('+3812715420');
    component.RegisterForm.controls['password'].setValue('Pass123');
    component.RegisterForm.controls['confirmPassword'].setValue('Pass123');
    expect(component.RegisterForm.valid).toBeFalsy();
  });

  it(`form should be invalid if confirm password is not same as password`, () => {
    component.RegisterForm.controls['email'].setValue('boki@gmail.com');
    component.RegisterForm.controls['name'].setValue('boki');
    component.RegisterForm.controls['surname'].setValue('bokic');
    component.RegisterForm.controls['address'].setValue('strazilovska 88');
    component.RegisterForm.controls['telephoneNumber'].setValue('+3812715420');
    component.RegisterForm.controls['password'].setValue('Password123');
    component.RegisterForm.controls['confirmPassword'].setValue('Password1234');
    expect(component.RegisterForm.valid).toBeFalsy();
  });

  it(`form should be valid`, () => {
    component.RegisterForm.controls['email'].setValue('boki@gmail.com');
    component.RegisterForm.controls['name'].setValue('boki');
    component.RegisterForm.controls['surname'].setValue('bokic');
    component.RegisterForm.controls['address'].setValue('strazilovska 88');
    component.RegisterForm.controls['telephoneNumber'].setValue('+3812715420');
    component.RegisterForm.controls['password'].setValue('Password123');
    component.RegisterForm.controls['confirmPassword'].setValue('Password123');
    expect(component.RegisterForm.valid).toBeTruthy();
  });

  it(`should call the register method`,() => {
    spyOn(component, 'register');
    
    component.RegisterForm.controls['email'].setValue('boki@gmail.com');
    component.RegisterForm.controls['name'].setValue('boki');
    component.RegisterForm.controls['surname'].setValue('bokic');
    component.RegisterForm.controls['address'].setValue('strazilovska 88');
    component.RegisterForm.controls['telephoneNumber'].setValue('+3812715420');
    component.RegisterForm.controls['password'].setValue('Password123');
    component.RegisterForm.controls['confirmPassword'].setValue('Password123');
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.register).toHaveBeenCalled();
  });

});
