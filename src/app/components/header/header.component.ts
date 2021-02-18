import { Component } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	title = 'Mijn recepten notitieblok'
	authenticated = true
	showSearch = false

	authToggle() {
		if (this.authenticated) {
			this.authenticated = false
		} else {
			this.authenticated = true;
		}
	}
	searchToggle(){
		this.showSearch = !this.showSearch
	}

}
