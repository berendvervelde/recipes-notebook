import { Component, OnInit } from '@angular/core';
import { Recipe, types } from 'src/app/core/models/recipe';
import { FirebaseAuthServiceService } from 'src/app/core/services/firebase-auth-service.service';
import { JsonImporterService } from 'src/app/core/services/json-importer.service';
import { RecipeService } from 'src/app/core/services/recipe.service';
import firebase from 'firebase/app';

interface categoryToggleInterface {
	[key: string]: boolean
}

@Component({
	selector: 'app-recipes-list',
	templateUrl: './recipes-list.component.html',
	styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {
	recipes?: Recipe[][]
	showCategory: categoryToggleInterface = {}

	// to make an enum work in the template
	types: typeof types = types;
	user?: firebase.User;

	constructor(
		private jsonImporterService: JsonImporterService,
		private recipeService: RecipeService,
		private authService: FirebaseAuthServiceService
	) { }

	ngOnInit(): void {
		this.authService.getCurrentUser().subscribe(user => {
			this.user = user
			this.getRecipes()
		})
		//this.importRecipes()
	}

	importRecipes(): void {
		this.jsonImporterService.importRecipesJson().subscribe(resp =>{
			if(resp){
				this.recipes =  this.recipeService.groupBy(resp, 'category')
				this.showCategory = this.buildCategoryToggleObject(this.recipes)
			}
		})
	}
	buildCategoryToggleObject(recipes: Recipe[][]): categoryToggleInterface {
		const sc: categoryToggleInterface = {}
		// add each category to the schowCategory object so we can use it to keep track if a category is shown or hidden in the list later
		recipes.forEach(c => sc[c[0].category] = true)
		return sc
	}

	getRecipes(): void{
		if(this.user) {
			this.recipeService.getRecipes(this.user.uid).subscribe(resp => {
				if(resp){
					this.recipes = this.recipeService.groupBy(resp, 'category')
					this.showCategory = this.buildCategoryToggleObject(this.recipes)
				}
			})
		}
	}

	toggleCategory(category: string): void {
		this.showCategory[category] = !this.showCategory[category]
	}

	// saveRecipe(): void {
	// 	if(this.user && this.recipes) {
	// 		this.recipeService.setRecipe(this.user.uid, this.recipes[1])
	// 	}
	// }

	// saveAllRecipes(): void {
	// 	if(this.user && this.recipes) {
	// 		const uid = this.user.uid
	// 		this.recipes.forEach(r => {
	// 			this.recipeService.setRecipe(uid, r)
	// 		})
	// 	}
	// }
}
