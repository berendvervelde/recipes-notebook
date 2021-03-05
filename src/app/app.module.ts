import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TruncatePipe } from './shared/truncate.pipe';
import { ListHeaderComponent } from './components/list-header/list-header.component';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component'
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { RecipeIconComponent } from './shared/recipe-icon/recipe-icon.component'
// firestore
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { DetailHeaderComponent } from './components/details-header/details-header.component';
import { ListPageComponent } from './components/pages/list-page/list-page.component';
import { DetailsPageComponent } from './components/pages/details-page/details-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
	ListHeaderComponent,
	RecipesListComponent,
    TruncatePipe,
    RecipeDetailsComponent,
    RecipeIconComponent,
    DetailHeaderComponent,
    ListPageComponent,
    DetailsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule,
	AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
	FormsModule,
	ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
