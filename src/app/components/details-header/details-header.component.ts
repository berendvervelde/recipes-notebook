import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

@Component({
	selector: 'app-details-header',
	templateUrl: './details-header.component.html',
	styleUrls: ['./details-header.component.scss']
})
export class DetailHeaderComponent implements OnInit {

	constructor(private location: Location) { }

	ngOnInit(): void {
	}

	back() {
		this.location.back()
	}

}
