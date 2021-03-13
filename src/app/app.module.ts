import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { TruncatePipe } from './shared/truncate.pipe'
import { ListHeaderComponent } from './components/list-header/list-header.component'
import { ListRecipesComponent } from './components/list-recipes/list-recipes.component'
import { DetailsRecipeComponent } from './components/details-recipe/details-recipe.component'
import { RecipeIconComponent } from './shared/recipe-icon/recipe-icon.component'
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment'
import { DetailHeaderComponent } from './components/details-header/details-header.component'
import { ListPageComponent } from './components/pages/list-page/list-page.component'
import { DetailsPageComponent } from './components/pages/details-page/details-page.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditPageComponent } from './components/pages/edit-page/edit-page.component'
import { EditRecipeComponent } from './components/edit-recipe/edit-recipe.component'
import { EditHeaderComponent } from './components/edit-header/edit-header.component'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [
    AppComponent,
	ListHeaderComponent,
	ListRecipesComponent,
    TruncatePipe,
    DetailsRecipeComponent,
    RecipeIconComponent,
    DetailHeaderComponent,
    ListPageComponent,
    DetailsPageComponent,
    EditPageComponent,
    EditRecipeComponent,
    EditHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule,
	AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
	FormsModule,
	ReactiveFormsModule,
	CKEditorModule,
	AutocompleteLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
