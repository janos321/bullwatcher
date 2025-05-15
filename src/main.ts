/*import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));*/

  import { bootstrapApplication } from '@angular/platform-browser';
  import { AppComponent } from './app/app.component';
  import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
  import { provideAuth, getAuth } from '@angular/fire/auth';
  import { environment } from './environments/environment';
  import { provideRouter } from '@angular/router';
  import { routes } from './app/app.routes';
  import { provideFirestore, getFirestore } from '@angular/fire/firestore';
  
  bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore())
    ]
  }).catch(err => console.error(err));
  
  
