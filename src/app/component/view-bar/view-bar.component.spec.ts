import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../material.module';
import {ViewBarComponent} from './view-bar.component';
import {SettingsService} from '../../service/settings.service';
import {ExcelService} from '../../service/excel.service';
import {
  clickElement,
  expectElementPresent,
  expectElementToContainContentAtIndex
} from '../../constants/expectations.spec';

describe('ViewBarComponent', () => {
  let fixture: ComponentFixture<ViewBarComponent>;
  let component;
  let settingsService: SettingsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MaterialModule
      ],
      declarations: [
        ViewBarComponent
      ],
      providers: [
        SettingsService,
        ExcelService
      ]
    }).compileComponents();

    settingsService = TestBed.inject(SettingsService);
    fixture = TestBed.createComponent(ViewBarComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a chip for each view, in auction order', () => {
    const labels = ['Products', 'People', 'Purchases', 'Donations'];

    labels.forEach((label, index) => {
      expectElementToContainContentAtIndex(fixture, '.type__label', label, index);
    });
  });

  it('should default to Products active', () => {
    expectElementPresent(fixture, '[data-view="product"].type--active');
  });

  ['product', 'person', 'purchase', 'donation'].forEach((type, index) => {
    it(`should switch to ${type} and mark it active`, () => {
      clickElement(fixture, `[data-view="${type}"]`);
      fixture.detectChanges();

      expect(settingsService.show[index]).toBeTruthy();
      expectElementPresent(fixture, `[data-view="${type}"].type--active`);
    });
  });

  it('should mark only one chip active at a time', () => {
    clickElement(fixture, '[data-view="donation"]');
    fixture.detectChanges();

    const active = fixture.nativeElement.querySelectorAll('.type--active');
    expect(active.length).toEqual(1);
    expect(active[0].getAttribute('data-view')).toEqual('donation');
  });
});
