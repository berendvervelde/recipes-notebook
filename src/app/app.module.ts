import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TruncatePipe } from './shared/truncate.pipe';
import { HeaderComponent } from './components/header/header.component';
import { RecipesListComponent } from './components/pages/recipes-list/recipes-list.component'
import { RecipeDetailsComponent } from './components/pages/recipe-details/recipe-details.component';
import { RecipeIconComponent } from './shared/recipe-icon/recipe-icon.component'

@NgModule({
  declarations: [
    AppComponent,
	HeaderComponent,
	RecipesListComponent,
    TruncatePipe,
    RecipeDetailsComponent,
    RecipeIconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule
	
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
