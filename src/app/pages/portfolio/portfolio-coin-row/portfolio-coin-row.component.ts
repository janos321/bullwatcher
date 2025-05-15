import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-coin-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="coin-row" (click)="handleClick()">
      <div class="coin-amount">{{ amount | number:'1.2-6' }}</div>
      <div class="coin-name">{{ symbol }}</div>
      <div class="coin-value" *ngIf="price">
        {{ (amount * price) | number:'1.2-2' }} USDT
      </div>
      <button class="remove-button" (click)="handleRemove($event)">🗑</button>
    </div>
  `,
  styles: [`
    .coin-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      background: white;
      border-radius: 8px;
      font-size: 1rem;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
      transition: transform 0.2s ease;
      cursor: pointer;
    }

    .coin-row:hover {
      transform: scale(1.02);
      background: #fafafa;
    }

    .coin-amount {
      font-weight: bold;
      font-size: 1.2rem;
      color: #2e7d32;
      flex: 1;
    }

    .coin-name {
      color: #333;
      text-align: center;
      flex: 1;
    }

    .coin-value {
      font-weight: 500;
      color: #444;
      text-align: right;
      flex: 1.5;
    }

    .remove-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: #c62828;
      margin-left: 1rem;
    }

    .remove-button:hover {
      color: #e53935;
    }
  `]
})
export class PortfolioCoinRowComponent {
  @Input() symbol!: string;
  @Input() amount!: number;
  @Input() price!: number;

  @Output() clicked = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  handleClick() {
    this.clicked.emit(this.symbol);
  }

  handleRemove(event: MouseEvent) {
    event.stopPropagation();
    this.remove.emit(this.symbol);
  }
}
