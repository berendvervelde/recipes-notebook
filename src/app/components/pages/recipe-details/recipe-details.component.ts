import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/core/models/recipe';
import { JsonImporterService } from 'src/app/core/services/json-importer.service';

@Component({
	selector: 'app-recipe-details',
	templateUrl: './recipe-details.component.html',
	styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {
	recipe?: Recipe | null

	constructor(
		private jsonImporterService: JsonImporterService,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		//if all goes well we get the id from the url param
		this.route.params.subscribe(params => {
			const id = params['recipeId'];
			if(id){
				this.recipe = this.jsonImporterService.getRecipe(Number(id))
			}
		});
	}

}
