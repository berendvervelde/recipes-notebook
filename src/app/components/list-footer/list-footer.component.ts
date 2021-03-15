import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
	selector: 'app-list-footer',
	templateUrl: './list-footer.component.html',
	styleUrls: ['./list-footer.component.scss']
})
export class ListFooterComponent implements OnInit {

	constructor(
		private sharedService: SharedService,
	) { }

	ngOnInit(): void {
	}

	newRecipe() {
		this.sendMessage(SharedService.id.ac_new_recipe)
	}

	private sendMessage(message: number): void {
		this.sharedService.messageSource.next(message)
	}

}
