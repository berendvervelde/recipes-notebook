import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
	selector: 'app-details-header',
	templateUrl: './details-header.component.html',
	styleUrls: ['./details-header.component.scss']
})
export class DetailHeaderComponent implements OnInit, OnDestroy {

	id?: number
	showDeleteAlert = false
	private readonly destroy$ = new Subject();

	constructor(
		private route: ActivatedRoute,
		private sharedService: SharedService
	) { }
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.unsubscribe()
	}

	ngOnInit(): void {
		this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
			this.id = params['recipeId']
		})
	}

	showAlert(){
		this.showDeleteAlert = true
	}
	delete() {
		this.sendMessage(SharedService.id.ac_delete)
	}

	percentageCalculatorToggle(){
		this.sendMessage(SharedService.id.ac_open_percentage_calculator)
	}

	private sendMessage(message: number): void {
		this.sharedService.messageSource.next(message)
	}
}
