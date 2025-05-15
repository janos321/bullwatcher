import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-add-to-portfolio-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h3 mat-dialog-title>Új tranzakció</h3>

    <mat-dialog-content [formGroup]="symbolForm">
      <div class="type-switch">
        <button class="buy" mat-flat-button color="primary" [class.active]="type === 'buy'" (click)="type = 'buy'">Buy</button>
        <button class="sell" mat-flat-button color="warn" [class.active]="type === 'sell'" (click)="type = 'sell'">Sell</button>
      </div>

      <input
        type="number"
        formControlName="amount"
        class="amount-display amount-input"
        step="0.01"
        min="0"
      />

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Szimbólum (pl: BTC)</mat-label>
        <input matInput formControlName="symbol" />
      </mat-form-field>

      @if (suggestions.length > 0) {
        <div class="suggestions">
          @for (suggestion of suggestions; track suggestion) {
            <div class="suggestion-item">{{ suggestion }}</div>
          }
        </div>
      }

      @if (symbolForm.get('symbol')?.touched && symbolForm.get('symbol')?.invalid) {
        <div class="error">
          @if (symbolForm.get('symbol')?.errors?.['required']) { <div>Kötelező mező.</div> }
          @if (symbolForm.get('symbol')?.errors?.['inValid']) { <div>Érvénytelen coin.</div> }
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Mégse</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="symbolForm.invalid">Hozzáadás</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .amount-input {
      font-size: 2rem;
      text-align: center;
      border: none;
      outline: none;
      width: 100%;
      background: transparent;
    }

    .full-width {
      width: 100%;
    }

    .error {
      color: red;
      margin-top: 0.5rem;
    }

    .suggestions {
      margin-top: -1rem;
      font-size: 0.95rem;
      color: #444;
    }

    .suggestion-item {
      padding: 0.25rem 0;
      border-bottom: 1px dashed #ccc;
    }

    .type-switch {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      margin-top: 1rem;
    }

    .type-switch button.active {
      box-shadow: 0 0 0 2px rgba(192, 27, 27, 0.4);
      border: 1px solid currentColor;
    }

    .buy {
      background: rgb(46, 125, 50);
    }

    .sell {
      background: rgb(207, 15, 15);
    }
  `]
})
export class adtoPortfolio {
  symbolForm: any;
  private exchangeSymbols: any[] | null = null;
  suggestions: string[] = [];
  user: User | null = null;
  type: 'buy' | 'sell' = 'buy';

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<adtoPortfolio>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { prefillSymbol?: string }
  ) {
    this.userService.user$.subscribe(u => this.user = u);

    this.symbolForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      amount: [0, [Validators.required, Validators.min(0.000001)]],
    });

    this.symbolForm.get('symbol').valueChanges.subscribe((input: string) => {
      this.updateSuggestions(input);
    });

    if (data?.prefillSymbol) {
      this.symbolForm.patchValue({ symbol: data.prefillSymbol });
    }

    this.download();
  }

  async download() {
    try {
      const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
      const data = await response.json();
      this.exchangeSymbols = data.symbols;
    } catch (err) {
      console.error('Nem sikerült lekérni a szimbólumokat:', err);
    }
  }

  updateSuggestions(input: string): void {
    if (!input || !this.exchangeSymbols) return;

    const query = input.toUpperCase();
    this.suggestions = this.exchangeSymbols
      .filter((s: any) => s.symbol.endsWith('USDT') && s.symbol.includes(query))
      .slice(0, 5)
      .map((s: any) => s.symbol.replace('USDT', ''));
  }

  async submit() {
    if (this.symbolForm.invalid) return;

    const rawSymbol = this.symbolForm.value.symbol.trim().toUpperCase();
    const binanceSymbol = `${rawSymbol}USDT`;

    const result = await this.checkSymbolOnBinance(binanceSymbol);
    if (!result.valid) {
      this.symbolForm.get('symbol')?.setErrors({ inValid: true });
      return;
    }

    const value = `BINANCE:${binanceSymbol}`;
    const label = result.label!;
    let amount = this.symbolForm.value.amount;
    if (this.type === 'sell') {
      amount *= -1;
    }

    this.dialogRef.close({ value, label, amount });
  }

  async checkSymbolOnBinance(symbol: string): Promise<{ valid: boolean, label?: string }> {
    const match = this.exchangeSymbols?.find((s: any) => s.symbol === symbol);
    if (match) {
      const label = `${match.baseAsset} (${match.baseAsset})`;
      return { valid: true, label };
    }
    return { valid: false };
  }
}
