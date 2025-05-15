import { Routes } from '@angular/router';
import { authGuard, logInGuard } from './shared/guards/auth/auth.guard'

export const routes: Routes = [
{ path:'home',
  loadComponent: ()=>import('./pages/home/home.component').then(m=>m.HomeComponent)
},
{ path:'portfolio',
  loadComponent: ()=>import('./pages/portfolio/portfolio.component').then(m=>m.PortfolioComponent),
  canActivate:[authGuard]
},
{ path:'profile',
  loadComponent: ()=>import('./pages/profile/profile.component').then(m=>m.ProfileComponent),
  canActivate:[authGuard]
},
{ path:'login',
  loadComponent: ()=>import('./pages/login/login.component').then(m=>m.LoginComponent),
  canActivate:[logInGuard]
},
{ path:'', redirectTo:'home', pathMatch:'full'},
{ path:'**',
  loadComponent: ()=>import('./pages/home/home.component').then(m=>m.HomeComponent)
}
];
