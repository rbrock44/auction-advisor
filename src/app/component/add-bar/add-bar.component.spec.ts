import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddBarComponent} from './add-bar.component';
import {AddDonationComponent} from '../add-donation/add-donation.component';
import {AddPersonComponent} from '../add-person/add-person.component';
import {AddProductComponent} from '../add-product/add-product.component';
import {AddPurchaseComponent} from '../add-purchase/add-purchase.component';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {ExcelService} from '../../service/excel.service';
import {
  clickElement,
  expectElementAbsent,
  expectElementPresent,
  expectElementToContainContent,
  expectElementToContainContentAtIndex
} from '../../constants/expectations.spec';
import {PEOPLE_OPTIONS, PRODUCT_OPTIONS} from '../../constants/constants.spec';

describe('AddBarComponent', () => {
  let fixture: ComponentFixture<AddBarComponent>;
  let component;
  let settingsService: SettingsService;

  const PANEL = '#add-panel';
  const TITLE = '[data-add-title]';
  const CLOSE = '[data-add-close]';
  const NOTE = '[data-add-note]';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        CommonModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AddBarComponent,
        AddDonationComponent,
        AddPersonComponent,
        AddProductComponent,
        AddPurchaseComponent
    ],
    providers: [
        AlertService,
        SettingsService,
        ExcelService
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    settingsService = TestBed.inject(SettingsService);
    settingsService.people = PEOPLE_OPTIONS;
    settingsService.products = PRODUCT_OPTIONS;
    settingsService.filteredProducts = PRODUCT_OPTIONS;
    fixture = TestBed.createComponent(AddBarComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an add button for each type', () => {
    const types = ['Product', 'Person', 'Purchase', 'Donation'];

    types.forEach((type, index) => {
      expectElementToContainContentAtIndex(fixture, '.type__label', type, index);
    });
  });

  it('should start with no panel open', () => {
    expectElementAbsent(fixture, PANEL);
  });

  ['person', 'product', 'donation', 'purchase'].forEach(type => {
    it(`should open the ${type} panel`, () => {
      clickElement(fixture, `[data-add="${type}"]`);
      fixture.detectChanges();

      expectElementPresent(fixture, PANEL);
      expectElementPresent(fixture, `app-add-${type}`);
      expect(component.open).toEqual(type);
    });
  });

  it('should title the panel with the record type', () => {
    clickElement(fixture, '[data-add="donation"]');
    fixture.detectChanges();

    expectElementToContainContent(fixture, TITLE, 'Donation');
  });

  it('should swap forms when another type is picked', () => {
    clickElement(fixture, '[data-add="person"]');
    fixture.detectChanges();
    expectElementPresent(fixture, 'app-add-person');

    clickElement(fixture, '[data-add="purchase"]');
    fixture.detectChanges();

    expectElementAbsent(fixture, 'app-add-person');
    expectElementPresent(fixture, 'app-add-purchase');
  });

  it('should close the panel from the close button', () => {
    clickElement(fixture, '[data-add="product"]');
    fixture.detectChanges();
    expectElementPresent(fixture, PANEL);

    clickElement(fixture, CLOSE);
    fixture.detectChanges();

    expectElementAbsent(fixture, PANEL);
    expect(component.open).toBeNull();
  });

  it('should close the panel when the same type is picked again', () => {
    clickElement(fixture, '[data-add="person"]');
    fixture.detectChanges();
    expectElementPresent(fixture, PANEL);

    clickElement(fixture, '[data-add="person"]');
    fixture.detectChanges();

    expectElementAbsent(fixture, PANEL);
  });

  it('should embed the form with its own title suppressed', () => {
    clickElement(fixture, '[data-add="person"]');
    fixture.detectChanges();

    expectElementPresent(fixture, '.is-embedded');
    expectElementPresent(fixture, '[data-person-input]');
  });

  describe('navigating away', () => {
    beforeEach(() => {
      clickElement(fixture, '[data-add="person"]');
      fixture.detectChanges();
      expectElementPresent(fixture, PANEL);
    });

    it('should close the panel when Settings is opened', () => {
      settingsService.setShow(4);
      fixture.detectChanges();

      expectElementAbsent(fixture, PANEL);
      expect(component.open).toBeNull();
    });

    it('should close the panel when anything asks the overlays to close, e.g. an export', () => {
      settingsService.closeOverlaysSubject.next();
      fixture.detectChanges();

      expectElementAbsent(fixture, PANEL);
      expect(component.open).toBeNull();
    });

    it('should leave the panel open when switching between views', () => {
      settingsService.setShow(1);
      fixture.detectChanges();

      expectElementPresent(fixture, PANEL);
      expect(component.open).toEqual('person');
    });
  });

  describe('setup note', () => {
    it('should stay hidden when products and people exist', () => {
      clickElement(fixture, '[data-add="donation"]');
      fixture.detectChanges();

      expectElementAbsent(fixture, NOTE);
    });

    it('should stay hidden for records that need nothing first', () => {
      settingsService.products = [];
      settingsService.people = [];

      clickElement(fixture, '[data-add="person"]');
      fixture.detectChanges();

      expectElementAbsent(fixture, NOTE);
    });

    it('should ask for a product when none exist', () => {
      settingsService.products = [];

      clickElement(fixture, '[data-add="purchase"]');
      fixture.detectChanges();

      expectElementToContainContent(fixture, NOTE, 'Add a product first.');
    });

    it('should ask for a person when none exist', () => {
      settingsService.people = [];

      clickElement(fixture, '[data-add="donation"]');
      fixture.detectChanges();

      expectElementToContainContent(fixture, NOTE, 'Add a person first.');
    });

    it('should ask for both when neither exist', () => {
      settingsService.products = [];
      settingsService.people = [];

      clickElement(fixture, '[data-add="donation"]');
      fixture.detectChanges();

      expectElementToContainContent(fixture, NOTE, 'Add a product and a person first.');
    });
  });
});
