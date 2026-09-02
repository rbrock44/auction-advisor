import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {HeaderComponent} from './header.component';
import {expectElementPresent, expectElementToContainContent, clickElement} from '../../constants/expectations.spec';
import {RouterTestingModule} from '@angular/router/testing';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SettingsService} from '../../service/settings.service';
import {ConfirmationPopupComponent} from '../confirmation-popup/confirmation-popup.component';
import {EXPORT_CONFIRM_MESSAGE} from '../../constants/constants';
import {PEOPLE_OPTIONS, PRODUCT_OPTIONS} from '../../constants/constants.spec';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component;
  let settingsService: SettingsService;
  let dialog: MatDialog;

  const EXPORT_BUTTON = '[data-header-export]';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        HeaderComponent
    ],
    providers: [
        {
            provide: MatDialogRef,
            useValue: {
                close() {
                },
                open() {
                }
            }
        }
    ]
}).compileComponents();

    dialog = TestBed.inject(MatDialog);
    settingsService = TestBed.inject(SettingsService);
    settingsService.people = PEOPLE_OPTIONS;
    settingsService.products = PRODUCT_OPTIONS;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an export action', () => {
    expectElementToContainContent(fixture, EXPORT_BUTTON, 'Export');
  });

  it('should have a settings icon button', () => {
    expectElementPresent(fixture, '[data-settings-nav]');

    const button = fixture.nativeElement.querySelector('[data-settings-nav]');
    expect(button.getAttribute('aria-label')).toEqual('Settings');
  });

  it('should mark settings active on the settings page', () => {
    settingsService.setShow(4);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-settings-nav]');
    expect(el.classList.contains('active')).toBeTruthy();
  });

  it('should never mark export active, since it is not a page', () => {
    const el = fixture.nativeElement.querySelector(EXPORT_BUTTON);
    expect(el.classList.contains('active')).toBeFalsy();
  });

  it('should disable export when there is nothing to export', () => {
    settingsService.people = [];
    settingsService.products = [];
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(EXPORT_BUTTON);
    expect(button.disabled).toBeTruthy();
  });

  describe('clicking export', () => {
    it('should close any open overlay immediately', () => {
      const spy = jasmine.createSpy();
      settingsService.closeOverlaysSubject.subscribe(spy);
      spyOn(settingsService, 'exportAll');

      clickElement(fixture, EXPORT_BUTTON);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not change the page or the url', () => {
      const setShowSpy = spyOn(settingsService, 'setShow');
      spyOn(settingsService, 'exportAll');

      clickElement(fixture, EXPORT_BUTTON);

      expect(setShowSpy).not.toHaveBeenCalled();
    });

    describe('without a confirmation popup', () => {
      beforeEach(() => {
        settingsService.exportHasPopup = false;
      });

      it('should download immediately', () => {
        const exportSpy = spyOn(settingsService, 'exportAll');
        const dialogSpy = spyOn(dialog, 'open');

        clickElement(fixture, EXPORT_BUTTON);

        expect(exportSpy).toHaveBeenCalledTimes(1);
        expect(dialogSpy).not.toHaveBeenCalled();
      });
    });

    describe('with a confirmation popup', () => {
      beforeEach(() => {
        settingsService.exportHasPopup = true;
      });

      it('should ask before downloading', () => {
        const exportSpy = spyOn(settingsService, 'exportAll');
        const dialogSpy = spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(false)} as any);

        clickElement(fixture, EXPORT_BUTTON);

        expect(dialogSpy).toHaveBeenCalledWith(ConfirmationPopupComponent, {
          data: {
            label: EXPORT_CONFIRM_MESSAGE
          },
          id: 'confirmation-modal',
          width: '35vw'
        });
        expect(exportSpy).not.toHaveBeenCalled();
      });

      it('should download once confirmed', () => {
        const exportSpy = spyOn(settingsService, 'exportAll');
        spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(true)} as any);

        clickElement(fixture, EXPORT_BUTTON);

        expect(exportSpy).toHaveBeenCalledTimes(1);
      });

      it('should not download when cancelled', () => {
        const exportSpy = spyOn(settingsService, 'exportAll');
        spyOn(dialog, 'open').and.returnValue({afterClosed: () => of(false)} as any);

        clickElement(fixture, EXPORT_BUTTON);

        expect(exportSpy).not.toHaveBeenCalled();
      });
    });
  });
});
