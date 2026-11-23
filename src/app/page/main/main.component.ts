import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from '../../service/settings.service';
import { AlertService } from '../../service/alert.service';
import { ConfirmationPopupComponent, ConfirmationPopupData } from '../../component/confirmation-popup/confirmation-popup.component';
import { LOAD_SHARED_AUCTION_MESSAGE, LOAD_SHARED_AUCTION_SUCCESS_MESSAGE } from '../../constants/constants';
import { ProductsComponent } from '../products/products.component';
import { PeopleComponent } from '../people/people.component';
import { PurchasesComponent } from '../purchases/purchases.component';
import { DonationsComponent } from '../donations/donations.component';
import { SettingsComponent } from '../settings/settings.component';
import { HistoryComponent } from '../history/history.component';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ProductsComponent, PeopleComponent, PurchasesComponent, DonationsComponent, SettingsComponent, HistoryComponent]
})
export class MainComponent implements OnInit {
  constructor(
    public service: SettingsService,
    private dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadSharedAuction();
  }

  // A share link carries a whole auction; confirm before it overwrites this device's auction.
  private async loadSharedAuction(): Promise<void> {
    const value = this.service.readSharedAuctionFromUrl();
    if (!value) {
      return;
    }

    this.service.clearSharedAuctionFromUrl();

    try {
      const auction = await this.service.parseShareValue(value);
      this.dialog.open<ConfirmationPopupComponent, ConfirmationPopupData, boolean>(ConfirmationPopupComponent, {
        data: {
          label: LOAD_SHARED_AUCTION_MESSAGE
        },
        id: 'confirmation-modal',
        width: '35vw'
      }).afterClosed().subscribe(shouldLoad => {
        if (shouldLoad) {
          this.service.applyBackup(auction);
          this.alertService.success(LOAD_SHARED_AUCTION_SUCCESS_MESSAGE);
        } else {
          this.alertService.actionCancelled();
        }
      });
    } catch (error) {
      this.alertService.error((error as Error).message);
    }
  }
}
