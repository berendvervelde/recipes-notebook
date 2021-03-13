import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

@Component({
	selector: 'app-edit-header',
	templateUrl: './edit-header.component.html',
	styleUrls: ['./edit-header.component.scss']
})
export class EditHeaderComponent implements OnInit {

	constructor(
		private location: Location,
	) { }

	ngOnInit(): void {
	}

	back() {
		this.location.back()
	}

}
