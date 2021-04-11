import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-time-picker',
	templateUrl: './time-picker.component.html',
	styleUrls: ['./time-picker.component.scss'],
	providers: [
		{ 
		  provide: NG_VALUE_ACCESSOR,
		  useExisting: forwardRef(() => TimePickerComponent),
		  multi: true
		}
	  ]
})
export class TimePickerComponent implements OnInit, ControlValueAccessor {

	times = [
		'5 minuten',
		'10 minuten',
		'een kwartier',
		'een half uur',
		'drie kwartier',
		'een uur',
		'anderhalf uur',
		'twee uur',
		'drie uur',
		'vier uur',
		'acht uur',
		'een dag',
		'anderhalve dag',
		'twee dagen',
		'drie dagen',
		'vier dagen',
		'een week'
	]

	showTimepicker = false

	@Input() _selectedTime = ''

	@Input() label?: string

	propagateChange = (_: any) => {};

	get selectedTime() {
	  return this._selectedTime;
	}
  
	set selectedTime(val) {
	  this._selectedTime = val;
	  this.propagateChange(this._selectedTime);
	}

	constructor() { }

	ngOnInit(): void {
		
	}

	writeValue(value: string): void {
		if (value !== undefined) {
			this.selectedTime = value
		}
	}
	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}
	registerOnTouched(fn: any): void {}

	setValue(val: string){
		this.selectedTime = val
		this.showTimepicker = false
	}

	openTimeScroller(){
		this.showTimepicker = true
	}
	closeTimeScroller(){
		this.showTimepicker = false
	}

}
