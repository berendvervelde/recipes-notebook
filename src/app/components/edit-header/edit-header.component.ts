import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { SharedService } from 'src/app/core/services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-edit-header',
	templateUrl: './edit-header.component.html',
	styleUrls: ['./edit-header.component.scss']
})
export class EditHeaderComponent implements OnInit, OnDestroy {

	// this subjects to be put in the takeuntil so we can destroy observables on exit
	private readonly destroy$ = new Subject();
	// have changes been made in the form?
	formDirty = false
	// are you sure you want to exit without save
	showSaveAlert = false

	constructor(
		private location: Location,
		private sharedService: SharedService
	) { }

	ngOnInit(): void {
		// get messages from the header
		this.sharedService.messageSource.pipe(takeUntil(this.destroy$)).subscribe((message: number) => {
			this.handleMessages(message)
		})
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	back(force: boolean) {
		if(this.formDirty && !force){
			this.showSaveAlert = true
		} else {
			this.location.back()
		}
	}

	saveRecipe() {
		this.sendMessage(SharedService.id.ac_save)
	}

	//incoming messages
	private handleMessages(message: number): void {
		switch (message){
			case SharedService.id.st_dirty:
				this.formDirty = true
				break
			
		}
	}
	//outgoing messages
	private sendMessage(message: number): void {
		this.sharedService.messageSource.next(message)
	}

}
