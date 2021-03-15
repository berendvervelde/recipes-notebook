import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe, types } from 'src/app/core/models/recipe';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { JsonImporterService } from 'src/app/core/services/json-importer.service';
import { RecipeService } from 'src/app/core/services/recipe.service';
import firebase from 'firebase/app';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from 'src/app/core/services/shared.service';
import { Router } from '@angular/router';

interface categoryToggleInterface {
	[key: string]: boolean
}

@Component({
	selector: 'app-list-recipes',
	templateUrl: './list-recipes.component.html',
	styleUrls: ['./list-recipes.component.scss']
})

export class ListRecipesComponent implements OnInit, OnDestroy {
	// this subjects to be put in the takeuntil so we can destroy observables on exit
	private readonly destroy$ = new Subject();

	recipes?: Recipe[][]
	showCategory: categoryToggleInterface = {}

	// to make an enum work in the template
	types: typeof types = types;
	user?: firebase.User;

	constructor(
		private jsonImporterService: JsonImporterService,
		private recipeService: RecipeService,
		private authService: FirebaseAuthService,
		private sharedService: SharedService,
		private router: Router
	) { }

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngOnInit(): void {
		this.recipeService.subscribeToRecipes().pipe(takeUntil(this.destroy$)).subscribe(resp => {
			if (resp) {
				this.recipes = this.recipeService.groupBy(resp, 'category')
				this.showCategory = this.buildCategoryToggleObject(this.recipes)
			} else {
				this.recipes = []
			}
		})

		this.authService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
			this.user = user
			const uid = this.user?.uid
			if (uid) {
				this.recipeService.getRecipes(uid)
			}
		})

		this.sharedService.messageSource.pipe(takeUntil(this.destroy$)).subscribe((message: number) => {
			this.handleMessages(message)
		})
	}

	toggleCategory(category: string): void {
		this.showCategory[category] = !this.showCategory[category]
	}

	private handleMessages(message: number) {
		switch(message){
			case SharedService.id.ac_new_recipe:
				this.addRecipe()
				break
		}
	}
	private addRecipe() {
		const id = this.recipeService.newRecipe()
		if(id > 0){
			this.router.navigate(['/edit-recipe', id]);
		}
	}

	private importRecipes(): void {
		this.jsonImporterService.importRecipesJson().pipe(takeUntil(this.destroy$)).subscribe(resp => {
			if (resp) {
				this.recipes = this.recipeService.groupBy(resp, 'category')
				this.showCategory = this.buildCategoryToggleObject(this.recipes)
			}
		})
	}
	private buildCategoryToggleObject(recipes: Recipe[][]): categoryToggleInterface {
		const sc: categoryToggleInterface = {}
		// add each category to the schowCategory object so we can use it to keep track if a category is shown or hidden in the list later
		recipes.forEach(c => sc[c[0].category] = true)
		return sc
	}

}
