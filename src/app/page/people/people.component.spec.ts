import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PeopleComponent} from './people.component';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {AddPersonComponent} from '../../component/add-person/add-person.component';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {ExcelService} from '../../service/excel.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {EditPersonComponent} from '../../component/edit-person/edit-person.component';
import {PEOPLE_OPTIONS} from '../../constants/constants.spec';
import {EDIT_HEADER, ID_HEADER} from '../../constants/constants';
import {clickElement, expectElementToContainContentAtIndex, expectHeaderText} from '../../constants/expectations.spec';

describe('PeopleComponent', () => {
  let fixture: ComponentFixture<PeopleComponent>;
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
        AddPersonComponent,
        PeopleComponent,
        EditPersonComponent,
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
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    settingService.people = PEOPLE_OPTIONS;
    settingService.peopleSubject.next(PEOPLE_OPTIONS);
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get data', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(PEOPLE_OPTIONS);
  });

  it('should have correct columns', () => {
    let columns = [
      ID_HEADER,
      'First Name',
      'Last Name',
      'Email'
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
    PEOPLE_OPTIONS.forEach(it => {
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.id.toString(), index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.firstName, index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.lastName, index);
      index++;
      expectElementToContainContentAtIndex(fixture, 'mat-cell', it.email, index);
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

    expect(spy).toHaveBeenCalledWith(EditPersonComponent, {
      data: {
        person: PEOPLE_OPTIONS[0]
      }
    });
  });
});
