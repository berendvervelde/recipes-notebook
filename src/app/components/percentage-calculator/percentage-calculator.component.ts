import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalculatePercentagesService } from 'src/app/core/services/calculate-percentages.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
	selector: 'app-percentage-calculator',
	templateUrl: './percentage-calculator.component.html',
	styleUrls: ['./percentage-calculator.component.scss']
})
export class PercentageCalculatorComponent implements OnInit, OnDestroy {

	// this subjects to be put in the takeuntil so we can destroy observables on exit
	private readonly destroy$ = new Subject();
	
	// some settings for the percentagecalculator
	showPercentageCalculator = false
	percentage = 100
	servings = 1
	calculatedServings = 1
	calculateType = 'percentage'

	inputAmount = new FormControl(this.percentage)

	calculatedIngredientTextNodes?: Node[]
	calculatedSourceTextValues?: string[]

	@Input() ingredients?: string
	@Input() yields?: number
	// used for showing calculated ingredients in the calculator
	output?: ElementRef
	@ViewChild('calculatedResult') set cc(cc: ElementRef) {
		if (cc) {
			this.output = cc
			this.calculatedIngredientTextNodes = this.calculatePercentagesService.treeWalker(this.output.nativeElement)
			this.calculatedSourceTextValues = this.calculatePercentagesService.getTextValues(this.calculatedIngredientTextNodes)
		}
	}

	clickTimer?: number

	constructor(
		private calculatePercentagesService: CalculatePercentagesService,
		private sharedService: SharedService
	) { }

	ngOnInit(): void {
		if(this.yields){
			this.servings = this.yields
			this.calculatePercentagesService.yields = this.yields
		}
		
		this.inputAmount.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: number) => {
			if (this.calculateType === 'percentage') {
				if (val !== this.percentage) {
					this.percentage = val
					this.calculatePercentagesService.percentage = val
					this.calculatePercentagesService.calculateAmounts(this.calculatedSourceTextValues, this.calculatedIngredientTextNodes)
				}
			} else {
				if (val !== this.servings) {
					this.servings = val
					this.calculatePercentagesService.servings = val
					this.calculatePercentagesService.calculateAmounts(this.calculatedSourceTextValues, this.calculatedIngredientTextNodes)
				}
			}
		})

		// get messages from the header
		this.sharedService.messageSource.pipe(takeUntil(this.destroy$)).subscribe((message: number) => {
			this.handleMessages(message)
		})
	}

	ngOnDestroy(): void {
		window.clearTimeout(this.clickTimer)
		this.destroy$.next()
		this.destroy$.unsubscribe()
	}
	
	setCalculateType(type: string) {
		this.calculateType = type
		if (this.calculateType === 'percentage') {
			this.inputAmount.setValue(this.percentage)
		} else {
			this.inputAmount.setValue(this.servings)
		}
	}
	closeModal(): void {
		this.showPercentageCalculator = false
	}

	applyPercentage(){
		this.sendMessage(SharedService.id.ac_apply_percentage)
		this.showPercentageCalculator = false
	}

	mouseDown(amnt: number) {
		window.clearTimeout(this.clickTimer)
		this.updateValue(amnt, false)
		this.clickTimer = window.setTimeout(() => {
			this.updateValue(amnt, true)
		}, 1000)
	}
	
	mouseUp() {
		window.clearTimeout(this.clickTimer)
	}

	private handleMessages(message: number) {
		switch (message) {
			case SharedService.id.ac_open_percentage_calculator:
				this.showPercentageCalculator = true
				this.resetCalculator()
				break
		}
	}

	private resetCalculator(){
		this.percentage = 100
		this.calculatePercentagesService.percentage = this.percentage
		this.servings = this.yields || 1
		this.calculatePercentagesService.servings = this.servings
		this.calculateType = 'percentage'
		this.calculatePercentagesService.type = this.calculateType
		this.inputAmount.setValue(this.percentage)
	}

	private updateValue(amnt: number, cont: boolean) {
		this.calculatePercentagesService.type = this.calculateType

		if (this.calculateType === 'percentage') {
			if (amnt > 0 || (amnt < 0 && this.percentage > 1)) {
				this.inputAmount.setValue(this.percentage += amnt)
				this.calculatePercentagesService.percentage = this.percentage
				this.calculatePercentagesService.calculateAmounts(this.calculatedSourceTextValues, this.calculatedIngredientTextNodes)
				if (cont) {
					this.clickTimer = window.setTimeout(() => {
						this.updateValue(amnt, true)
					}, 20)
				}
			}
		} else {
			if (amnt > 0 || (amnt < 0 && this.servings > 1)) {
				this.inputAmount.setValue(this.servings += amnt)
				this.calculatePercentagesService.servings = this.servings
				this.calculatePercentagesService.calculateAmounts(this.calculatedSourceTextValues, this.calculatedIngredientTextNodes)
				if (cont) {
					this.clickTimer = window.setTimeout(() => {
						this.updateValue(amnt, true)
					}, 300)
				}
			}
		}
	}

	private sendMessage(message: number): void {
		this.sharedService.messageSource.next(message)
	}

}
