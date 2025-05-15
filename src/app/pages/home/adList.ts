import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-list-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h3 mat-dialog-title>Lista hozzáadása</h3>
    <mat-dialog-content [formGroup]="listForm">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Lista név</mat-label>
        <input matInput formControlName="listName" />
      </mat-form-field>

      @if (listForm.get('listName')?.touched && listForm.get('listName')?.invalid) {
        <div class="error">
          @if (listForm.get('listName')?.errors?.['required']) {
            <div>A lista név megadása kötelező.</div>
          }
          @if (listForm.get('listName')?.errors?.['minlength']) {
            <div>Minimum 2 karakter hosszúnak kell lennie.</div>
          }
          @if (listForm.get('listName')?.errors?.['maxlength']) {
            <div>Maximum 20 karakter hosszú lehet.</div>
          }
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Mégse</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="listForm.invalid">Hozzáadás</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1.5rem;
      padding-top: 1rem;
    }
    .error {
      color: red;
      margin-top: 0.5rem;
    }
  `]
})
export class adList {
  listForm: any;

  constructor(private dialogRef: MatDialogRef<adList>, private fb: FormBuilder) {
    this.listForm = this.fb.group({
      listName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });
  }

  submit() {
    if (this.listForm.invalid) return;
    const listName = this.listForm.value.listName.trim();
    this.dialogRef.close(listName);
  }
}
