import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from './service/user.service'
import { LoginComponent, logOutUser, isLoggedIn} from './pages/login/login.component';
import { User } from './model/user';
import { FirebaseUserService } from './service/UserFirebaseService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MatSidenavModule,MatToolbarModule,MatIconModule,MatButtonModule,MatSidenav,RouterLink,RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BullWatcher';

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
  }

  constructor(private userService: UserService,private firebaseUserService: FirebaseUserService) {
    this.userService.loadUserFromStorage();
  }  

  isLoggedIn = isLoggedIn;

  handleLogin(user: User) {
    window.location.href = '/home';
  }

  logOut() {
    logOutUser(this.userService,this.firebaseUserService);
  }

}
