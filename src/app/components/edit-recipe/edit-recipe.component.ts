import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { AbstractControl, FormControl, FormGroup } from "@angular/forms"
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { ActivatedRoute } from '@angular/router';
import { Recipe, types } from 'src/app/core/models/recipe';
import { RecipeService } from 'src/app/core/services/recipe.service';

@Component({
	selector: 'app-edit-recipe',
	templateUrl: './edit-recipe.component.html',
	styleUrls: ['./edit-recipe.component.scss']
})
export class EditRecipeComponent implements OnInit {

	recipe?: Recipe | null

	// to make an enum work in the template
	types: typeof types = types;

	public Editor = ClassicEditor;
	notification = new FormControl('');
	recipeForm!: FormGroup
	categories!: string[]
	keyword = 'category'

	constructor(
		private route: ActivatedRoute,
		private recipeService: RecipeService
	) { }

	ngOnInit(): void {
		//if all goes well we get the id from the url param
		this.route.params.subscribe(params => {
			const id = params['recipeId'];
			if (id) {
				this.recipe = this.recipeService.getRecipe(Number(id))
				this.setupForm()
				this.categories = this.recipeService.getAllCategories()
			}
		})
	}

	setupForm() {
		if(this.recipe){
			this.recipeForm = new FormGroup({
				title: new FormControl(this.recipe.name),
				ckIngredients: new FormControl(this.recipe.ingredients),
				category: new FormControl(this.recipe.category),
				ckInstructions: new FormControl(this.recipe.recipeInstructions),
				
			})
		}
		// this.recipeForm.valueChanges.subscribe(val => {
		// 	console.log(val)
		// })
	}
}
