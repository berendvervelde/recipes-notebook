import { Component, OnInit } from '@angular/core';
import { Recipe, types } from 'src/app/core/models/recipe';
import { JsonImporterService } from 'src/app/core/services/json-importer.service';

@Component({
	selector: 'app-recipes-list',
	templateUrl: './recipes-list.component.html',
	styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {
	recipes?: Recipe[]
	// to make an enum work in the template
	types: typeof types = types;

	constructor(
		private jsonImporterService: JsonImporterService,
	) { }

	ngOnInit(): void {
		this.jsonImporterService.importRecipesJson().subscribe(resp =>{
			if(resp){
				this.recipes = resp
				console.log(resp)
			}
		})
	}
}
