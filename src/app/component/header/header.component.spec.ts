import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderComponent} from './header.component';
import {expectElementToContainContentAtIndex} from '../../constants/expectations.spec';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component;
  let router: Router;
  let links = [
    'Products',
    'People',
    'Purchases',
    'Donations',
    'Settings'
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        HeaderComponent
      ],
    }).compileComponents();

    router = TestBed.get(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct links in header', () => {
    links.forEach((item, index) => {
      expectElementToContainContentAtIndex(
        fixture,
        '.nav-bar-link',
        item,
        index
      );
    });
  });
});
