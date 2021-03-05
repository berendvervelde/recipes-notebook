import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth'

@Injectable({
	providedIn: 'root'
})
export class FirebaseAuthServiceService {
	private currentUser: firebase.User | undefined;

	constructor(
		public afAuth: AngularFireAuth) {
	}

	getCurrentUser(): Observable<any>{
		if(this.currentUser){
			return new Observable(subscriber => {
				subscriber.next(this.currentUser)
			})
		} else {
			return this.afAuth.authState
		}
	}
}
