import {Injectable, OnDestroy} from '@angular/core';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import {Subject} from 'rxjs';
import {Location} from '@angular/common';
import {ExcelService, ExcelSheet} from './excel.service';
import {Person} from '../model/person.model';
import {Donation} from '../model/donation.model';
import {Product} from '../model/product.model';
import {Purchase} from '../model/purchase.model';
import {LocalStorageSaveItem} from '../model/local-storage-save-item.model';
import {DonationDisplay} from '../model/donation-display.model';
import {PurchaseDisplay} from '../model/purchase-display.model';
import {AuctionBackup, BACKUP_VERSION} from '../model/auction-backup.model';
import {AuctionHistoryEntry, AuctionSummary} from '../model/auction-history.model';
import {
  BACKUP_EXTENSION,
  BACKUP_TYPE,
  COLOR_DEFAULT,
  SHARE_AUCTION_BROKEN_MESSAGE,
  TITLE_DEFAULT,
  Pages
} from '../constants/constants';

// Query param that carries a shared auction. Its value starts with a format tag:
// "z" = deflate-compressed JSON, "j" = plain JSON (browsers without CompressionStream).
export const SHARE_PARAM = 'auction';
const HISTORY_KEY = 'history';
// Oldest auctions drop off past this, so history can't fill up localStorage.
const HISTORY_LIMIT = 100;

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
  // 6th: History
  show = [true, false, false, false, false, false];

  constructor(
    private excelService: ExcelService,
    private location: Location,
  ) {
    this.readFromLocalStorage();
    // Browser/mouse back and forward land here; show whichever page the URL now names.
    this.location.subscribe(() => this.setShow(this.readPageFromUrl() ?? Pages.Products));
  }

  ngOnDestroy(): void {
    this.saveToLocalStorage();
  }

  setShow(index: number): void {
    this.show = this.show.map(() => false);
    this.show[index] = true;

    if (index === Pages.Settings || index === Pages.History) {
      this.closeOverlaysSubject.next();
    }
  }

  setShowWithUrlParam(param: string): void {
    const index = Pages[param];
    this.setShow(index);
  }

  /** Shows a page as a new history entry so browser/mouse back returns to the previous page. */
  navigateTo(index: number): void {
    if (this.show[index]) {
      return;
    }

    this.setShow(index);
    this.location.go(this.buildPageUrl(index));
  }

  /**
   * Shows the page named in the URL on load. A Products entry is slotted in underneath a deep
   * link so browser/mouse back lands on Products instead of leaving the site.
   */
  restorePageFromUrl(): void {
    const index = this.readPageFromUrl();
    if (index === null || index === Pages.Products) {
      return;
    }

    this.location.replaceState(this.buildPageUrl(Pages.Products));
    this.navigateTo(index);
  }

  private readPageFromUrl(): number | null {
    const query = this.location.path().split('?')[1] ?? '';
    const index = Pages[new URLSearchParams(query).get('page') as keyof typeof Pages];
    return index === undefined ? null : index;
  }

  private buildPageUrl(index: number): string {
    if (index === Pages.Products) {
      return `${location.pathname}`;
    }

    const queryParams = new URLSearchParams();
    queryParams.set('page', Pages[index]);
    return `${location.pathname}?${queryParams.toString()}`;
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
    // History is an archive of past auctions, not a setting, so it survives a full reset.
    const history: string = window.localStorage.getItem(HISTORY_KEY);
    window.localStorage.clear();
    if (history !== null) {
      window.localStorage.setItem(HISTORY_KEY, history);
    }

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

  // The whole auction lives in localStorage, which a cleared browser or a
  // closed private window takes with it. This is the only way a night's
  // records leave the device they were entered on.
  public exportBackup(): void {
    const backup: AuctionBackup = this.buildBackup();

    const blob: Blob = new Blob([JSON.stringify(backup, null, 2)], {type: BACKUP_TYPE});

    FileSaver.saveAs(blob, this.makeExportTitle('Backup') + '_' + new Date().getTime() + BACKUP_EXTENSION);
  }

  public buildBackup(): AuctionBackup {
    return {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      title: this.title,
      color: this.color,
      canEdit: this.canEdit,
      exportHasPopup: this.exportHasPopup,
      people: this.people,
      products: this.products,
      donations: this.donations,
      purchases: this.purchases
    };
  }

  // Reports failure instead of throwing so the caller can raise the app's own
  // error alert. A rejected file leaves the running auction exactly as it was.
  public importBackup(contents: string): boolean {
    const parsed: AuctionBackup | null = this.parseBackup(contents);

    if (!parsed) {
      return false;
    }

    this.applyBackup(parsed);
    return true;
  }

  public parseBackup(contents: string): AuctionBackup | null {
    let parsed: unknown;

    try {
      parsed = JSON.parse(contents);
    } catch {
      return null;
    }

    return this.isAuctionBackup(parsed) ? parsed : null;
  }

  // Shared by file restore, share links, and History, so all three overwrite
  // the running auction the same way.
  public applyBackup(parsed: AuctionBackup): void {
    this.title = parsed.title;
    this.canEdit = parsed.canEdit;
    this.exportHasPopup = parsed.exportHasPopup;
    // Rebuilt as model instances, not the raw parsed objects, so behaviour
    // like Person.name() survives the restore.
    this.people = parsed.people.map(item => new Person(item));
    this.products = parsed.products.map(item => new Product(item));
    this.donations = parsed.donations.map(item => new Donation(item));
    this.purchases = parsed.purchases.map(item => new Purchase(item));

    this.setColor(parsed.color);
    this.filterProducts();
    this.saveToLocalStorage();

    this.peopleSubject.next(this.people);
    this.productsSubject.next(this.products);
    this.donationsSubject.next(this.donations);
    this.purchasesSubject.next(this.purchases);
  }

  // Checked before anything is overwritten: a half-applied backup would be
  // worse than a refused one.
  private isAuctionBackup(value: unknown): value is AuctionBackup {
    if (value === null || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Partial<AuctionBackup>;

    return typeof candidate.version === 'number'
      && candidate.version <= BACKUP_VERSION
      && typeof candidate.title === 'string'
      && typeof candidate.color === 'string'
      && typeof candidate.canEdit === 'boolean'
      && typeof candidate.exportHasPopup === 'boolean'
      && Array.isArray(candidate.people)
      && Array.isArray(candidate.products)
      && Array.isArray(candidate.donations)
      && Array.isArray(candidate.purchases);
  }

  //#region Auction History
  /** Saves the current auction to history (if anything was recorded) and starts over with the same settings and people. */
  public startNewAuction(): boolean {
    const saved: boolean = this.saveCurrentAuctionToHistory();

    // People tend to come back for the next auction; the lots and what
    // happened to them belong to this one only.
    this.products = [];
    this.donations = [];
    this.purchases = [];
    this.filterProducts();
    this.saveToLocalStorage();

    this.productsSubject.next(this.products);
    this.donationsSubject.next(this.donations);
    this.purchasesSubject.next(this.purchases);

    return saved;
  }

  public saveCurrentAuctionToHistory(): boolean {
    if (!this.hasAnyRecord()) {
      return false;
    }

    const entry: AuctionHistoryEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      savedAt: new Date().toISOString(),
      // Round-tripped so later edits to the live arrays can't reach into the saved copy.
      auction: JSON.parse(JSON.stringify(this.buildBackup()))
    };
    this.writeHistory([entry, ...this.getHistory()]);
    return true;
  }

  /** Newest first. */
  public getHistory(): AuctionHistoryEntry[] {
    const stored: string = window.localStorage.getItem(HISTORY_KEY);
    if (this.isNullOrUndefined(stored)) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(stored);
      return Array.isArray(parsed)
        ? parsed.filter((entry: AuctionHistoryEntry) => entry && typeof entry.id === 'string' && this.isAuctionBackup(entry.auction))
        : [];
    } catch {
      return [];
    }
  }

  public deleteHistoryEntry(id: string): void {
    this.writeHistory(this.getHistory().filter(entry => entry.id !== id));
  }

  public getAuctionSummary(auction: AuctionBackup): AuctionSummary {
    return {
      people: auction.people.length,
      products: auction.products.length,
      donations: auction.donations.length,
      purchases: auction.purchases.length,
      totalRaised: auction.purchases.reduce((total, purchase) => total + (+purchase.amount || 0), 0)
    };
  }

  /** Every saved auction in one workbook: a Summary sheet, then one By Product sheet per auction. */
  public exportHistoryToExcel(): void {
    const history: AuctionHistoryEntry[] = this.getHistory();
    const summary: any[] = history.map(entry => {
      const totals: AuctionSummary = this.getAuctionSummary(entry.auction);
      return {
        'Auction': entry.auction.title,
        'Saved': new Date(entry.savedAt).toLocaleString(),
        'Total Raised': '$' + totals.totalRaised,
        'Products': totals.products,
        'Purchases': totals.purchases,
        'Donations': totals.donations,
        'People': totals.people
      };
    });

    const sheets: ExcelSheet[] = [
      {name: 'Summary', rows: summary},
      ...history.map(entry => ({
        name: `${entry.auction.title} ${new Date(entry.savedAt).toLocaleDateString()}`,
        rows: this.excelService.buildByProductRows(
          entry.auction.products,
          entry.auction.donations,
          entry.auction.purchases,
          this.makePersonInfo(entry.auction.people)
        )
      }))
    ];

    this.excelService.exportAsExcelWorkbook(sheets, this.makeExportTitle('History'));
  }

  // A saved auction's ids point at its own people, not the running auction's.
  private makePersonInfo(people: Person[]): (id: number) => string {
    return (id: number) => {
      const person: Person = people.find(x => x.id === id);
      return person ? new Person(person).name() : '';
    };
  }

  private hasAnyRecord(): boolean {
    return this.products.length > 0 || this.donations.length > 0 || this.purchases.length > 0;
  }

  private writeHistory(history: AuctionHistoryEntry[]): void {
    let entries: AuctionHistoryEntry[] = history.slice(0, HISTORY_LIMIT);
    // A full localStorage drops the oldest auctions until the rest fit.
    while (entries.length > 0) {
      try {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
        return;
      } catch {
        entries = entries.slice(0, -1);
      }
    }
    window.localStorage.removeItem(HISTORY_KEY);
  }

  //#endregion

  //#region Share Link
  // Builds a link holding the whole auction, so it can be picked up on another device. The site
  // is static, so the state rides in the URL instead of on a server.
  public async buildShareUrl(auction: AuctionBackup = this.buildBackup()): Promise<string> {
    const encoded: string = await this.encodeShareValue(JSON.stringify(auction));
    const params = new URLSearchParams();
    params.set(SHARE_PARAM, encoded);
    return `${location.origin}${location.pathname}?${params.toString()}`;
  }

  /**
   * Native share sheet on phones (text it, AirDrop it); clipboard copy everywhere else.
   * Throws if neither works.
   */
  public async shareAuctionLink(auction: AuctionBackup = this.buildBackup()): Promise<'shared' | 'copied' | 'cancelled'> {
    const url: string = await this.buildShareUrl(auction);

    if (navigator.share) {
      try {
        await navigator.share({title: auction.title || TITLE_DEFAULT, url});
        return 'shared';
      } catch (error) {
        if ((error as DOMException)?.name === 'AbortError') {
          return 'cancelled';
        }
      }
    }

    await navigator.clipboard.writeText(url);
    return 'copied';
  }

  /** The shared-auction value in the current URL, if this visit came from a share link. */
  public readSharedAuctionFromUrl(): string | null {
    const query = this.location.path().split('?')[1] ?? '';
    return new URLSearchParams(query).get(SHARE_PARAM);
  }

  /** Drops the shared auction from the URL so a reload or bookmark doesn't offer it again. */
  public clearSharedAuctionFromUrl(): void {
    const [path, query = ''] = this.location.path().split('?');
    const params = new URLSearchParams(query);
    params.delete(SHARE_PARAM);
    const rest = params.toString();
    this.location.replaceState(rest ? `${path || '/'}?${rest}` : (path || '/'));
  }

  /** Throws with a message fit to show directly if the link doesn't hold an auction. */
  public async parseShareValue(value: string): Promise<AuctionBackup> {
    let json: string;
    try {
      json = await this.decodeShareValue(value);
    } catch {
      throw new Error(SHARE_AUCTION_BROKEN_MESSAGE);
    }

    const parsed: AuctionBackup | null = this.parseBackup(json);
    if (!parsed) {
      throw new Error(SHARE_AUCTION_BROKEN_MESSAGE);
    }
    return parsed;
  }

  private async encodeShareValue(json: string): Promise<string> {
    const bytes: Uint8Array = new TextEncoder().encode(json);
    if (typeof CompressionStream === 'undefined') {
      return 'j' + this.toBase64Url(bytes);
    }
    const compressed = await this.pipeBytes(bytes, new CompressionStream('deflate-raw'));
    return 'z' + this.toBase64Url(compressed);
  }

  private async decodeShareValue(value: string): Promise<string> {
    const tag: string = value.charAt(0);
    const bytes: Uint8Array = this.fromBase64Url(value.slice(1));
    if (tag === 'j') {
      return new TextDecoder().decode(bytes);
    }
    if (tag === 'z' && typeof DecompressionStream !== 'undefined') {
      return new TextDecoder().decode(await this.pipeBytes(bytes, new DecompressionStream('deflate-raw')));
    }
    throw new Error('Unsupported share format');
  }

  private async pipeBytes(bytes: Uint8Array, transform: CompressionStream | DecompressionStream): Promise<Uint8Array> {
    const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(transform);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  private toBase64Url(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private fromBase64Url(value: string): Uint8Array {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64 + '='.repeat((4 - base64.length % 4) % 4));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  //#endregion

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
