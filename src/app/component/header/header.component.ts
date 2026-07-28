import {Component, ChangeDetectionStrategy} from '@angular/core';
import { Pages } from '../../constants/constants';
import { Location } from '@angular/common';
import { SettingsService } from '../../service/settings.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeaderComponent {
  constructor(
    private location: Location,
    public service: SettingsService
  ) {
  }

  show(index: number): void {
    const urlParam = Pages[index];
    if (urlParam !== 'Products') {
      const queryParams = new URLSearchParams()
      queryParams.set('page', urlParam);
      this.location.replaceState(`${location.pathname}?${queryParams.toString()}`);
    } else {
      this.location.replaceState(`${location.pathname}`);
    }
    this.service.setShow(index);
  }
}
