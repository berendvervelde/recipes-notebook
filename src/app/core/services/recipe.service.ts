import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../models/recipe';

interface groupContainer {
	[key: string]: Recipe[]
}
interface recipesDictionary {
	[id: string]: Recipe | null
}

@Injectable({
	providedIn: 'root'
})

export class RecipeService {
	static readonly cacheTimeout = 30 * 60 * 1000

	private cache?: Recipe[]
	recipeObj?: recipesDictionary

	constructor(
		private firestore: AngularFirestore
	) { }

	setRecipe(uid: string, recipe: Recipe) {
		const firestorePlacesCollection = this.firestore.collection('recipes').doc(uid).collection('recipe')
		firestorePlacesCollection.doc(recipe.id.toString()).set(recipe, {merge: true})
	}

	getRecipes(uid: string):Observable<any> { 
		if (this.cache){
			return new Observable(subscriber => {
				subscriber.next(this.cache)
			})
		}
		const now = new Date().getTime()
		const cacheDate = Number(window.localStorage.getItem('cacheDate'))
		if (now - cacheDate < RecipeService.cacheTimeout){
			const lsr = window.localStorage.getItem('recipes')
			if(lsr){
				const r = JSON.parse(lsr)
				this.cache =  (r as unknown as Recipe[])
				this.recipeObj = this.mapToDictionary(this.cache)
				return new Observable(subscriber => {
					subscriber.next(this.cache)
				})
			}
		}

		const firestorePlacesCollection = this.firestore.collection('recipes').doc(uid).collection('recipe')
		return firestorePlacesCollection.valueChanges({ idField: 'id' }).pipe(map(r => {
			this.cache = (r as unknown as Recipe[]).sort(this.sort)
			this.recipeObj = this.mapToDictionary(this.cache)

			window.localStorage.setItem('recipes', JSON.stringify(this.cache))
			window.localStorage.setItem('cacheDate', new Date().getTime().toString())
			return this.cache
		}));
	}

	getRecipe(id: number):Recipe | null {
		if(this.recipeObj){
			return this.recipeObj[id]
		}
		return null
	}

	groupBy(recipes: Recipe[], key: keyof Recipe): Recipe[][]{
		const gc: groupContainer = {}
		recipes.forEach(r => {
			const c = r[key]
			if(typeof c === 'string'){
				(gc[c] = gc[c] || []).push(r)
			}
			
		})
		return Object.values(gc)
	}

	private mapToDictionary(recipes: Recipe[]): recipesDictionary{
		const obj: recipesDictionary = {}
		recipes.forEach(r => {
			obj[r.id] = r
		})
		return obj
	}

	private sort(a: Recipe, b: Recipe): number{
		const cSort = a.category.localeCompare(b.category)
		if(cSort !== 0){
			return cSort
		}
		return a.name.localeCompare(b.name)
	}
}
