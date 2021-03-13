import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsPageComponent } from './components/pages/details-page/details-page.component';
import { EditPageComponent } from './components/pages/edit-page/edit-page.component';
import { ListPageComponent } from './components/pages/list-page/list-page.component';

const routes: Routes = [
	{ path: 'recipes', component: ListPageComponent },
	{ path: '',   redirectTo: '/recipes', pathMatch: 'full' },
	{ path: 'show-recipe/:recipeId', component: DetailsPageComponent },
	{ path: 'edit-recipe/:recipeId', component: EditPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
