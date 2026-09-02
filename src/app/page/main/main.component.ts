import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { ProductsComponent } from '../products/products.component';
import { PeopleComponent } from '../people/people.component';
import { PurchasesComponent } from '../purchases/purchases.component';
import { DonationsComponent } from '../donations/donations.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ProductsComponent, PeopleComponent, PurchasesComponent, DonationsComponent, SettingsComponent]
})
export class MainComponent {
  constructor(
    public service: SettingsService
  ) { }
}
