import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup } from "@angular/forms"
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe, types } from 'src/app/core/models/recipe';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common'
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';

@Component({
	selector: 'app-edit-recipe',
	templateUrl: './edit-recipe.component.html',
	styleUrls: ['./edit-recipe.component.scss']
})
export class EditRecipeComponent implements OnInit, OnDestroy {

	recipe?: Recipe | null
	// this subjects to be put in the takeuntil so we can destroy observables on exit
	private readonly destroy$ = new Subject();
	// to make an enum work in the template
	types: typeof types = types;
	// have changes been made in the form?
	dirty = false

	id?: number

	public Editor = ClassicEditor;
	notification = new FormControl('');
	recipeForm!: FormGroup
	categories!: string[]
	keyword = 'category'

	constructor(
		private route: ActivatedRoute,
		private recipeService: RecipeService,
		private sharedService: SharedService,
		private authService: FirebaseAuthService,
		private router: Router
	) { }

	ngOnInit(): void {
		//if all goes well we get the id from the url param
		this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
			this.id = params['recipeId'];
			if (this.id) {
				this.recipe = this.recipeService.getRecipe(this.id)
				this.setupForm()
				this.categories = this.recipeService.getAllCategories()
			}
		})
		// get messages from the header
		this.sharedService.messageSource.pipe(takeUntil(this.destroy$)).subscribe((message: number) => {
			this.handleMessages(message)
		})
	}

	private handleMessages(message: number) {
		switch(message){
			case SharedService.id.ac_save:
				this.saveRecipe()
				break
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}


	private setupForm() {
		if (this.recipe) {
			this.recipeForm = new FormGroup({
				title: new FormControl(this.recipe.name),
				ckIngredients: new FormControl(this.recipe.ingredients),
				category: new FormControl(this.recipe.category),
				ckInstructions: new FormControl(this.recipe.recipeInstructions),
				tags: new FormControl(this.recipe.tags.join(', ')),
				cookTime: new FormControl(this.recipe.cookTime),
				prepTime: new FormControl(this.recipe.prepTime),
				servings: new FormControl(this.recipe.recipeYield)
			})
			
			this.recipeForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
				if (!this.dirty){
					this.dirty = true
					this.sendMessage(SharedService.id.st_dirty)
				}
			})
		}
	}

	clearTitle(): void {
		this.recipeForm.patchValue({
			title: ''
		})
	}

	clearTags(): void {
		this.recipeForm.patchValue({
			tags: ''
		})
	}

	saveRecipe() {
		if(this.dirty) {
			this.authService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
				const uid = user?.uid
				if(uid && this.recipe) {
					const recipe = this.mapRecipe(this.recipeForm.value, this.recipe)

					this.recipeService.setRecipe(uid, recipe)
					this.router.navigate(['/show-recipe', this.id]);
				}
			})
		} else {
			this.router.navigate(['/show-recipe', this.id]);
		}
	}

	private mapRecipe(values: any, recipe: Recipe): Recipe{
		// determine type based on ingredients and instructions content
		if(values.ckIngredients.length > 0 && values.ckInstructions.length > 0){
			recipe.type = types.recipe
		} else if(values.ckIngredients.length > 0){
			recipe.type = types.list
		} else if(values.ckInstructions.length > 0){
			recipe.type = types.note
		} else {
			recipe.type = types.recipe
		}

		recipe.name = values.title
		recipe.ingredients = values.ckIngredients
		recipe.category = values.category.length > 0 ? values.category: 'Ongecategoriseerd'
		recipe.recipeInstructions = values.ckInstructions
		recipe.datePublished = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'nl-NL')
		recipe.recipeYield = values.servings
		recipe.cookTime = values.cookTime
		recipe.prepTime = values.prepTime

		recipe.tags = values.tags.split(',').map((t: string) => t.trim())

		return recipe
	}

	private sendMessage(message: number): void {
        this.sharedService.messageSource.next(message)
    }
}
