import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', loadChildren: () => import('./components/signin/signin.module').then( m => m.SigninModule)},
  { path: 'signup', loadChildren: () => import('./components/signUp/signup.module').then( m => m.SignupModule)},
  { path: 'forgotPassword', loadChildren: () => import('./components/forgot-password/forgot-password.module').
      then( m => m.ForgotPasswordModule)},
  {
    path: 'user-home',
    loadChildren: () => import('./components/user-home/user-home.module').then( m => m.UserHomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
