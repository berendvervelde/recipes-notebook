import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
	/*
		will truncate a string up to [limit] characters or the end of the next word and add a ellipss
		see https://stackoverflow.com/questions/44669340/how-to-truncate-text-in-angular2

		<h1>{{longStr | truncate }}</h1>
		<!-- Outputs: A really long string that... -->

		<h1>{{longStr | truncate : 12 }}</h1>
		<!-- Outputs: A really lon... -->

		<h1>{{longStr | truncate : 12 : true }}</h1>
		<!-- Outputs: A really... -->

		<h1>{{longStr | truncate : 12 : false : '***' }}</h1>
		<!-- Outputs: A really lon*** -->
	*/
	transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
		if (completeWords) {
			limit = value.substr(0, limit).lastIndexOf(' ');
		}
		return value.length > limit ? value.substr(0, limit) + ellipsis : value;
	}
}