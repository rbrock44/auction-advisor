import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialog} from '@angular/material/dialog';
import {HistoryComponent} from './history.component';
import {SettingsService} from '../../service/settings.service';
import {Product} from '../../model/product.model';
import {Purchase} from '../../model/purchase.model';
import {expectElementAbsent, expectElementPresent, expectElementToContainContent} from '../../constants/expectations.spec';
import {HEADER} from '../../constants/constants.spec';

describe('HistoryComponent', () => {
  let fixture: ComponentFixture<HistoryComponent>;
  let component: HistoryComponent;
  let settingsService: SettingsService;
  let dialog: MatDialog;

  beforeEach(waitForAsync(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, HistoryComponent]
    }).compileComponents();

    settingsService = TestBed.inject(SettingsService);
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => window.localStorage.clear());

  function saveAuction(): void {
    settingsService.products = [];
    settingsService.purchases = [];
    settingsService.add(new Product({name: 'Quilt', description: 'Handmade'}));
    settingsService.add(new Purchase({purchasedBy: 0, productId: 0, amount: 120}));
    settingsService.startNewAuction();
  }

  it('should contain a title', () => {
    fixture.detectChanges();
    expectElementToContainContent(fixture, HEADER, 'History');
  });

  it('should say so when nothing is saved', () => {
    fixture.detectChanges();
    expectElementPresent(fixture, '[data-history-empty]');
    expectElementAbsent(fixture, '[data-button-export-all-history]');
  });

  it('should list a saved auction with what it raised', () => {
    saveAuction();
    fixture.detectChanges();

    expectElementPresent(fixture, '[data-history-entry]');
    expectElementToContainContent(fixture, '[data-history-raised]', '$120');
    expectElementPresent(fixture, '[data-button-export-all-history]');
  });

  it('should delete a saved auction once confirmed', () => {
    saveAuction();
    fixture.detectChanges();
    spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(true)} as any);

    component.remove(component.rows[0].entry);
    fixture.detectChanges();

    expect(settingsService.getHistory().length).toBe(0);
    expectElementPresent(fixture, '[data-history-empty]');
  });
});
