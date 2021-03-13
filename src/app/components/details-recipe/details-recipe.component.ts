import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { Recipe, types } from 'src/app/core/models/recipe';
import { RecipeService } from 'src/app/core/services/recipe.service';

@Component({
	selector: 'app-details-recipe',
	templateUrl: './details-recipe.component.html',
	styleUrls: ['./details-recipe.component.scss']
})
export class DetailsRecipeComponent implements OnInit {
	recipe?: Recipe | null

	// to make an enum work in the template
	types: typeof types = types;

	constructor(
		private route: ActivatedRoute,
		private recipeService: RecipeService
	) { }

	ngOnInit(): void {
		//if all goes well we get the id from the url param
		this.route.params.subscribe(params => {
			const id = params['recipeId'];
			if(id){
				this.recipe = this.recipeService.getRecipe(Number(id))
			}
		});
	}

}
