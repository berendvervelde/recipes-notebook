import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-details-header',
	templateUrl: './details-header.component.html',
	styleUrls: ['./details-header.component.scss']
})
export class DetailHeaderComponent implements OnInit {

	id?: number

	constructor(
		private location: Location,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.id = params['recipeId']
		})
	}

	back() {
		this.location.back()
	}
}
