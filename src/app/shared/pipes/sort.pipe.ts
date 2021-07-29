import { Injectable, Pipe, PipeTransform } from '@angular/core';

export type SortOrder = 'asc' | 'desc';

@Injectable()
@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any[], sortOrder: SortOrder | string = 'asc', sortKey?: string): any {
    sortOrder = sortOrder && (sortOrder.toLowerCase() as any);

    if (!value || (sortOrder !== 'asc' && sortOrder !== 'desc')) { return value; }

    let numberArray = [];
    let stringArray = [];

    if (!sortKey) {
      numberArray = value.filter(item => typeof item === 'number').sort();
      stringArray = value.filter(item => typeof item === 'string').sort();
    } else {
      numberArray = value.filter(item => typeof item[sortKey] === 'number').sort((a, b) => a[sortKey] - b[sortKey]);
      stringArray = value
        .filter(item => typeof item[sortKey] === 'string')
        .sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
    }
    const sorted = numberArray.concat(stringArray);
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }
}

@Pipe({
  // tslint:disable-next-line:pipe-naming
  name: 'toNumber',
  pure: false
})
export class ToNumberPipe implements PipeTransform {
  transform(items: any): any {
    if (!items) {
      return 0;
    }
    return parseInt(items, 10);
  }
}
