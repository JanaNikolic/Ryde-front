import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { RegisterComponent } from './register.component';
import { PassengerService } from 'src/app/services/passenger/passenger.service';
import { Passenger } from 'src/app/model/Passenger';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  
  let component: RegisterComponent;
  let passengerService: PassengerService
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
    passengerService = TestBed.get(PassengerService);

  });
  beforeEach(() => {
    
    fixture = TestBed.createComponent(RegisterComponent);

    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  

  it(`button should be disabled if form not valid`,() => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button'));
    expect(el.nativeElement.disabled).toBeTruthy();
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

  it(`button should not be disabled if form is valid`,() => {
    component.RegisterForm.controls['email'].setValue('boki@gmail.com');
    component.RegisterForm.controls['name'].setValue('boki');
    component.RegisterForm.controls['surname'].setValue('bokic');
    component.RegisterForm.controls['address'].setValue('strazilovska 88');
    component.RegisterForm.controls['telephoneNumber'].setValue('+3812715420');
    component.RegisterForm.controls['password'].setValue('Password123');
    component.RegisterForm.controls['confirmPassword'].setValue('Password123');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('button'));
    expect(el.nativeElement.disabled).toBeFalsy();
  });

  

  it(`should call the register method if form is valid`,() => {
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

  it('should call the add method and change passenger info if input valid', () => {
    component.RegisterForm.controls['email'].setValue('boki@gmail.com');
    component.RegisterForm.controls['name'].setValue('boki');
    component.RegisterForm.controls['surname'].setValue('bokic');
    component.RegisterForm.controls['address'].setValue('strazilovska 88');
    component.RegisterForm.controls['telephoneNumber'].setValue('+3812715420');
    component.RegisterForm.controls['password'].setValue('Password123');
    component.RegisterForm.controls['confirmPassword'].setValue('Password123');
    fixture.detectChanges();
    const passenger: Passenger = {
      name: 'bogdan',
      surname: 'janosevic',
      email: 'bogi@gmail.com',
      password: 'sifra',
      telephoneNumber: '+3812716482',
      address: 'adresa',
      active: false,
      blocked: false
    };
    fixture.detectChanges();
    spyOn(passengerService, 'add').and.returnValue(of(passenger));
    component.register();
    expect(passengerService.add).toHaveBeenCalled();
    expect(component.passenger).toEqual(passenger);
  });

  it('should not call the add method input invalid', () => {
    component.RegisterForm.controls['email'].setValue('boki@gmail.com');
    component.RegisterForm.controls['name'].setValue('boki');
    component.RegisterForm.controls['surname'].setValue('bokic');
    component.RegisterForm.controls['address'].setValue('');
    component.RegisterForm.controls['telephoneNumber'].setValue('+3812715420');
    component.RegisterForm.controls['password'].setValue('');
    component.RegisterForm.controls['confirmPassword'].setValue('Password123');
    fixture.detectChanges();
    const passenger: Passenger = {
      name: 'bogdan',
      surname: 'janosevic',
      email: 'bogi@gmail.com',
      password: 'sifra',
      telephoneNumber: '+3812716482',
      address: 'adresa',
      active: false,
      blocked: false
    };
    fixture.detectChanges();
    spyOn(passengerService, 'add').and.returnValue(of(passenger));
    component.register();
    expect(passengerService.add).toHaveBeenCalledTimes(0);

  });
  

  

});
