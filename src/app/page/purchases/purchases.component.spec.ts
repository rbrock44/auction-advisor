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
import {MatDialogRef} from '@angular/material';
import {AddPurchaseComponent} from '../../component/add-purchase/add-purchase.component';
import {AddProductComponent} from '../../component/add-product/add-product.component';
import {EditPurchaseComponent} from '../../component/edit-purchase/edit-purchase.component';

describe('PurchasesComponent', () => {
  let fixture: ComponentFixture<PurchasesComponent>;
  let component;

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

    fixture = TestBed.createComponent(PurchasesComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
