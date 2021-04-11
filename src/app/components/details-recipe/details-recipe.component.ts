import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipe, types } from 'src/app/core/models/recipe';
import { CalculatePercentagesService } from 'src/app/core/services/calculate-percentages.service';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
	selector: 'app-details-recipe',
	templateUrl: './details-recipe.component.html',
	styleUrls: ['./details-recipe.component.scss']
})
export class DetailsRecipeComponent implements OnInit, OnDestroy {
	// used for showing calculated amounts
	ingredients?: ElementRef
	@ViewChild('ingredients') set c(c: ElementRef) {
		if(c){
			this.ingredients = c
			this.ingredientTextNodes = this.calculatePercentagesService.treeWalker(this.ingredients.nativeElement)
			this.sourceTextValues = this.calculatePercentagesService.getTextValues(this.ingredientTextNodes)
		}
	}
	
	recipe: Recipe | null = null

	// this subjects to be put in the takeuntil so we can destroy observables on exit
	private readonly destroy$ = new Subject();

	// to make an enum work in the template
	types: typeof types = types;

	calculatedServings = 1
	ingredientTextNodes?: Node[]
	sourceTextValues?: string[]

	tags = ''


	constructor(
		private route: ActivatedRoute,
		private recipeService: RecipeService,
		private sharedService: SharedService,
		private authService: FirebaseAuthService,
		private router: Router,
		private calculatePercentagesService: CalculatePercentagesService
	) { }


	ngOnInit(): void {
		//if all goes well we get the id from the url param
		this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
			const id = params['recipeId'];
			if (id) {
				this.recipe = this.recipeService.getRecipe(Number(id))
				if (this.recipe) {
					this.recipe.recipeYield = this.recipe.recipeYield || 1

					this.calculatePercentagesService.servings = this.recipe.recipeYield
					this.calculatedServings = this.recipe.recipeYield

					if (this.recipe.tags.length) {
						// display the tags as a comma seperated list
						this.tags = this.recipe.tags.join(', ')
					}
				}
			}
		})
		// get messages from the header
		this.sharedService.messageSource.pipe(takeUntil(this.destroy$)).subscribe((message: number) => {
			this.handleMessages(message)
		})
	}

	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.unsubscribe()
	}
	
	applyPercentage() {
		if(this.ingredients && this.sourceTextValues && this.ingredientTextNodes){
			this.calculatePercentagesService.calculateAmounts(this.sourceTextValues, this.ingredientTextNodes)
		}

		const yields = this.recipe?.recipeYield || 1
		this.calculatedServings = this.calculatePercentagesService.type === 'percentage' ? (this.calculatePercentagesService.percentage / 100) * yields: this.calculatePercentagesService.servings
	}
	
	private handleMessages(message: number) {
		switch (message) {
			case SharedService.id.ac_delete:
				this.deleteRecipe()
				break
			case SharedService.id.ac_apply_percentage:
				this.applyPercentage()

		}
	}
	private deleteRecipe() {
		this.authService.getCurrentUser().subscribe(user => {
			const uid = user?.uid
			if (uid && this.recipe) {
				this.recipeService.deleteRecipe(uid, this.recipe)
				this.router.navigate(['/recipes']);
			}
		})
	}
}
