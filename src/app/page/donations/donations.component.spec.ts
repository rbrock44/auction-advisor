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
import {MatDialogRef} from '@angular/material';

describe('DonationsComponent', () => {
  let fixture: ComponentFixture<DonationsComponent>;
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

    fixture = TestBed.createComponent(DonationsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
