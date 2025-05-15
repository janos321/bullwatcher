import { Component } from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { adtoPortfolio } from './adtoPortfolio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HighlightSymbolPipePipe } from "../../Pipe/symbol-portfolio-pipe.pipe";
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { queryBySymbolInput,queryBySymbolABC,queryBySymbolAmountOrder,queryBySymbolMinAmount } from '../../service/queries';
import { Firestore } from '@angular/fire/firestore';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FirebaseUserService } from '../../service/UserFirebaseService';
import { PortfolioCoinRowComponent } from './portfolio-coin-row/portfolio-coin-row.component';



@Component({
  selector: 'app-portfolio',
  imports: [MatCardModule,PortfolioCoinRowComponent,MatSlideToggleModule, MatButtonModule, MatInputModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatDialogModule, CommonModule, HighlightSymbolPipePipe, FormsModule, MatRadioModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})


export class PortfolioComponent {
  user: User | null = null;
  coins: Record<string, number> = {};
  prices: { [symbol: string]: number } = {};
  allVolume: number = 0;
  symbolFilter: string = '';
  sortType: 'abc' | 'amount' = 'amount';
  descending: boolean = true;
  minAmount: number = 0;
  filteredSymbols: string[] = [];


get coinSymbols(): string[] {
  return this.filteredSymbols;
}


async updateCoinSymbols(): Promise<void> {
  if(!this.user){
    return
  }
  const lists: string[][] = [];

  if (this.symbolFilter.trim()) {
    const result = await queryBySymbolInput(this.firestore, this.user.id, this.symbolFilter);
    lists.push(result.map(([symbol]) => symbol));
  }

  if (this.sortType === 'abc') {
    const result = await queryBySymbolABC(this.firestore, this.user.id, this.descending);
    lists.push(result.map(([symbol]) => symbol));
  } else if (this.sortType === 'amount') {
    const result = await queryBySymbolAmountOrder(this.firestore, this.user.id, this.descending);
    lists.push(result.map(([symbol]) => symbol));
  }

  if (this.minAmount > 0) {
    const result = await queryBySymbolMinAmount(this.firestore, this.user.id, this.minAmount);
    lists.push(result.map(([symbol]) => symbol));
  }

  if (lists.length === 0) {
    this.filteredSymbols = Object.keys(this.coins);
    return;
  }

  const intersection = lists.reduce((a, b) => a.filter(x => b.includes(x)));
  this.filteredSymbols = intersection;
  this.fetchPrices();
}

onCoinClicked(symbol: string) {
  const prefillSymbol = symbol.replace(/^BINANCE:/, '').replace(/USDT$/, '');
  const dialogRef = this.dialog.open(adtoPortfolio, {
    data: { prefillSymbol }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && this.user) {
      const { value, amount } = result;
      if (!this.user.settings.portfolio[value]) {
        this.user.settings.portfolio[value] = 0;
        this.coins[value] = 0;
      }
      this.user.settings.portfolio[value] += amount;
      this.firebaseService.updateUser(this.user);
      this.updateCoinSymbols();
    }
  });
}



onCoinRemove(symbol: string) {
  if (this.user?.settings?.portfolio[symbol]) {
    delete this.user.settings.portfolio[symbol];
    delete this.coins[symbol];
    this.firebaseService.updateUser(this.user);
    this.updateCoinSymbols();
  }
}



intervalId: any;

ngOnInit() {
  this.fetchPrices();
  this.intervalId = setInterval(() => this.fetchPrices(), 15000);
}

ngOnDestroy() {
  clearInterval(this.intervalId);
}


  constructor(private userService: UserService, private dialog: MatDialog, private firestore: Firestore, private firebaseService: FirebaseUserService) {
    this.userService.user$.subscribe(u => {
      this.user = u;
      if (this.user?.settings?.portfolio) {
        this.coins = this.user.settings.portfolio;
      }
      this.updateCoinSymbols();
    });
  }

  async addTransaction() {
    const dialogRef = this.dialog.open(adtoPortfolio);
    const result = await dialogRef.afterClosed().toPromise();

    if (!result || !this.user) return;

    const symbol = result.value;
    const quantity = parseFloat(result.amount);

    if (!this.user.settings.portfolio[symbol]) {
      this.user.settings.portfolio[symbol] = 0;
      this.coins[symbol] = 0;
    }

    this.user.settings.portfolio[symbol] += quantity;
    this.userService.save(this.user);

    await this.firebaseService.updateUser(this.user);
    this.updateCoinSymbols();
  }

  async fetchPrices() {
    try {
      const symbols = Object.keys(this.coins)
        .filter(s => s.startsWith('BINANCE:'))
        .map(s => s.replace('BINANCE:', ''));
  
      const response = await fetch('https://api.binance.com/api/v3/ticker/price');
      const data = await response.json();
  
      for (const symbol of symbols) {
        const full = data.find((entry: any) => entry.symbol === symbol);
        if (full) {
          this.prices[`BINANCE:${symbol}`] = parseFloat(full.price);
        }
      }

      this.allVolume = this.filteredSymbols.reduce((sum, symbol) => {
                      const amount = this.coins[symbol];
                      const price = this.prices[symbol];
                      if (price) {
                        return sum + amount * price;
                      }
                      return sum;
                    }, 0);


    } catch (err) {
      console.error('Árfolyamok lekérése sikertelen:', err);
    }
  }


}
