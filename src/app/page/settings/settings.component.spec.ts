import {waitForAsync, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {SettingsComponent} from './settings.component';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {ExcelService} from '../../service/excel.service';
import { MatDialogRef } from '@angular/material/dialog';
import {YesNoDropdownComponent} from '../../component/yes-no-dropdown/yes-no-dropdown.component';
import {
  expectElementAbsent,
  expectElementPresent,
  expectElementPresentAtIndex,
  expectElementToContainContent,
  expectElementToContainContentAtIndex
} from '../../constants/expectations.spec';
import {HEADER} from '../../constants/constants.spec';

describe('SettingsComponent', () => {
  let fixture: ComponentFixture<SettingsComponent>;
  let component;
  let settingsService: SettingsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        CommonModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        SettingsComponent,
        YesNoDropdownComponent
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

    settingsService = TestBed.inject(SettingsService);
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a title', () => {
    expectElementToContainContent(fixture, HEADER, 'Settings');
  });

  it('should have title input', () => {
    expectElementToContainContent(fixture, '[data-title-label]', 'Title');
    expectElementPresent(fixture, '[data-title]');
    expectElementPresentAtIndex(fixture, 'input', 0);
  });

  it('should have an editing permission dropdown', () => {
    // The label is interpolated by the child component, so it needs a render.
    fixture.detectChanges();

    expectElementToContainContentAtIndex(fixture, '[data-dropdown-label]', 'Allow editing', 0);
  });

  it('should have an export confirmation dropdown', () => {
    fixture.detectChanges();

    expectElementToContainContentAtIndex(fixture, '[data-dropdown-label]', 'Confirm before exporting', 1);
  });

  it('should not offer a colour choice', () => {
    expect(component.colorControl).toBeUndefined();
  });

  it('should not offer an apply button, since changes save themselves', () => {
    expectElementAbsent(fixture, '[data-button-apply]');
  });

  it('should not offer exports, which live on their own page', () => {
    expectElementAbsent(fixture, '[data-button-export]');
  });

  describe('saving', () => {
    beforeEach(() => {
      // Runs ngOnInit, which seeds the controls and wires the save triggers.
      fixture.detectChanges();
    });

    it('should save the title once typing settles', fakeAsync(() => {
      const spy = spyOn(settingsService, 'applySettings');

      component.titleControl.setValue('Spring Gala');

      expect(component.status).toEqual('saving');
      expect(spy).not.toHaveBeenCalled();

      tick(500);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('Spring Gala', component.canEditControl.value, component.exportHasPopupControl.value);
      expect(component.status).toEqual('saved');
    }));

    it('should only write once for a burst of typing', fakeAsync(() => {
      const spy = spyOn(settingsService, 'applySettings');

      component.titleControl.setValue('S');
      tick(100);
      component.titleControl.setValue('Sp');
      tick(100);
      component.titleControl.setValue('Spring');

      tick(500);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('Spring', component.canEditControl.value, component.exportHasPopupControl.value);
    }));

    it('should save as soon as the editing permission changes', () => {
      const spy = spyOn(settingsService, 'applySettings');

      component.canEditControl.setValue(true);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.status).toEqual('saved');
    });

    it('should save as soon as the export confirmation choice changes', () => {
      const spy = spyOn(settingsService, 'applySettings');

      component.exportHasPopupControl.setValue(true);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(component.titleControl.value, component.canEditControl.value, true);
      expect(component.status).toEqual('saved');
    });

    it('should refuse to save an empty title', fakeAsync(() => {
      const spy = spyOn(settingsService, 'applySettings');

      component.titleControl.setValue('');
      tick(500);

      expect(spy).not.toHaveBeenCalled();
      expect(component.status).toEqual('idle');
    }));

    it('should report the save in the status line', fakeAsync(() => {
      spyOn(settingsService, 'applySettings');

      component.titleControl.setValue('Harvest Auction');
      tick(500);
      fixture.detectChanges();

      expectElementToContainContent(fixture, '[data-save-status]', 'Saved');
    }));
  });
});
