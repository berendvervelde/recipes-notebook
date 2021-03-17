import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipe, types } from 'src/app/core/models/recipe';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
	selector: 'app-details-recipe',
	templateUrl: './details-recipe.component.html',
	styleUrls: ['./details-recipe.component.scss']
})
export class DetailsRecipeComponent implements OnInit {
	recipe?: Recipe | null

	// this subjects to be put in the takeuntil so we can destroy observables on exit
	private readonly destroy$ = new Subject();


	// to make an enum work in the template
	types: typeof types = types;

	constructor(
		private route: ActivatedRoute,
		private recipeService: RecipeService,
		private sharedService: SharedService,
		private authService: FirebaseAuthService,
		private router: Router
	) { }

	ngOnInit(): void {
		//if all goes well we get the id from the url param
		this.route.params.subscribe(params => {
			const id = params['recipeId'];
			if(id){
				this.recipe = this.recipeService.getRecipe(Number(id))
			}
		})
		// get messages from the header
		this.sharedService.messageSource.pipe(takeUntil(this.destroy$)).subscribe((message: number) => {
			this.handleMessages(message)
		})
	}

	private handleMessages(message: number) {
		switch(message){
			case SharedService.id.ac_delete:
				this.deleteRecipe()
				break
		}
	}
	private deleteRecipe() {
		this.authService.getCurrentUser().subscribe(user => {
			const uid = user?.uid
			if(uid && this.recipe) {
				this.recipeService.deleteRecipe(uid, this.recipe)
				this.router.navigate(['/recipes']);
			}
		})
	}
}
