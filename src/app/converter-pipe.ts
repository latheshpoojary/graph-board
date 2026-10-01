import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'converter',
})
export class ConverterPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {

    if (value >= 1000 && value < 100000) {
      return `${Math.ceil(value / 1000)}K`
    } else if (value >= 100000 && value < 10000000) {
      return `${Math.ceil(value % 100000)}M`
    }
    else {
      return value
    }
    return null;
  }
}
