import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { User, SymbolGroups } from '../../model/user';
import { UserService } from '../../service/user.service';
import {  MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { adSymbol } from './adSymbol';
import { adList } from './adList';
import { isLoggedIn } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { HighlightSymbolPipePipe } from "../../Pipe/highlight-symbol-pipe.pipe";



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatDialogModule, FormsModule, CommonModule, HighlightSymbolPipePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit,AfterViewInit {
  user: User | null = null;
  selectedGroup: string = 'Basic';
  selectedSymbol = 'BINANCE:BTCUSDT';
  symbols: SymbolGroups = {
    Basic: [
      { value: 'BINANCE:BTCUSDT', label: 'Bitcoin (BTC)' },
      { value: 'BINANCE:ETHUSDT', label: 'Ethereum (ETH)' },
      { value: 'BINANCE:SOLUSDT', label: 'Solana (SOL)' },
      { value: 'BINANCE:XRPUSDT', label: 'XRP' },
      { value: 'BINANCE:BNBUSDT', label: 'BNB' },
      { value: 'BINANCE:ADAUSDT', label: 'Cardano (ADA)' },
      { value: 'BINANCE:DOTUSDT', label: 'Polkadot (DOT)' },
      { value: 'BINANCE:AVAXUSDT', label: 'Avalanche (AVAX)' }
    ]
  };
  
  symbolGroupNames: string[] = [];
  isLoggedIn=isLoggedIn;

  constructor(private userService: UserService, private dialog: MatDialog) {
    this.userService.user$.subscribe(u => this.user = u);
  }

  ngOnInit() {
    if (this.user?.settings?.symbols) {
      this.symbols = this.user.settings.symbols;
      this.symbolGroupNames = Object.keys(this.symbols || {});
    }
  }

  ngAfterViewInit(): void {
    this.loadChart();
  }

  onSymbolChange(symbol: string) {
    this.selectedSymbol = symbol;
    this.loadChart();
  }

 onGroupChange(group: string) {
    this.selectedGroup = group;
    const firstSymbol = this.symbols[group]?.[0];
    if (firstSymbol) this.onSymbolChange(firstSymbol.value);
  }

  async addGroup() {
    const dialogRef = this.dialog.open(adList);
    const groupName = await dialogRef.afterClosed().toPromise();
    if (groupName && !this.symbols[groupName]) {
      console.log(groupName);
      this.symbols[groupName] = [];
      this.selectedGroup = groupName;
      this.symbolGroupNames = Object.keys(this.symbols);
      this.saveSymbols();
    }
  }

  async addSymbolToGroup() {
    const dialogRef = this.dialog.open(adSymbol);
    const result = await dialogRef.afterClosed().toPromise();
  
    if (!result) return; 
  
    this.symbols[this.selectedGroup].push({ value: result.value, label: result.label });
    this.saveSymbols();
  }

  deleteGroup(group: string) {
    if (confirm(`Biztos törlöd a(z) '${group}' listát?`)) {
      delete this.symbols[group];
      this.symbolGroupNames = Object.keys(this.symbols);
      if (this.selectedGroup === group) {
        const remainingGroups = Object.keys(this.symbols);
        this.selectedGroup = remainingGroups[0] || '';
        if (this.selectedGroup) {
          const firstSymbol = this.symbols[this.selectedGroup][0];
          if (firstSymbol) this.selectedSymbol = firstSymbol.value;
        }
      }
      this.saveSymbols();
    }
  }

  saveSymbols() {
    if (this.user) {
      this.user.settings.symbols = this.symbols;
      this.userService.save(this.user);
    }
  }

  loadChart() {
    const container = document.getElementById('tradingview-widget');
    if (container) container.innerHTML = '';

    if ((window as any).TradingView) {
      new (window as any).TradingView.widget({
        container_id: 'tradingview-widget',
        width: '100%',
        height: 500,
        symbol: this.selectedSymbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_top_toolbar: false,
        save_image: false,
        withdateranges: true,
      });
    }
  }
}
