import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MapService } from '../../services/map/map.service';

@Component({
  selector: 'app-unregistered-user',
  templateUrl: './unregistered-user.component.html',
  styleUrls: ['./unregistered-user.component.css']
})
export class UnregisteredUserComponent implements OnInit {
  CalculateForm = new FormGroup({
    from: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
    to: new FormControl('', { validators: [Validators.required, Validators.minLength(5)], nonNullable: true }),
  });

  @Output() newItemEvent = new EventEmitter<string>();

  selectedFromAddress = '';
  selectedToAddress = '';

  constructor(private renderer: Renderer2, private router: Router, private mapService: MapService) {

    // this.renderer.addClass(document.body, 'black');

  }

  ngOnInit(): void {

    this.mapService.getFromAddress().subscribe(data => {
      this.selectedFromAddress = data.display_name;
    })

    this.mapService.getToAddress().subscribe(data => {
      this.selectedToAddress = data.display_name;
    })
  }

  calculate() {

    if (this.CalculateForm.valid) {

      this.mapService.setFromAddress(this.selectedFromAddress + ", Novi Sad");

      this.mapService.setToAddress(this.selectedToAddress + ", Novi Sad");

      this.CalculateForm.reset(this.CalculateForm.value);
      // let formVal = {
      //   from: this.CalculateForm.value.from,
      //   to: this.CalculateForm.value.to,
      // };



      // console.log(this.CalculateForm.value);
      //   this.mapService.setFromAddress(from)
      //   .subscribe({
      //     next: (result) => {

      //     },
      // error: () => {},
      //   });
    }
  }
  sendToMap() {
    //TODO
    this.newItemEvent.emit(this.selectedToAddress);
  }
}