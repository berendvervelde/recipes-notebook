import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailsComponent } from './components/pages/recipe-details/recipe-details.component';
import { RecipesListComponent } from './components/pages/recipes-list/recipes-list.component';

const routes: Routes = [
	{ path: 'recipes', component: RecipesListComponent },
	{ path: '',   redirectTo: '/recipes', pathMatch: 'full' },
	{ path: 'show-recipe/:recipeId', component: RecipeDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
