import {Injectable, OnDestroy} from '@angular/core';
import * as _ from 'lodash';
import {Subject} from 'rxjs';
import {ExcelService} from './excel.service';
import {Person} from '../model/person.model';
import {Donation} from '../model/donation.model';
import {Product} from '../model/product.model';
import {Purchase} from '../model/purchase.model';
import {LocalStorageSaveItem} from '../model/local-storage-save-item.model';
import {DonationDisplay} from '../model/donation-display.model';
import {PurchaseDisplay} from '../model/purchase-display.model';
import {COLOR_DEFAULT, TITLE_DEFAULT, Pages} from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements OnDestroy {
  peopleSubject: Subject<Person[]> = new Subject<Person[]>();
  donationsSubject: Subject<Donation[]> = new Subject<Donation[]>();
  productsSubject: Subject<Product[]> = new Subject<Product[]>();
  purchasesSubject: Subject<Purchase[]> = new Subject<Purchase[]>();
  // Emits whenever navigating to Settings, or triggering an export, should
  // dismiss any open overlay (currently just the add bar's panel) — neither
  // is an auction record, so there's nothing there to keep adding to.
  closeOverlaysSubject: Subject<void> = new Subject<void>();
  private _settingsResetSubject: Subject<boolean> = new Subject<boolean>();

  title: string;
  canEdit: boolean;
  exportHasPopup: boolean;
  people: Person[];
  donations: Donation[];
  purchases: Purchase[];
  products: Product[];
  filteredProducts: Product[];
  color: string;

  // this show array controls which page is showed at a time,
  // in the same order as the Pages enum:
  // 1st: Products -> Home
  // 2nd: People
  // 3rd: Purchases
  // 4th: Donations
  // 5th: Settings
  show = [true, false, false, false, false];

  constructor(private excelService: ExcelService) {
    this.readFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.saveToLocalStorage();
  }

  setShow(index: number): void {
    this.show = this.show.map(() => false);
    this.show[index] = true;

    if (index === Pages.Settings) {
      this.closeOverlaysSubject.next();
    }
  }

  setShowWithUrlParam(param: string): void {
    const index = Pages[param];
    this.setShow(index);
  }

  filterProducts(): void {
    this.filteredProducts = [];
    this.products.forEach(item => {
      if (!this.hasDonation(item.id)) {
        this.filteredProducts.push(item);
      }
    });
  }

  hasDonation(productId: number): boolean {
    return !!this.donations.find(x => x.productId === productId);
  }

  hasPurchase(productId: number): boolean {
    return !!this.purchases.find(x => x.productId === productId);
  }

  add(item: any): void {
    if (item instanceof Purchase) {
      item.id = this.getNextId(this.purchases);
      this.purchases.push(item);
      this.purchasesSubject.next(this.purchases);
    } else if (item instanceof Donation) {
      item.id = this.getNextId(this.donations);
      this.donations.push(item);
      this.donationsSubject.next(this.donations);
    } else if (item instanceof Product) {
      item.id = this.getNextId(this.products);
      this.products.push(item);
      this.filterProducts();
      this.productsSubject.next(this.products);
    } else if (item instanceof Person) {
      item.id = this.getNextId(this.people);
      this.people.push(item);
      this.peopleSubject.next(this.people);
    }

    this.saveToLocalStorage();
  }

  public getProductInfoById(id: number): string {
    let info: string = '';

    let product: Product = this.products.find(x => x.id === id);

    if (product) {
      return product.name + ' - ' + product.description;
    }
    return info;
  }

  public getPersonInfoById(id: number): string {
    let info: string = '';

    let person: Person = this.people.find(x => x.id === id);

    if (person) {
      return person.name();
    }
    return info;
  }

  private getNextId(array: any[]): number {
    if (array === null || array === undefined || array.length === 0) {
      return 0;
    } else {
      let id: number = 0;
      array.forEach(item => {
        if (item.id > id) {
          id = item.id;
        }
      });

      return ++id;
    }
  }

  setColor(value: string): void {
    this.color = value;
    this.saveItemToLocalStorage('color', this.color);
    const root = document.documentElement;
    let buttonValue: string = value + 40;
    let backgroundValue: string = value + 80;
    root.style.setProperty('--buttonColor', `var(${buttonValue})`);
    root.style.setProperty('--backgroundColor', `var(${backgroundValue})`);
  }

  applySettings(
    title: string,
    canEdit: boolean,
    exportHasPopup: boolean
  ) {
    this.title = title;
    this.canEdit = canEdit;
    this.exportHasPopup = exportHasPopup;
    this.saveToLocalStorage();
  }

  resetEverything(): void {
    window.localStorage.clear();

    this.title = _.cloneDeep(TITLE_DEFAULT);
    this.setColor(_.cloneDeep(COLOR_DEFAULT));
    this.purchases = [];
    this.people = [];
    this.donations = [];
    this.products = [];

    this.saveToLocalStorage();

    this._settingsResetSubject.next(true);
  }

  public makeExportTitle(value: string): string {
    return this.title + '_' + value;
  }

  public exportAll(): void {
    this.excelService.exportAllToExcel(
      this.makeExportTitle('Auction'),
      this.people,
      this.products,
      this.donations,
      this.purchases,
      this.getPersonInfoById
    );
  }

  public edit(item: any): void {
    if (item instanceof Purchase) {
      const index = this.purchases.findIndex(x => x.id === item.id);
      if (index >= 0) {
        this.purchases[index] = item;
        this.purchasesSubject.next(this.purchases);
      }
    } else if (item instanceof Donation) {
      const index = this.donations.findIndex(x => x.id === item.id);
      if (index >= 0) {
        this.donations[index] = item;
        this.donationsSubject.next(this.donations);
      }
    } else if (item instanceof Product) {
      const index = this.products.findIndex(x => x.id === item.id);
      if (index >= 0) {
        this.products[index] = item;
        this.filterProducts();
        this.productsSubject.next(this.products);
      }
    } else if (item instanceof Person) {
      const index = this.people.findIndex(x => x.id === item.id);
      if (index >= 0) {
        this.people[index] = item;
        this.peopleSubject.next(this.people);
      }
    }

    this.saveToLocalStorage();
  }

  private readFromLocalStorage(): void {
    this.title = this.getItemOrDefault('auction-title', TITLE_DEFAULT);
    this.canEdit = this.getBoolean(this.getItemOrDefault('can-edit', 'false'));
    this.exportHasPopup = this.getBoolean(this.getItemOrDefault('export-has-popup', 'false'));
    this.setColor(this.getItemOrDefault('auction-color', COLOR_DEFAULT));

    this.people = this.getJsonItemArray('people');
    this.donations = this.getJsonItemArray('donations');
    this.products = this.getJsonItemArray('products');
    this.purchases = this.getJsonItemArray('purchases');
    this.filterProducts();

    this.peopleSubject.next(this.people);
    this.donationsSubject.next(this.donations);
    this.purchasesSubject.next(this.purchases);
    this.productsSubject.next(this.products);
  }

  private getBoolean(value): boolean {
    switch (value) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
        return true;
      default:
        return false;
    }
  }

  private isNullOrUndefined(str: string): boolean {
    return str == null || str === 'undefined' || str === 'null';
  }

  private getItemOrDefault(key: string, defaultValue: string): string {
    const item: string = window.localStorage.getItem(key);
    return !this.isNullOrUndefined(item) ? item : _.cloneDeep(defaultValue);
  }

  getJsonItemArray(key: string): any[] {
    const item: string = window.localStorage.getItem(key);
    return !this.isNullOrUndefined(item) ? JSON.parse(item) : [];
  }

  private saveToLocalStorage(): void {
    let items: LocalStorageSaveItem[] = [
      new LocalStorageSaveItem({
        key: 'auction-title',
        value: this.title
      }),
      new LocalStorageSaveItem({
        key: 'auction-color',
        value: this.color
      }),
      new LocalStorageSaveItem({
        key: 'can-edit',
        value: this.canEdit + ''
      }),
      new LocalStorageSaveItem({
        key: 'export-has-popup',
        value: this.exportHasPopup + ''
      }),
      new LocalStorageSaveItem({
        key: 'people',
        value: JSON.stringify(this.people)
      }),
      new LocalStorageSaveItem({
        key: 'donations',
        value: JSON.stringify(this.donations)
      }),
      new LocalStorageSaveItem({
        key: 'products',
        value: JSON.stringify(this.products)
      }),
      new LocalStorageSaveItem({
        key: 'purchases',
        value: JSON.stringify(this.purchases)
      }),
    ];

    items.forEach(item => {
      this.saveItemToLocalStorage(item.key, item.value);
    });
  }

  private saveItemToLocalStorage(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  public getDonationDisplay(donations: Donation[] = this.donations): DonationDisplay[] {
    return DonationDisplay.mapFromDonations(
      donations,
      this.getProductInfoById,
      this.getPersonInfoById
    );
  }

  public getPurchaseDisplay(purchases: Purchase[] = this.purchases): PurchaseDisplay[] {
    return PurchaseDisplay.mapFromPurchase(
      purchases,
      this.getProductInfoById,
      this.getPersonInfoById
    );
  }
}
