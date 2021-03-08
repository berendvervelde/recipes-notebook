import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe } from '../models/recipe';
import firebase from 'firebase/app';

interface groupContainer {
	[key: string]: Recipe[]
}
interface recipesDictionary {
	[id: string]: Recipe | null
}

interface MutationDate {
		mutationDate: firebase.firestore.Timestamp
}

@Injectable({
	providedIn: 'root'
})

export class RecipeService {

	static readonly cacheTimeout = 60 * 60 * 1000 // 60 minutes

	private cache?: Recipe[]
	recipeObj?: recipesDictionary
	private searchQuery = ''

	private recipesMessenger = new BehaviorSubject<Recipe[]>([]);

	constructor(
		private firestore: AngularFirestore
	) { }

	subscribeToRecipes(): Observable<Recipe[]>  {
        return this.recipesMessenger.asObservable();
    }

	updateSearchQuery(sq: string) {
		this.searchQuery = sq.toLowerCase()
		if(this.cache){
			this.searchFilter(this.cache)
		}
	}

	setRecipe(uid: string, recipe: Recipe) {
		const firestorePlacesCollection = this.firestore.collection('recipes').doc(uid).collection('recipe')
		firestorePlacesCollection.doc(recipe.id.toString()).set(recipe, {merge: true})
	}

	getRecipes(uid: string): void {
		//get mutationdate from firebase
		this.firestore.collection('recipes').doc(uid).valueChanges().subscribe(resp => {
			if(resp){
				const mutationDate = (resp as MutationDate).mutationDate.seconds
				// get cachedate from localstorage
				const cacheDate = Number(window.localStorage.getItem('cacheDate'))
				if (cacheDate && cacheDate === mutationDate){
					if (this.cache){
						// or always get it from localstorage? Do we need this?
						this.recipesMessenger.next(this.cache)
					} else {
						const lsr = window.localStorage.getItem('recipes')
						if(lsr){
							const r = JSON.parse(lsr)
							this.cache =  (r as unknown as Recipe[])
							this.recipeObj = this.mapToDictionary(this.cache)
							this.recipesMessenger.next(this.cache)
						} else {
							// no localstorage recipes
							this.getRecipesFromFirebase(uid, mutationDate)
						}
					}
				} else {
					// no cachedate or cachedate is out of sync
					this.getRecipesFromFirebase(uid, mutationDate)
				}
			} else {
				//there is no firebase database
				// todo: create database
			}
		})
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

	private getRecipesFromFirebase(uid: string, mutationDate: number) {
		const firestorePlacesCollection = this.firestore.collection('recipes').doc(uid).collection('recipe')
	
		firestorePlacesCollection.valueChanges({ idField: 'id' }).subscribe(r => {
			this.cache = (r as unknown as Recipe[]).sort(this.sort)
			this.recipeObj = this.mapToDictionary(this.cache)

			window.localStorage.setItem('recipes', JSON.stringify(this.cache))
			window.localStorage.setItem('cacheDate', mutationDate.toString())

			this.recipesMessenger.next(this.cache)
		});
	}
	private searchFilter(cache: Recipe[]): void {
		if(this.searchQuery !== ''){
			const result: Recipe[] = []

			cache.forEach(r => {
				if (r.description.toLowerCase().indexOf(this.searchQuery) > -1 || 
					r.recipeInstructions.toLowerCase().indexOf(this.searchQuery) > -1 || 
					r.ingredients.toLowerCase().indexOf(this.searchQuery) > -1 ||
					r.name.toLowerCase().indexOf(this.searchQuery) > -1
					){
					result.push(r)
				}
			})
			this.recipesMessenger.next(result)
		}
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
