import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeService } from './recipe.service';

interface recipesDictionary {
	[id: string]: Recipe | null
}
@Injectable({
	providedIn: 'root'
})
export class JsonImporterService {

	recipes?: Recipe[]
	id = 134

	constructor(
		private http: HttpClient,
		private recipeService: RecipeService
	) { }

	importRecipesJson(): Observable<Recipe[]> {
		return this.http.get<Recipe[]>('assets/recipes-export.json').pipe(map(resp => {
			// this may go after the initial import
			resp = this.map(resp)
			this.recipes = this.convertIngredients(resp).sort(this.sort)
			// this may go after the initial import
			return this.recipes
		}))
	}


	private sort(a: Recipe, b: Recipe): number{
		const cSort = a.category.localeCompare(b.category)
		if(cSort !== 0){
			return cSort
		}
		return a.name.localeCompare(b.name)
	}

	private map(resp: Recipe[]): Recipe[] {
		return resp.map(recipe => {
			if(!recipe.id){
				recipe.id = this.id++
			}
			recipe.jsonImported = true
			return recipe
		})
	}

	private convertIngredients(resp: Recipe[]): Recipe[]{
		return resp.map(recipe => {
			if(recipe.ingredients && Array.isArray(recipe.ingredients)){
				const list = recipe.ingredients as unknown as string[]
				recipe.ingredients = list.join('')
			}
			return recipe
		})
	}
	combineRecipes(r1: Recipe[], r2: Recipe[]) {
		const allRecipes = r1.concat(r2).sort(this.sort)
		return this.recipeService.groupBy(allRecipes, 'category')
	}
}
