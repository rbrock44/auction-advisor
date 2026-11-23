import {TestBed} from '@angular/core/testing';
import {SettingsService} from './settings.service';
import {ExcelService} from './excel.service';
import {Person} from '../model/person.model';
import {Purchase} from '../model/purchase.model';
import {Product} from '../model/product.model';
import {Pages} from '../constants/constants';
import {Location} from '@angular/common';
import {provideLocationMocks} from '@angular/common/testing';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingsService,
        ExcelService
      ]
    });

    service = TestBed.inject(SettingsService);
    // Start each test from a clean slate regardless of what earlier
    // tests (or a stale localStorage) may have left behind.
    service.people = [];
    service.purchases = [];
  });

  afterEach(() => {
    // add()/edit() write through to the real browser localStorage, and
    // Karma reuses a single browser session across every spec file in the
    // run. Leaving Person/Purchase JSON behind here would leak into later
    // suites (e.g. component specs that construct SettingsService and read
    // it back as plain JSON, losing prototype methods like Person.name()).
    window.localStorage.clear();
  });

  describe('add()', () => {
    it('adds a Person and pushes it into the people array', () => {
      const person = new Person({firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com'});

      service.add(person);

      expect(service.people.length).toBe(1);
      expect(service.people[0].firstName).toBe('Jane');
      expect(service.people[0].id).toBe(0);
    });

    it('adds a Purchase and pushes it into the purchases array (not people)', () => {
      const purchase = new Purchase({purchasedBy: 1, productId: 2, amount: 25});

      service.add(purchase);

      expect(service.purchases.length).toBe(1);
      expect(service.purchases[0].amount).toBe(25);
      expect(service.people.length).toBe(0);
    });
  });

  describe('edit()', () => {
    it('updates the matching Person in place by id', () => {
      const person = new Person({firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com'});
      service.add(person);
      const addedId = service.people[0].id;

      const edited = new Person({id: addedId, firstName: 'Janet', lastName: 'Doe', email: 'janet@example.com'});
      service.edit(edited);

      expect(service.people.length).toBe(1);
      expect(service.people[0].firstName).toBe('Janet');
    });
  });
});

describe('SettingsService page history', () => {
  let service: SettingsService;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService, ExcelService, provideLocationMocks()]
    });
    service = TestBed.inject(SettingsService);
    location = TestBed.inject(Location);
  });

  it('should push a history entry when navigating to a page', () => {
    service.navigateTo(Pages.People);
    expect(service.show[Pages.People]).toBe(true);
    expect(location.path()).toContain('page=People');
  });

  it('should return to the previous page when the browser goes back', () => {
    service.navigateTo(Pages.People);
    service.navigateTo(Pages.Donations);
    location.back();
    expect(service.show[Pages.People]).toBe(true);
    expect(service.show[Pages.Donations]).toBe(false);
  });

  it('should not push a duplicate entry for the page already shown', () => {
    service.navigateTo(Pages.People);
    service.navigateTo(Pages.People);
    location.back();
    expect(service.show[Pages.Products]).toBe(true);
  });

  it('should restore a deep-linked page with Products underneath', () => {
    location.replaceState('/?page=Purchases');
    service.restorePageFromUrl();
    expect(service.show[Pages.Purchases]).toBe(true);

    location.back();
    expect(service.show[Pages.Products]).toBe(true);
  });
});

describe('SettingsService share link', () => {
  let service: SettingsService;
  let location: Location;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({
      providers: [SettingsService, ExcelService, provideLocationMocks()]
    });
    service = TestBed.inject(SettingsService);
    location = TestBed.inject(Location);
  });

  afterEach(() => window.localStorage.clear());

  it('should round-trip the auction through a share link', async () => {
    service.add(new Person({firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com'}));
    service.add(new Product({name: 'Quilt', description: 'Handmade'}));
    service.add(new Purchase({purchasedBy: 0, productId: 0, amount: 120}));
    const url = new URL(await service.buildShareUrl());
    const value = url.searchParams.get('auction');

    const auction = await service.parseShareValue(value);
    expect(auction.people[0].firstName).toBe('Jane');
    expect(auction.products[0].name).toBe('Quilt');
    expect(auction.purchases[0].amount).toBe(120);
    expect(auction.title).toBe(service.title);
  });

  // This jasmine's typings predate toBeRejectedWithError, so the message is checked by hand.
  async function rejectionMessage(value: string): Promise<string> {
    try {
      await service.parseShareValue(value);
      return '';
    } catch (error) {
      return (error as Error).message;
    }
  }

  it('should reject a broken share link', async () => {
    expect(await rejectionMessage('zNotReal')).toMatch(/broken/);
  });

  it('should reject a link that decodes to something other than an auction', async () => {
    const value = 'j' + btoa(JSON.stringify({hello: 'world'})).replace(/=+$/, '');
    expect(await rejectionMessage(value)).toMatch(/broken/);
  });

  it('should strip the shared auction from the url but keep the page', () => {
    location.replaceState('/?page=Settings&auction=zabc');
    expect(service.readSharedAuctionFromUrl()).toBe('zabc');
    service.clearSharedAuctionFromUrl();
    expect(location.path()).toBe('/?page=Settings');
    expect(service.readSharedAuctionFromUrl()).toBeNull();
  });
});

describe('SettingsService auction history', () => {
  let service: SettingsService;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({
      providers: [SettingsService, ExcelService, provideLocationMocks()]
    });
    service = TestBed.inject(SettingsService);
  });

  afterEach(() => window.localStorage.clear());

  function recordSale(name: string, amount: number): void {
    service.add(new Product({name, description: 'desc'}));
    const productId = service.products[service.products.length - 1].id;
    service.add(new Purchase({purchasedBy: 0, productId, amount}));
  }

  it('should save the auction to history and clear its records on new auction', () => {
    service.add(new Person({firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com'}));
    recordSale('Quilt', 120);

    expect(service.startNewAuction()).toBe(true);

    const history = service.getHistory();
    expect(history.length).toBe(1);
    expect(history[0].auction.products[0].name).toBe('Quilt');
    expect(service.products.length).toBe(0);
    expect(service.purchases.length).toBe(0);
    expect(service.donations.length).toBe(0);
    expect(service.people.length).toBe(1);
  });

  it('should not save an auction with nothing recorded', () => {
    service.add(new Person({firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com'}));

    expect(service.startNewAuction()).toBe(false);
    expect(service.getHistory().length).toBe(0);
  });

  it('should total what each saved auction raised', () => {
    recordSale('Quilt', 120);
    recordSale('Pie', 30);

    const summary = service.getAuctionSummary(service.buildBackup());
    expect(summary.totalRaised).toBe(150);
    expect(summary.products).toBe(2);
    expect(summary.purchases).toBe(2);
  });

  it('should keep newest first, delete entries, and survive reset everything', () => {
    recordSale('First', 1);
    service.startNewAuction();
    recordSale('Second', 2);
    service.startNewAuction();

    let history = service.getHistory();
    expect(history.map(entry => entry.auction.products[0].name)).toEqual(['Second', 'First']);

    service.resetEverything();
    history = service.getHistory();
    expect(history.length).toBe(2);

    service.deleteHistoryEntry(history[0].id);
    expect(service.getHistory().map(entry => entry.auction.products[0].name)).toEqual(['First']);
  });

  it('should load a saved auction back as model instances', () => {
    service.add(new Person({firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com'}));
    recordSale('Quilt', 120);
    service.startNewAuction();

    service.applyBackup(service.getHistory()[0].auction);

    expect(service.products[0].name).toBe('Quilt');
    expect(service.people[0].name()).toBe('Jane Doe');
  });
});

describe('SettingsService history export', () => {
  let service: SettingsService;
  let excel: ExcelService;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({
      providers: [SettingsService, ExcelService, provideLocationMocks()]
    });
    service = TestBed.inject(SettingsService);
    excel = TestBed.inject(ExcelService);
  });

  afterEach(() => window.localStorage.clear());

  it('should export a summary sheet plus one sheet per saved auction', () => {
    const spy = spyOn(excel, 'exportAsExcelWorkbook');
    service.add(new Person({firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com'}));
    service.add(new Product({name: 'Quilt', description: 'Handmade'}));
    service.add(new Purchase({purchasedBy: 0, productId: 0, amount: 120}));
    service.startNewAuction();

    service.exportHistoryToExcel();

    const sheets = spy.calls.mostRecent().args[0];
    expect(sheets.length).toBe(2);
    expect(sheets[0].name).toBe('Summary');
    expect(sheets[0].rows[0]['Total Raised']).toBe('$120');
    expect(sheets[0].rows[0]['Purchases']).toBe(1);
    expect(sheets[1].rows[0]['Product Name']).toBe('Quilt');
    expect(sheets[1].rows[0]['Purchased By']).toBe('Jane Doe');
  });
});
