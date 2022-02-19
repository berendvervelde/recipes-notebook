import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import firebase from 'firebase/app'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
	selector: 'app-list-header',
	templateUrl: './list-header.component.html',
	styleUrls: ['./list-header.component.scss']
})
export class ListHeaderComponent implements OnInit, OnDestroy {
	// search delay tme (ms)
	private static readonly searchDelay = 400
	// get the search input so we can set focus to it
	@ViewChild('searchInput') searchInput?: ElementRef;
	// this subjects to be put in the takeuntil so we can destroy observables on exit
	private readonly destroy$ = new Subject();
	// delay searches so we don't have stuttering interfaces
	private searchDelayTimer: any;
	// firebase user
	user?: firebase.User;
	// toggle authentication icon
	authenticated = true
	// toggle search input bar
	showSearch = false
	// toggle overflow menu
	showSideMenu = false
	// the search input 
	searchQuery = new FormControl('')

	constructor(
		public auth: AngularFireAuth,
		private recipeService: RecipeService,
		private authService: FirebaseAuthService,
		private sharedService: SharedService
	){}

	ngOnInit(): void {
		this.authService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
			this.user = user
			// listen to changes in the searchinput
			this.searchQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe (val => {
				this.search(val)
			})
		})
		this.sharedService.messageSource.pipe(takeUntil(this.destroy$)).subscribe((message: number) => {
			this.handleMessages(message)
		})
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	authToggle() {
		if (this.authenticated) {
			this.auth.signOut()
			this.authenticated = false
		} else {
			this.login()
		}
	}
	searchToggle(){
		if(this.searchInput) {
			this.showSearch = !this.showSearch
			if(this.showSearch){
				setTimeout(()=>{
					this.searchInput?.nativeElement.focus()
				},0)
			} else {
				this.searchQuery.setValue('')
			}
		}
	}

	menuToggle(){
		this.showSideMenu = !this.showSideMenu
	}

	toggleGroup(){
		this.sendMessage(SharedService.id.ac_toggle_categoryGroups)
	}

	exportJson(){
		this.sendMessage(SharedService.id.ac_export_JSON)
	}

	login() {
		this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
		.then((result: firebase.auth.UserCredential) => {
			/** @type {firebase.auth.OAuthCredential} */
			var credential: firebase.auth.OAuthCredential = result.credential as firebase.auth.OAuthCredential
			// set the icon
			this.authenticated = true

			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = credential.accessToken;

			var user = result.user;
			// ...
		  }).catch((error) => {
			// Handle Errors here.
			var errorCode = error.code
			var errorMessage = error.message
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential
			// ...
		});
	}
	
	private search(searchQuery: string): void{
		if (this.searchDelayTimer){
			clearTimeout(this.searchDelayTimer);
		}
		this.searchDelayTimer = setTimeout(() => {
			this.recipeService.updateSearchQuery(searchQuery)
		}, ListHeaderComponent.searchDelay)
	}
	//incoming messages
	private handleMessages(message: number): void {
		switch (message){

			
		}
	}
	//outgoing messages
	private sendMessage(message: number): void {
		this.sharedService.messageSource.next(message)
	}
}
