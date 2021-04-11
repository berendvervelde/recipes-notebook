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
		ac_open_percentage_calculator: 4,
		ac_toggle_categoryGroups: 5,
		ac_apply_percentage: 6,
		ac_export_JSON: 7,
		ac_import_JSON: 8,

		// statuses
		st_dirty: 10

	}

	messageSource: Subject<number> = new Subject<number>()
}
