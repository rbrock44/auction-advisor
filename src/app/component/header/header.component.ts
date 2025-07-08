import {Component} from '@angular/core';
import { Pages } from '../../constants/constants';
import { Location } from '@angular/common';
import { SettingsService } from '../../service/settings.service';

@Component({
  selector: 'app-header',
  template: `
    <div>
      <div class="nav-bar-bar">
        <nav mat-tab-nav-bar>
          <div class="nav-bar-div">
            <a mat-tab-link
               mat-theme="accent"
               (click)="show(0)"
               class="nav-bar-link"
               data-products-nav>Products</a>
            <a mat-tab-link
               mat-theme="accent"
               (click)="show(1)"
               class="nav-bar-link"
               data-people-nav>People</a>
            <a mat-tab-link
               mat-theme="accent"
               (click)="show(2)"
               class="nav-bar-link"
               data-purchases-nav>Purchases</a>
            <a mat-tab-link
               mat-theme="accent"
               (click)="show(3)"
               class="nav-bar-link"
               data-donations-nav>Donations</a>
            <a mat-tab-link
               mat-theme="accent"
               (click)="show(4)"
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
  constructor(
    private location: Location,
    public service: SettingsService
  ) {
  }

  show(index: number): void {
    const urlParam = Pages[index];
    if (urlParam !== 'Home') {
      const queryParams = new URLSearchParams()
      queryParams.set('page', urlParam);
      this.location.replaceState(`${location.pathname}?${queryParams.toString()}`);
    } else {
      this.location.replaceState(`${location.pathname}`);
    }
    this.service.setShow(index);
  }
}
