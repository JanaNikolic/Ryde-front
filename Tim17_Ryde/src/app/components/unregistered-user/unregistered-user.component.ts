import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unregistered-user',
  templateUrl: './unregistered-user.component.html',
  styleUrls: ['./unregistered-user.component.css']
})
export class UnregisteredUserComponent implements OnInit {
  createCalculateForm = new FormGroup({
    from: new FormControl(''),
    to: new FormControl(''),
  });

  constructor(private renderer: Renderer2, private router: Router) {
    this.renderer.addClass(document.body, 'black');

  }

  ngOnInit(): void {}

  create() {
    if (this.createCalculateForm.valid) {
      // TODO
    }
  }
}
Validators.required;