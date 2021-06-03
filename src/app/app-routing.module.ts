import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DonationsComponent} from './page/donations/donations.component';
import {ProductsComponent} from './page/products/products.component';
import {PurchasesComponent} from './page/purchases/purchases.component';
import {PeopleComponent} from './page/people/people.component';
import {SettingsComponent} from './page/settings/settings.component';


const routes: Routes = [
  {
    path: '',
    component: DonationsComponent,
  },
  {
    path: 'donations',
    component: DonationsComponent,
  },
  {
    path: 'people',
    component: PeopleComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'purchases',
    component: PurchasesComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
