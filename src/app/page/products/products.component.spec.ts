import {async, ComponentFixture, TestBed} from '@angular/core/testing';
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
import {clickElement, expectElementToContainContentAtIndex, expectHeaderText} from '../../constants/expectations.spec';
import {PRODUCT_OPTIONS} from '../../constants/constants.spec';
import {EDIT_HEADER, ID_HEADER} from '../../constants/constants';
import {ProductsComponent} from './products.component';
import {EditProductComponent} from '../../component/edit-product/edit-product.component';

describe('ProductsComponent', () => {
  let fixture: ComponentFixture<ProductsComponent>;
  let component;
  let settingService: SettingsService;
  let dialog: MatDialog;

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
        ProductsComponent,
        EditProductComponent,
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
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    settingService.products = PRODUCT_OPTIONS;
    settingService.productsSubject.next(PRODUCT_OPTIONS);
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get data', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(PRODUCT_OPTIONS);
  });

  it('should have correct columns', () => {
    let columns = [
      ID_HEADER,
      'Name',
      'Description',
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
    PRODUCT_OPTIONS.forEach(it => {
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.id.toString(), index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.name, index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.description, index);
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

    expect(spy).toHaveBeenCalledWith(EditProductComponent, {
      data: {
        product: PRODUCT_OPTIONS[0]
      }
    });
  });
});
