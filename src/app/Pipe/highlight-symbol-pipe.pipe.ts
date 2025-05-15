import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSymbolPipe'
})
export class HighlightSymbolPipePipe implements PipeTransform {

  transform(value: string): string {
    const match = value.match(/^(.*) \((.*)\)$/);
    if (!match) return `<strong>${value}</strong>`;
    const [, name, symbol] = match;
    return `<strong>${name}</strong> (${symbol})`;
  }

}
