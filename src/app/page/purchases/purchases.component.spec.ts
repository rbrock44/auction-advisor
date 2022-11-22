import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PurchasesComponent} from './purchases.component';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {AddPersonComponent} from '../../component/add-person/add-person.component';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {ExcelService} from '../../service/excel.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AddPurchaseComponent} from '../../component/add-purchase/add-purchase.component';
import {AddProductComponent} from '../../component/add-product/add-product.component';
import {EditPurchaseComponent} from '../../component/edit-purchase/edit-purchase.component';
import {clickElement, expectElementToContainContentAtIndex, expectHeaderText} from '../../constants/expectations.spec';
import {PURCHASE_DISPLAY_OPTIONS, PURCHASE_OPTIONS} from '../../constants/constants.spec';
import {EDIT_HEADER, ID_HEADER} from '../../constants/constants';
import Spy = jasmine.Spy;

describe('PurchasesComponent', () => {
  let fixture: ComponentFixture<PurchasesComponent>;
  let component;
  let settingService: SettingsService;
  let dialog: MatDialog;
  let dataSpy: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule
      ],
      declarations: [
        AddPurchaseComponent,
        AddPersonComponent,
        AddProductComponent,
        PurchasesComponent,
        EditPurchaseComponent,
      ],
      providers: [
        AlertService,
        SettingsService,
        ExcelService,
        {
          provide: MatDialogRef,
          useValue: {
            close() {
            },
            open() {
            }
          }
        }
      ],
    }).compileComponents();

    dialog = TestBed.get(MatDialog);
    settingService = TestBed.get(SettingsService);
    dataSpy = spyOn(settingService, 'getPurchaseDisplay').and.returnValue(PURCHASE_DISPLAY_OPTIONS);
    fixture = TestBed.createComponent(PurchasesComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    spyOn(settingService, 'getProductInfoById').and.returnValue('product');
    spyOn(settingService, 'getPersonInfoById').and.returnValue('person');
    settingService.purchasesSubject.next(PURCHASE_OPTIONS);
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get data', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(dataSpy).toHaveBeenCalledTimes(2);
    expect(dataSpy).toHaveBeenCalledWith(PURCHASE_OPTIONS);
    expect(component.dataSource.data).toEqual(PURCHASE_DISPLAY_OPTIONS);
  });

  it('should show data', () => {
    let index = 0;
    PURCHASE_DISPLAY_OPTIONS.forEach(it => {
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.id.toString(), index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.purchasedByName, index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.productName, index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.amount.toString(), index);
      index++;
    });
  });

  it('should have correct columns', () => {
    let columns = [
      ID_HEADER,
      'Purchased By',
      'Product',
      'Amount',
    ];
    expectHeaderText(fixture, columns);

    settingService.canEdit = true;
    component.ngOnInit();
    fixture.detectChanges();

    columns.push(EDIT_HEADER);
    expectHeaderText(fixture, columns);
  });

  it('should open edit dialog', () => {
    settingService.canEdit = true;
    component.ngOnInit();
    fixture.detectChanges();

    const spy = spyOn(dialog, 'open');

    clickElement(fixture, 'button');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(EditPurchaseComponent, {
      data: {
        purchase: PURCHASE_DISPLAY_OPTIONS[0]
      }
    });
  });
});
