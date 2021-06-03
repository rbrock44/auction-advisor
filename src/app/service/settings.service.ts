import {Injectable, OnDestroy} from '@angular/core';
import * as _ from 'lodash';
import {Observable, Subject} from 'rxjs';
import {ExcelService} from './excel.service';
import {Person} from '../model/person.model';
import {Donation} from '../model/donation.model';
import {Product} from '../model/product.model';
import {Purchase} from '../model/purchase.model';
import {LocalStorageSaveItem} from '../model/local-storage-save-item.model';

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
    title: string
  ) {
    this.title = title;

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
  public makeRankingTitle(): string {
    return this.title + ' Rankings';
  }

  //#endregion

  //#region Score Related Methods
  public exportScoresToExcel(): void {
    const name: string = 'Name';
    const total: string = 'Total';
    const round: string = 'Round ';
    let dataArray: any = [];

    let i: number = 0;
    // for (i; i < this.numberOfPlayers; i++) {
    //   let data: any = {};
    //   let x: number = 0;
    //   data[name] = this.getPlayerName(i);
    //   data[total] = this.totals[i];
    //
    // for (x; x < this.scores[i].score.length; x++) {
    //   data[round + (x + 1)] = this.scores[i].score[x];
    // }

    // dataArray.push(data);
    // }

    this.excelService.exportAsExcelFile(dataArray, this.makeRankingTitle());

    // This helped
    // https://medium.com/@madhavmahesh/exporting-an-excel-file-in-angular-927756ac9857
  }

  //#endregion

  //#region Get From Local Storage
  public readLocalStorage(): void {
    this.readFromLocalStorage();
  }

  private readFromLocalStorage(): void {
    this.title = this.getItemOrDefault('title', this.TITLE_DEFAULT);
    this.setColor(this.getItemOrDefault('color', this.COLOR_DEFAULT));

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
        key: 'title',
        value: this.title
      }),
      new LocalStorageSaveItem({
        key: 'title',
        value: this.title
      }),
      new LocalStorageSaveItem({
        key: 'color',
        value: this.color
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
}
