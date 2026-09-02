import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {AlertComponent} from './alert.component';
import {AlertService} from '../../service/alert.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;
  let component;
  let service: AlertService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        AlertComponent
    ],
    providers: [
        AlertService,
    ]
}).compileComponents();

    service = TestBed.inject(AlertService);
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
