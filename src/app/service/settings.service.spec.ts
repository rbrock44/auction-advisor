import {TestBed} from '@angular/core/testing';
import {SettingsService} from './settings.service';
import {ExcelService} from './excel.service';
import {Person} from '../model/person.model';
import {Purchase} from '../model/purchase.model';

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
