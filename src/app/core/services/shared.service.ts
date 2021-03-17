import { Injectable } from '@angular/core';
import {  Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedService {

	static readonly id = {
		// actions
		ac_save: 0,
		ac_dont_save: 1,
		ac_new_recipe: 2,
		ac_delete: 3,
		// statuses
		st_dirty: 10

	}

	messageSource: Subject<number> = new Subject<number>()
}
