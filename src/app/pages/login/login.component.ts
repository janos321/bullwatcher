import { Component, EventEmitter, Output, Input } from '@angular/core';
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from 'firebase/auth';
import {  MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../service/user.service';
import { User, Portfolio } from '../../model/user';
import { FirebaseUserService } from '../../service/UserFirebaseService';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule]
})

export class LoginComponent {
  
  @Input() isLoggedIn: boolean = false;
  @Output() loggedIn = new EventEmitter<User>();

  constructor(
    private userService: UserService,
    private firebaseUserService: FirebaseUserService
  ) {}

  async logInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      let user = await this.firebaseUserService.getUserById(fbUser.uid);
      if(!user){
        const defaultSymbols = {
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

        user = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Névtelen',
          email: fbUser.email || '',
          avatarUrl: fbUser.photoURL || '',
          settings: {
            symbols: defaultSymbols,
            portfolio: {}
          }
        };
        await this.firebaseUserService.createUser(user);
      }

        this.userService.logIn(user);
        this.loggedIn.emit(user);       
        window.location.href = '/home';     
    } catch (error) {
      console.error('Bejelentkezési hiba:', error);
    }
  }


}

export function isLoggedIn(): boolean  {
  return localStorage.getItem('isLoggedIn') === 'true';
}

export async function logOutUser(userService: UserService, firebaseService: FirebaseUserService) {
  const currentUser = userService.getCurrentUser();
  if (currentUser) {
    await firebaseService.updateUser(currentUser);
  }
  const auth = getAuth();
  await signOut(auth);

  userService.logOut();
  window.location.href = '/home';
}
