import {Component} from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <div>
      <div class="nav-bar-bar">
        <nav mat-tab-nav-bar>
          <div class="nav-bar-div">
            <a mat-tab-link
               mat-theme="accent"
               [routerLink]="['/products']"
               class="nav-bar-link"
               data-products-nav>Products</a>
            <a mat-tab-link
               mat-theme="accent"
               [routerLink]="['/people']"
               class="nav-bar-link"
               data-people-nav>People</a>
            <a mat-tab-link
               mat-theme="accent"
               [routerLink]="['/purchases']"
               class="nav-bar-link"
               data-purchases-nav>Purchases</a>
            <a mat-tab-link
               mat-theme="accent"
               [routerLink]="['/donations']"
               class="nav-bar-link"
               data-donations-nav>Donations</a>
            <a mat-tab-link
               mat-theme="accent"
               [routerLink]="['/settings']"
               class="nav-bar-link"
               data-settings-nav>Settings</a>
          </div>
        </nav>
      </div>
    </div>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
}
