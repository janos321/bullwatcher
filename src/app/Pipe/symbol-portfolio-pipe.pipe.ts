import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SymbolPortfolio'
})
export class HighlightSymbolPipePipe implements PipeTransform {

  transform(value: string): string {
    const match = value.match(/^BINANCE:([A-Z]+)USDT$/);
    if (match) {
      return match[1];
    }
    return value;
  }

}
