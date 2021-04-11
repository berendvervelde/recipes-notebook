import { verifyHostBindings } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CalculatePercentagesService {

	_servings = 1
	get servings() {
		return this._servings
	}
	set servings(servings: number) {
		this._servings = servings
	}
	_percentage = 100
	get percentage(){
		return this._percentage
	}
	set percentage(percentage: number){
		this._percentage = percentage
	}
	_type = 'percentage'
	get type(){
		return this._type
	}
	set type(type: string){
		this._type = type
	}
	_yields = 1
	get yields(){
		return this._yields
	}
	set yields(yields: number){
		this._yields = yields
	}

	constructor() { }

	treeWalker(el: HTMLElement): Node[] {
		const treewalker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
		let node: Node | null
		const textNodes = []
		while (node = treewalker.nextNode()) {
			if (node) {
				textNodes.push(node)
			}
		}
		return textNodes
	}
	getTextValues(ingredientTextNodes: Node[]): string[] {
		const textValues: string[] = []
		if (ingredientTextNodes && ingredientTextNodes.length) {
			for (let i = 0, l = ingredientTextNodes.length; i < l; i++) {
				textValues.push(ingredientTextNodes[i].nodeValue as string)
			}
		}
		return textValues
	}
	calculateAmounts(sourceTextValues?: string[], ingredientTextNodes?: Node[]): void {
		const regex = /[\d|,|.|\+]+/g;

		if (sourceTextValues && ingredientTextNodes) {
			let calculationFactor = this.percentage / 100
			if (this.type !== 'percentage') {
				calculationFactor = this.servings / this.yields
			}

			for (let i = 0, l = sourceTextValues?.length; i < l; i++) {
				const matches = sourceTextValues[i].match(regex)
				if (matches) {
					const newNumber = (Number(matches[0].replace(',', '.')) * calculationFactor).toFixed(2).replace('.', ',')
					const newLine = sourceTextValues[i].replace(matches[0], newNumber)
					ingredientTextNodes[i].nodeValue = newLine
				}
			}
		}
	}
}
