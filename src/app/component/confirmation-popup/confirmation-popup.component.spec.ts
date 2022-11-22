import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ConfirmationPopupComponent} from './confirmation-popup.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material';
import {clickElement, expectElementToContainContent} from '../../constants/expectations.spec';
import {PERFORM_THIS_ACTION} from '../../constants/constants';

describe('ConfirmationPopupComponent', () => {
  let fixture: ComponentFixture<ConfirmationPopupComponent>;
  let component;
  let label: string = 'label';
  let cancelButton: string = '[data-cancel-button]';
  let confirmButton: string = '[data-confirm-button]';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            label
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close() {
            }
          }
        }
      ],
      declarations: [
        ConfirmationPopupComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationPopupComponent);
    component = fixture.debugElement.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable close', () => {
    expect(component.dialogRef.disableClose).toBeTruthy();
  });

  it('should assign label when value passed', () => {
    expect(component.label).toEqual(label);
  });

  it('should contain the correct elements', () => {
    expectElementToContainContent(fixture, '[data-question-label]', label);
    expectElementToContainContent(fixture, '[data-perform-action]', PERFORM_THIS_ACTION);
    expectElementToContainContent(fixture, confirmButton, 'Confirm');
    expectElementToContainContent(fixture, cancelButton, 'Cancel');
  });

  it('should cancel correctly', () => {
    const spy = spyOn(component.dialogRef, 'close');
    clickElement(fixture, cancelButton);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(false);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should confirm correctly', () => {
    const spy = spyOn(component.dialogRef, 'close');
    clickElement(fixture, confirmButton);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
