interface image {
	'@type': 'ImageObject'
	url: string
}
interface author {
	'@type': 'Person'
	name: string
}
interface nutrition {
	'@type': 'NutritionInformation',
	fatContent?: string
	calories?: number
	servingSize?: string
}
interface aggregateRating {
	'@type': 'AggregateRating'
	reviewCount: number
	ratingValue: number
}

export enum types {
	recipe = 0,
	note = 1,
	list = 2
}

export interface Recipe {
	'@type': 'Recipe'
	'@context': 'http://schema.org/'
	id: number
	image: image
	totalTime?: string
	author:author
	cookTime: string
	description: string
	type: types,
	prepTime: string
	tags: string[]
	datePublished: string
	recipeYield?: number
	nutrition: nutrition
	name:string
	ingredients: string
	category: string,
	aggregateRating: aggregateRating
	recipeInstructions: string
}