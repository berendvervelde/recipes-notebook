import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import firebase from 'firebase/app'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'

@Component({
	selector: 'app-list-header',
	templateUrl: './list-header.component.html',
	styleUrls: ['./list-header.component.scss']
})
export class ListHeaderComponent implements OnInit, OnDestroy {
	private readonly destroy$ = new Subject();

	authenticated = true
	showSearch = false
	showMenu = false

	searchQuery = new FormControl('')

	constructor(
		public auth: AngularFireAuth
	){}
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
	ngOnInit(): void {
		this.searchQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe (val => {
			console.log(val)
		})
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
		this.showSearch = !this.showSearch
	}

	menuToggle(){
		this.showMenu = !this.showMenu
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

}
