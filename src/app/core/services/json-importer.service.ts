import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


interface recipesDictionary {
	[id: string]: Recipe | null
}
@Injectable({
	providedIn: 'root'
})
export class JsonImporterService {
	recipes?: Recipe[]
	id = 0

	recipeObj?: recipesDictionary

	constructor(
		private http: HttpClient
	) { }

	importRecipesJson(): Observable<Recipe[]> {
		if (this.recipes){
			return new Observable(subscriber => {
				subscriber.next(this.recipes)
			})
		}
		return this.http.get<Recipe[]>('assets/recipes-export.json').pipe(map(resp => {
			resp = this.setID(resp)
			this.recipes = this.convertIngredients(resp)
			this.recipeObj = this.mapToDictionary(this.recipes)
			console.log(this.recipeObj)
			return this.recipes
		}))
	}

	getRecipe(id: number):Recipe | null {
		if(this.recipeObj){
			return this.recipeObj[id]
		}
		return null
	}

	private mapToDictionary(recipes: Recipe[]): recipesDictionary{
		const obj: recipesDictionary = {}
		recipes.forEach(r => {
			obj[r.id] = r
		})
		return obj
	}

	private setID(resp: Recipe[]): Recipe[] {
		return resp.map(recipe => {
			recipe.id = this.id++
			return recipe
		})
	}

	convertIngredients(resp: Recipe[]): Recipe[]{
		return resp.map(recipe => {
			const list = recipe.ingredients as unknown as string[]
			recipe.ingredients = list.join('')
			return recipe
		})
	}
}
