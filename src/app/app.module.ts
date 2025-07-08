import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ExcelService} from './service/excel.service';
import {YesNoDropdownComponent} from './component/yes-no-dropdown/yes-no-dropdown.component';
import {HeaderComponent} from './component/header/header.component';
import {AlertModule} from './component/alert/alert.module';
import {ConfirmationPopupComponent} from './component/confirmation-popup/confirmation-popup.component';
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
import {EditProductComponent} from './component/edit-product/edit-product.component';
import {EditPersonComponent} from './component/edit-person/edit-person.component';
import {EditPurchaseComponent} from './component/edit-purchase/edit-purchase.component';
import {EditDonationComponent} from './component/edit-donation/edit-donation.component';
import {MaterialModule} from './material.module';
import { MainComponent } from './pages/main/main.component';

@NgModule({
  declarations: [
    AddDonationComponent,
    AddPersonComponent,
    AddProductComponent,
    AddPurchaseComponent,
    AppComponent,
    ConfirmationPopupComponent,
    DonationsComponent,
    EditDonationComponent,
    EditPersonComponent,
    EditProductComponent,
    EditPurchaseComponent,
    HeaderComponent,
    MainComponent,
    PeopleComponent,
    ProductsComponent,
    PurchasesComponent,
    SettingsComponent,
    YesNoDropdownComponent
  ],
  entryComponents: [
    ConfirmationPopupComponent,
    EditDonationComponent,
    EditPersonComponent,
    EditProductComponent,
    EditPurchaseComponent,
  ],
  imports: [
    AlertModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    ExcelService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
