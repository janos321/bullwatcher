import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-add-symbol-dialog',
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
    <h3 mat-dialog-title>Szimbólum hozzáadása</h3>
    <mat-dialog-content [formGroup]="symbolForm">
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
          @if (symbolForm.get('symbol')?.errors?.['required']) {
            <div>A szimbólum megadása kötelező.</div>
          }
          @if (symbolForm.get('symbol')?.errors?.['minlength']) {
            <div>Minimum 2 karakter hosszúnak kell lennie.</div>
          }
          @if (symbolForm.get('symbol')?.errors?.['maxlength']) {
            <div>Maximum 10 karakter hosszú lehet.</div>
          }
          @if (symbolForm.get('symbol')?.errors?.['inValid']) {
            <div>Nem létezik ilyen coin a Binance-en.</div>
          }
          @if (symbolForm.get('symbol')?.errors?.['exist']) {
            <div>Ez a szimbolum mar letezik ebben a csoportban.</div>
          }
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Mégse</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="symbolForm.invalid">Hozzáadás</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      padding-top: 1rem;
    }
    .error {
      color: red;
      margin-top: 0.5rem;
    }
    .suggestions {
      margin-top: -1rem;
      padding-left: 0.5rem;
      font-size: 0.95rem;
      color: #444;
    }
    .suggestion-item {
      padding: 0.25rem 0;
      border-bottom: 1px dashed #ccc;
    }

  `]
})
export class adSymbol {
  symbolForm: any;
  private exchangeSymbols: any[] | null = null;
  suggestions: string[] = [];
  user: User | null = null;

  constructor(private userService: UserService, private dialogRef: MatDialogRef<adSymbol>, private fb: FormBuilder) {

      this.userService.user$.subscribe(u => this.user = u);
  

    this.symbolForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]]
    });
    this.symbolForm.get('symbol').valueChanges.subscribe((input: string) => {
      this.updateSuggestions(input);
    });
    
    this.download();
  }

  updateSuggestions(input: string): void {
    if (!input || !this.exchangeSymbols) {
      this.suggestions = [];
      return;
    }
  
    const query = input.toUpperCase();
    this.suggestions = this.exchangeSymbols
      .filter((s: any) => s.symbol.endsWith('USDT') && s.symbol.includes(query))
      .slice(0, 5)
      .map((s: any) => s.symbol.replace('USDT', ''));
  }
  

  async download(){
    try {
      const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
      const data = await response.json();
      this.exchangeSymbols = data.symbols;
    } catch (err) {
      console.error('Nem sikerült lekérni az exchange infót:', err);
    }
  }

  async submit() {
    if (this.symbolForm.invalid) return;

    const rawSymbol = this.symbolForm.value.symbol.trim().toUpperCase();
    const binanceSymbol = `${rawSymbol}USDT`;
    const result = await this.checkSymbolOnBinance(binanceSymbol);

    /*if (this.user?.settings.symbols[this.userService.selectedGroup]?.some(s => s.value === `BINANCE:${binanceSymbol}`)) {
      this.symbolForm.get('symbol')?.setErrors({ exist: true });
      return;
    }*/
    
    if (!result.valid) {
      this.symbolForm.get('symbol')?.setErrors({ inValid: true });
      return;
    }

    const symbolValue = `BINANCE:${binanceSymbol}`;
    const label = result.label!;
    this.dialogRef.close({ value: symbolValue, label });
  }

  async checkSymbolOnBinance(symbol: string): Promise<{ valid: boolean, label?: string }> {
    let match:any;
    if(this.exchangeSymbols){
      match = this.exchangeSymbols.find((s: any) => s.symbol === symbol);
    }
    if (match) {
      const label = `${match.baseAsset} (${match.baseAsset})`;
      return { valid: true, label };
    }
    return { valid: false };
  }
}
