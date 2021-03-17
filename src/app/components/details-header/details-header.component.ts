import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
	selector: 'app-details-header',
	templateUrl: './details-header.component.html',
	styleUrls: ['./details-header.component.scss']
})
export class DetailHeaderComponent implements OnInit {

	id?: number
	showDeleteAlert = false

	constructor(
		private route: ActivatedRoute,
		private sharedService: SharedService
	) { }

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.id = params['recipeId']
		})
	}

	showAlert(){
		this.showDeleteAlert = true
	}
	delete() {
		this.sendMessage(SharedService.id.ac_delete)
	}

	private sendMessage(message: number): void {
		this.sharedService.messageSource.next(message)
	}
}
