import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Location} from '@angular/common';
import {Pages} from '../../constants/constants';
import {SettingsService} from '../../service/settings.service';

export type ViewType = 'product' | 'person' | 'purchase' | 'donation';

@Component({
    selector: 'app-view-bar',
    templateUrl: './view-bar.component.html',
    styleUrls: ['./view-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewBarComponent {
  // Order matches how the auction actually runs: catalogue the lots, know
  // who's bidding, then track what sold and what was given.
  readonly types: ViewType[] = ['product', 'person', 'purchase', 'donation'];

  private readonly indexes: Record<ViewType, number> = {
    product: 0,
    person: 1,
    purchase: 2,
    donation: 3
  };

  private readonly titles: Record<ViewType, string> = {
    product: 'Products',
    person: 'People',
    purchase: 'Purchases',
    donation: 'Donations'
  };

  private readonly icons: Record<ViewType, string> = {
    product: 'local_offer',
    person: 'group',
    purchase: 'shopping_cart',
    donation: 'redeem'
  };

  constructor(
    private location: Location,
    public service: SettingsService
  ) {
  }

  label(type: ViewType): string {
    return this.titles[type];
  }

  icon(type: ViewType): string {
    return this.icons[type];
  }

  isActive(type: ViewType): boolean {
    return this.service.show[this.indexes[type]];
  }

  show(type: ViewType): void {
    const index = this.indexes[type];
    const urlParam = Pages[index];
    if (urlParam !== 'Products') {
      const queryParams = new URLSearchParams();
      queryParams.set('page', urlParam);
      this.location.replaceState(`${location.pathname}?${queryParams.toString()}`);
    } else {
      this.location.replaceState(`${location.pathname}`);
    }
    this.service.setShow(index);
  }
}
