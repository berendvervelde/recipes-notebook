import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipe, types } from 'src/app/core/models/recipe';
import firebase from 'firebase/app';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { JsonImporterService } from 'src/app/core/services/json-importer.service';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
	selector: 'app-import-list-recipes',
	templateUrl: './import-list-recipes.component.html',
	styleUrls: ['./import-list-recipes.component.scss']
})
export class ImportListRecipesComponent implements OnInit, OnDestroy {
	form!: FormGroup;

	// this subjects to be put in the takeuntil so we can destroy observables on exit
	private readonly destroy$ = new Subject()

	importedRecipes?: Recipe[]
	recipes?: Recipe[]
	combinedRecipes?: Recipe[][]
	user?: firebase.User;

	types: typeof types = types;

	get ordersFormArray() {
		return this.form.controls.orders as FormArray;
	}

	constructor(
		private jsonImporterService: JsonImporterService,
		private recipeService: RecipeService,
		private authService: FirebaseAuthService,
		private formBuilder: FormBuilder
	) { }

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			orders: new FormArray([])
		})

		this.recipeService.subscribeToRecipes().pipe(takeUntil(this.destroy$)).subscribe(resp => {
			if (resp) {
				this.recipes = resp
				if (this.importedRecipes && this.importedRecipes.length) {
					this.combinedRecipes = this.jsonImporterService.combineRecipes(this.recipes, this.importedRecipes)
				}

			} else {
				this.recipes = []
			}
		})

		this.authService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
			this.user = user
			const uid = this.user?.uid
			if (uid) {
				this.recipeService.getRecipes(uid)
				this.importRecipes()
			}
		})
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	submit() {
		if(this.importedRecipes){
			const selectedOrderIds = this.form.value.orders.map(
				(checked: boolean, i:number) => checked ? (this.importedRecipes as Recipe[])[i].id : -1).filter((id:number) => id !== -1)
			console.log(selectedOrderIds)
		}
	}

	private addCheckboxes(list:Recipe[]) {
		list.forEach(() => this.ordersFormArray.push(new FormControl(false)))
	}

	private importRecipes(): void {
		this.jsonImporterService.importRecipesJson().pipe(takeUntil(this.destroy$)).subscribe(resp => {
			if (resp) {
				this.importedRecipes = resp
				this.addCheckboxes(this.importedRecipes)
				if (this.recipes && this.recipes.length) {
					this.combinedRecipes = this.jsonImporterService.combineRecipes(this.recipes, this.importedRecipes)
				}
			}
		})
	}
}
