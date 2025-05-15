import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  logIn(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
  }

  logOut() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }

  loadUserFromStorage() {
    try{
        const data = localStorage.getItem('user');
        if (data) this.userSubject.next(JSON.parse(data));
    } catch (error) {
        console.error('User Betoltesi hiba:', error);
    }
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  save(user: User){
    localStorage.setItem('user', JSON.stringify(user));
  }
}
