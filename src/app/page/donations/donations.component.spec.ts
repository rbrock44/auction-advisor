import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DonationsComponent} from './donations.component';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {EditDonationComponent} from '../../component/edit-donation/edit-donation.component';
import {AddDonationComponent} from '../../component/add-donation/add-donation.component';
import {AddPersonComponent} from '../../component/add-person/add-person.component';
import {AddProductComponent} from '../../component/add-product/add-product.component';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {ExcelService} from '../../service/excel.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DONATION_DISPLAY_OPTIONS} from '../../constants/constants.spec';
import {EDIT_HEADER, ID_HEADER} from '../../constants/constants';
import {clickElement, expectElementToContainContentAtIndex, expectHeaderText} from '../../constants/expectations.spec';
import Spy = jasmine.Spy;

describe('DonationsComponent', () => {
  let fixture: ComponentFixture<DonationsComponent>;
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
        AddDonationComponent,
        AddPersonComponent,
        AddProductComponent,
        DonationsComponent,
        EditDonationComponent,
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
    dataSpy = spyOn(settingService, 'getDonationDisplay').and.returnValue(DONATION_DISPLAY_OPTIONS);
    fixture = TestBed.createComponent(DonationsComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should get data', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(dataSpy).toHaveBeenCalledTimes(2);
    expect(component.dataSource.data).toEqual(DONATION_DISPLAY_OPTIONS);
  });

  it('should get data', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(DONATION_DISPLAY_OPTIONS);
  });

  it('should have correct columns', () => {
    let columns = [
      ID_HEADER,
      'Product',
      'Donated By',
      'Estimated Value',
      'Credit To',
      'Min Sell Amount'
    ];
    expectHeaderText(fixture, columns);

    settingService.canEdit = true;
    component.ngOnInit();
    fixture.detectChanges();

    columns.push(EDIT_HEADER);
    expectHeaderText(fixture, columns);
  });

  it('should show data', () => {
    let index = 0;
    DONATION_DISPLAY_OPTIONS.forEach(it => {
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.id.toString(), index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.productName, index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.donatedByName, index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.estimatedValue.toString(), index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.creditToName, index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.minSellAmount.toString(), index);
      index++;
    });
  });

  it('should open edit dialog', () => {
    settingService.canEdit = true;
    component.ngOnInit();
    fixture.detectChanges();

    const spy = spyOn(dialog, 'open');

    clickElement(fixture, 'button');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(EditDonationComponent, {
      data: {
        donation: DONATION_DISPLAY_OPTIONS[0]
      }
    });
  });
});
