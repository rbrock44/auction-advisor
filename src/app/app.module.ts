import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ExcelService} from './service/excel.service';
import {YesNoDropdownComponent} from './component/yes-no-dropdown/yes-no-dropdown.component';
import {HeaderComponent} from './component/header/header.component';
import {AlertModule} from './component/alert/alert.module';
import {ConfirmationPopupComponent} from './component/confirmation-popup/confirmation-popup.component';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PurchasesComponent} from './page/purchases/purchases.component';
import {PeopleComponent} from './page/people/people.component';
import {ProductsComponent} from './page/products/products.component';
import {DonationsComponent} from './page/donations/donations.component';
import {AddDonationComponent} from './component/add-donation/add-donation.component';
import {AddPersonComponent} from './component/add-person/add-person.component';
import {AddProductComponent} from './component/add-product/add-product.component';
import {AddPurchaseComponent} from './component/add-purchase/add-purchase.component';
import {SettingsComponent} from './page/settings/settings.component';

@NgModule({
  declarations: [
    AddDonationComponent,
    AddPersonComponent,
    AddProductComponent,
    AddPurchaseComponent,
    AppComponent,
    ConfirmationPopupComponent,
    DonationsComponent,
    HeaderComponent,
    PeopleComponent,
    ProductsComponent,
    PurchasesComponent,
    SettingsComponent,
    YesNoDropdownComponent
  ],
  entryComponents: [ConfirmationPopupComponent],
  imports: [
    AlertModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  providers: [
    ExcelService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
