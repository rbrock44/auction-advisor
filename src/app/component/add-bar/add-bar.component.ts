import {Component, ChangeDetectionStrategy, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SettingsService} from '../../service/settings.service';
import { MatIcon } from '@angular/material/icon';
import { AddPersonComponent } from '../add-person/add-person.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { AddDonationComponent } from '../add-donation/add-donation.component';
import { AddPurchaseComponent } from '../add-purchase/add-purchase.component';

export type AddType = 'person' | 'product' | 'donation' | 'purchase';

@Component({
    selector: 'app-add-bar',
    templateUrl: './add-bar.component.html',
    styleUrls: ['./add-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon, AddPersonComponent, AddProductComponent, AddDonationComponent, AddPurchaseComponent]
})
export class AddBarComponent implements OnInit, OnDestroy {
  // Person and Product stand on their own. Donation and Purchase both need a
  // product and a person to exist first, which is why the rail splits them.
  readonly records: AddType[] = ['product', 'person'];
  readonly transactions: AddType[] = ['purchase', 'donation'];

  open: AddType = null;

  private readonly titles: Record<AddType, string> = {
    person: 'Person',
    product: 'Product',
    donation: 'Donation',
    purchase: 'Purchase'
  };

  private readonly destroy: Subject<void> = new Subject<void>();

  constructor(public service: SettingsService) {
  }

  ngOnInit(): void {
    // Settings isn't an auction record, and exporting isn't either — leaving
    // the panel open across either would just be pointing at nothing.
    this.service.closeOverlaysSubject
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.close());
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  label(type: AddType): string {
    return this.titles[type];
  }

  get title(): string {
    return this.open ? this.titles[this.open] : '';
  }

  toggle(type: AddType): void {
    this.open = this.open === type ? null : type;
  }

  close(): void {
    this.open = null;
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.close();
  }

  // Donations and purchases can't be saved without something to pick in their
  // dropdowns. Say so up front instead of showing empty menus.
  get setupNote(): string {
    if (this.open !== 'donation' && this.open !== 'purchase') {
      return '';
    }

    const noProducts = !this.service.products || this.service.products.length === 0;
    const noPeople = !this.service.people || this.service.people.length === 0;

    if (noProducts && noPeople) {
      return 'Add a product and a person first. This form needs both.';
    }
    if (noProducts) {
      return 'Add a product first. This form needs one.';
    }
    if (noPeople) {
      return 'Add a person first. This form needs one.';
    }
    return '';
  }
}
