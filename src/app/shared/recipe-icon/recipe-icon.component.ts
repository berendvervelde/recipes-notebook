
import { AfterViewInit, Component, ElementRef, Input  } from '@angular/core';
import { recipeIcons } from './recipe-icons'

@Component({
	selector: 'recipe-icon',
	template: '<ng-content></ng-content>',
	styles: [':host::ng-deep svg {display: inline-block;}']
})


export class RecipeIconComponent implements AfterViewInit{

	colorCode?: string

	@Input()
	set name(iconName: string) {
		this.element.nativeElement.innerHTML =  recipeIcons[iconName] || null
	}

	@Input()
	set color(colorCode: string){
		this.colorCode = colorCode
	}

	constructor(private element: ElementRef) { }

	ngAfterViewInit(): void {
		const el = this.element.nativeElement.querySelector('svg path')
		if(this.colorCode && el){
			el.style.fill = this.colorCode
		}
	}
}
