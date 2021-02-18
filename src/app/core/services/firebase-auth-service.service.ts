import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class FirebaseAuthServiceService {
	//private authState: Observable<firebase.User>
	private currentUser: firebase.User = null;

	constructor(
		public afAuth: AngularFireAuth,
		private snackBar: MatSnackBar) {
	}

	getCurrentUser(): Observable<firebase.User>{
		if(this.currentUser){
			return new Observable(subscriber => {
				subscriber.next(this.currentUser);
			})
		} else {
			return this.afAuth.authState;
		}
	}
}
