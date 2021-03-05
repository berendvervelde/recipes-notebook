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
	static readonly cacheTimeout = 30 * 60 * 1000

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
		const now = new Date().getTime()
		const cacheDate = Number(window.localStorage.getItem('cacheDate'))
		if (now - cacheDate < JsonImporterService.cacheTimeout){
			const lsr = window.localStorage.getItem('recipes')
			if(lsr){
				const r = JSON.parse(lsr)
				this.recipeObj = this.mapToDictionary(r)
				return new Observable(subscriber => {
					subscriber.next(r)
				})
			}
		}
		return this.http.get<Recipe[]>('assets/recipes-export.json').pipe(map(resp => {
			resp = this.setID(resp)
			this.recipes = this.convertIngredients(resp).sort(this.sort)
			this.recipeObj = this.mapToDictionary(this.recipes)

			window.localStorage.setItem('recipes', JSON.stringify(this.recipes))
			window.localStorage.setItem('cacheDate', new Date().getTime().toString())
			return this.recipes
		}))
	}

	getRecipe(id: number):Recipe | null {
		if(this.recipeObj){
			return this.recipeObj[id]
		}
		return null
	}

	private sort(a: Recipe, b: Recipe): number{
		const cSort = a.category.localeCompare(b.category)
		if(cSort !== 0){
			return cSort
		}
		return a.name.localeCompare(b.name)
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

	private convertIngredients(resp: Recipe[]): Recipe[]{
		return resp.map(recipe => {
			const list = recipe.ingredients as unknown as string[]
			recipe.ingredients = list.join('')
			return recipe
		})
	}
}
