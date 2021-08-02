import {Injectable, OnDestroy} from '@angular/core';
import * as _ from 'lodash';
import {Observable, Subject} from 'rxjs';
import {ExcelService} from './excel.service';
import {Person} from '../model/person.model';
import {Donation} from '../model/donation.model';
import {Product} from '../model/product.model';
import {Purchase} from '../model/purchase.model';
import {LocalStorageSaveItem} from '../model/local-storage-save-item.model';
import {DonationDisplay} from '../model/donation-display.model';
import {PurchaseDisplay} from '../model/purchase-display.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements OnDestroy {
  private peopleSubject: Subject<Person[]> = new Subject<Person[]>();
  private donationsSubject: Subject<Donation[]> = new Subject<Donation[]>();
  private productsSubject: Subject<Product[]> = new Subject<Product[]>();
  private purchasesSubject: Subject<Purchase[]> = new Subject<Purchase[]>();
  // tslint:disable-next-line:variable-name
  private _settingsResetSubject: Subject<boolean> = new Subject<boolean>();

  title: string;
  canEdit: boolean;
  people: Person[];
  donations: Donation[];
  purchases: Purchase[];
  products: Product[];
  color: string;


  TITLE_DEFAULT = 'Auction Advisor';
  COLOR_DEFAULT = '--blue-color-';

  constructor(private excelService: ExcelService) {
    this.readFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.saveToLocalStorage();
  }

  getPeopleChange(): Observable<Person[]> {
    return this.peopleSubject;
  }

  getDonationsChange(): Observable<Donation[]> {
    return this.donationsSubject;
  }

  getPurchasesChange(): Observable<Purchase[]> {
    return this.purchasesSubject;
  }

  getProductsChange(): Observable<Product[]> {
    return this.productsSubject;
  }

  public addPerson(person: Person): void {
    person.id = this.findHighestId(this.people);
    this.people.push(person);
    this.peopleSubject.next(this.people);
    this.saveToLocalStorage();
  }

  public addDonation(donation: Donation): void {
    donation.id = this.findHighestId(this.donations);
    this.donations.push(donation);
    this.donationsSubject.next(this.donations);
    this.saveToLocalStorage();
  }

  public addProduct(product: Product): void {
    product.id = this.findHighestId(this.products);
    this.products.push(product);
    this.productsSubject.next(this.products);
    this.saveToLocalStorage();
  }

  public addPurchase(purchase: Purchase): void {
    purchase.id = this.findHighestId(this.purchases);
    this.purchases.push(purchase);
    this.purchasesSubject.next(this.purchases);
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
      return person.firstName + ' ' + person.lastName;
    }
    return info;
  }

  private findHighestId(array: any[]): number {
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

  get settingsReset(): Observable<boolean> {
    return this._settingsResetSubject;
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
    canEdit: boolean
  ) {
    this.title = title;
    this.canEdit = canEdit;
    this.saveToLocalStorage();
  }

  //#region Reset Methods
  resetEverything(): void {
    window.localStorage.clear();

    this.title = _.cloneDeep(this.TITLE_DEFAULT);
    this.setColor(_.cloneDeep(this.COLOR_DEFAULT));
    this.purchases = [];
    this.people = [];
    this.donations = [];
    this.products = [];

    this.saveToLocalStorage();

    this._settingsResetSubject.next(true);
  }

  //#endregion

  //#region String Concatenation Methods
  public makeExportTitle(value: string): string {
    return this.title + '_' + value;
  }

  //#endregion

  //#region EXPORT TO EXCEL METHODS
  public exportToExcelByProduct(): void {
    const productName: string = 'Product Name';
    const productDesc: string = 'Product Description';
    const donatedBy: string = 'Donated By';
    const creditTo: string = 'Credit To';
    const purchasedBy: string = 'Purchased By';
    const purchasedAmount: string = 'Purchased Amount';

    let dataArray: any = [];

    this.products.forEach(product => {
      let data: any = {};
      let donation: Donation = this.donations.find(x => x.productId === product.id);
      let purchase: Purchase = this.purchases.find(x => x.productId === product.id);
      data[productName] = product.name;
      data[productDesc] = product.description;
      data[donatedBy] = donation !== undefined ? this.getPersonInfoById(donation.donatedBy) : '';
      data[creditTo] = donation !== undefined ? this.getPersonInfoById(donation.creditTo) : '';
      data[purchasedBy] = purchase !== undefined ? this.getPersonInfoById(purchase.purchasedBy) : '';
      data[purchasedAmount] = purchase.amount;

      dataArray.push(data);
    });

    this.excelService.exportAsExcelFile(dataArray, this.makeExportTitle('ByProduct'));

    // This helped
    // https://medium.com/@madhavmahesh/exporting-an-excel-file-in-angular-927756ac9857
  }

  public exportToExcelByPurchaser(): void {
    const purchaser: string = 'Purchaser';
    const productName: string = 'Product Name';
    const productDescription: string = 'Product Description';
    const amount: string = 'Amount Purchased';
    let dataArray: any = [];

    this.people.forEach(person => {
      const name = this.getPersonInfoById(person.id);

      this.purchases.filter(x => x.purchasedBy === person.id).forEach(purchase => {
        let data: any = {};
        let product: Product = this.products.find(x => x.id === purchase.productId);
        data[purchaser] = name;
        data[productName] = product !== undefined ? product.name : '';
        data[productDescription] = product !== undefined ? product.description : '';
        data[amount] = purchase.amount;

        dataArray.push(data);
      });
    });

    this.excelService.exportAsExcelFile(dataArray, this.makeExportTitle('ByPurchaser'));

    // This helped
    // https://medium.com/@madhavmahesh/exporting-an-excel-file-in-angular-927756ac9857
  }

  public exportToExcelTotals(): void {
    const personTitle: string = 'Person';
    const amountPurchased: string = 'Amount Purchased';
    const itemsPurchasedTitle: string = 'Number Of Items Purchased';
    const itemsCreditedTitle: string = 'Number Of Items Credited';
    const creditTotal: string = 'Amount to Credit Account';
    let dataArray: any = [];

    this.people.forEach(person => {
      const name = this.getPersonInfoById(person.id);
      const purchases = this.purchases.filter(x => x.purchasedBy === person.id);
      const credits = this.donations.filter(x => x.creditTo === person.id)
        .filter(y => this.purchases.findIndex(c => c.productId === y.productId) > -1);
      let totalPurchased: number = 0;
      const itemsPurchased: number = purchases.length;
      const itemsCredited: number = credits.length;
      let totalCredit: number = 0;

      purchases.forEach(purchase => {
        totalPurchased += +purchase.amount;
      });

      credits.forEach(donation => {
        const purchase = this.purchases.find(x => x.productId === donation.productId);
        totalCredit += +purchase.amount;
      });

      let data: any = {};
      data[personTitle] = name;
      data[amountPurchased] = '$' + totalPurchased;
      data[itemsPurchasedTitle] = itemsPurchased;
      data[creditTotal] = '$' + totalCredit;
      data[itemsCreditedTitle] = itemsCredited;

      dataArray.push(data);
    });

    this.excelService.exportAsExcelFile(dataArray, this.makeExportTitle('TotalsByPerson'));

    // This helped
    // https://medium.com/@madhavmahesh/exporting-an-excel-file-in-angular-927756ac9857
  }

  //#endregion

  //#region EDIT TYPES
  public editPurchase(purchase: Purchase): void {
    let index = this.purchases.indexOf(this.purchases.find(x => x.id === purchase.id));
    if (index >= 0) {
      this.purchases[index] = purchase;
    }
    this.saveToLocalStorage();
  }

  public editDonation(donation: Donation): void {
    let index = this.donations.indexOf(this.donations.find(x => x.id === donation.id));
    if (index >= 0) {
      this.donations[index] = donation;
    }
    this.saveToLocalStorage();
  }

  public editProduct(product: Product): void {
    let index = this.products.indexOf(this.products.find(x => x.id === product.id));
    if (index >= 0) {
      this.products[index] = product;
    }
    this.saveToLocalStorage();
  }

  public editPerson(person: Person): void {
    let index = this.people.indexOf(this.people.find(x => x.id === person.id));
    if (index >= 0) {
      this.people[index] = person;
    }
    this.saveToLocalStorage();
  }

  //#endregion

  //#region Get From Local Storage
  private readFromLocalStorage(): void {
    this.title = this.getItemOrDefault('auction-title', this.TITLE_DEFAULT);
    this.canEdit = this.getBoolean(this.getItemOrDefault('can-edit', 'false'));
    this.setColor(this.getItemOrDefault('auction-color', this.COLOR_DEFAULT));

    this.people = this.getJsonItemArray('people');
    this.donations = this.getJsonItemArray('donations');
    this.products = this.getJsonItemArray('products');
    this.purchases = this.getJsonItemArray('purchases');

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
    if (str == null || str === undefined || str === 'undefined' || str === 'null') {
      return true;
    } else {
      return false;
    }
  }

  private getItemOrDefault(key: string, defaultValue: string): string {
    const item: string = window.localStorage.getItem(key);
    return !this.isNullOrUndefined(item) ? item : _.cloneDeep(defaultValue);
  }

  getJsonItemArray(key: string): any[] {
    const item: string = window.localStorage.getItem(key);
    return !this.isNullOrUndefined(item) ? JSON.parse(item) : [];
  }

  //#endregion

  //#region Save to Local Storage
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

  //#endregion

  //#region Mapping Objects to Display Objects
  public mapDonationToDonationDisplay(donation: Donation): DonationDisplay {
    let newItem: DonationDisplay = new DonationDisplay({
      id: donation.id,
      estimatedValue: donation.estimatedValue,
      minSellAmount: donation.minSellAmount,
      productName: this.getProductInfoById(donation.productId),
      donatedByName: this.getPersonInfoById(donation.donatedBy),
      creditToName: this.getPersonInfoById(donation.creditTo),
      creditTo: donation.creditTo,
      donatedBy: donation.donatedBy,
      productId: donation.productId
    });

    return newItem;
  }

  public mapPurchaseToPurchaseDisplay(purchase: Purchase): PurchaseDisplay {
    let newItem: PurchaseDisplay = new PurchaseDisplay({
      id: purchase.id,
      amount: purchase.amount,
      purchasedByName: this.getPersonInfoById(purchase.purchasedBy),
      productName: this.getProductInfoById(purchase.productId),
      productId: purchase.productId,
      purchasedBy: purchase.purchasedBy
    });
    return newItem;
  }

  //#endregion
}
