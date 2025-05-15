import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FirebaseUserService } from '../../service/UserFirebaseService';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: User | null = null;

  constructor(private userService: UserService, private firebaseUserService: FirebaseUserService) {
    this.userService.user$.subscribe(u => this.user = u);
  }

  deleteUser() {
    const confirmed = confirm("Biztosan szeretnéd törölni az accountod?");
    if (confirmed && this.user) {
      this.firebaseUserService.deleteUser(this.user.id)
        .then(() => {
          this.userService.logOut();
          window.location.href = '/home';
        })
        .catch(error => {
          console.error('Hiba a fiók törlésekor:', error);
        });
    }
  }  
  
}
