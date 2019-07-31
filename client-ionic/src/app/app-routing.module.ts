import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, NoPreloading } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'appointments', loadChildren: './pages/appointments/appointments.module#AppointmentsPageModule' },
  { path: 'franchises', loadChildren: './pages/franchises/franchises.module#FranchisesPageModule' },
  { path: 'staff', loadChildren: './pages/users/users.module#UsersPageModule' },
  { path: 'clients', loadChildren: () => import('./pages/clients/clients.module').then( m => m.ClientsPageModule) },
  { path: 'invoices', loadChildren: () => import('./pages/invoices/invoices.module').then( m => m.InvoicesPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
