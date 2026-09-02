import {waitForAsync, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {HeaderComponent} from './component/header/header.component';
import {AlertComponent} from './component/alert/alert.component';
import {AlertService} from './service/alert.service';
import {CommonModule} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        AlertComponent,
        HeaderComponent,
        AppComponent,
    ],
    providers: [
        AlertService,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
}).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'auction-advisor'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('auction-advisor');
  });
});
