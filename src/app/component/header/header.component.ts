import {Component, ChangeDetectionStrategy} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from '../../service/settings.service';
import { ConfirmationPopupComponent, ConfirmationPopupData } from '../confirmation-popup/confirmation-popup.component';
import { EXPORT_CONFIRM_MESSAGE, SHARE_AUCTION_COPIED_MESSAGE, SHARE_AUCTION_FAILED_MESSAGE } from '../../constants/constants';
import { AlertService } from '../../service/alert.service';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon]
})
export class HeaderComponent {
  constructor(
    private dialog: MatDialog,
    private alertService: AlertService,
    public service: SettingsService
  ) {
  }

  // Every sheet in the workbook is built from products and people, so with
  // neither recorded the download would come out empty.
  get nothingToExport(): boolean {
    const noProducts = !this.service.products || this.service.products.length === 0;
    const noPeople = !this.service.people || this.service.people.length === 0;

    return noProducts && noPeople;
  }

  show(index: number): void {
    this.service.navigateTo(index);
  }

  // Like Export, an action rather than a page: it never changes the view.
  async shareAuction(): Promise<void> {
    this.service.closeOverlaysSubject.next();

    try {
      if (await this.service.shareAuctionLink() === 'copied') {
        this.alertService.success(SHARE_AUCTION_COPIED_MESSAGE);
      }
    } catch {
      this.alertService.error(SHARE_AUCTION_FAILED_MESSAGE);
    }
  }

  // Export isn't a page — it's an action, so clicking it never changes the
  // URL or which view is showing. It just downloads, wherever you are.
  exportAll(): void {
    this.service.closeOverlaysSubject.next();

    if (!this.service.exportHasPopup) {
      this.service.exportAll();
      return;
    }

    this.dialog.open<ConfirmationPopupComponent, ConfirmationPopupData, boolean>(ConfirmationPopupComponent, {
      data: {
        label: EXPORT_CONFIRM_MESSAGE
      },
      id: 'confirmation-modal',
      width: '35vw'
    }).afterClosed().subscribe(shouldExport => {
      if (shouldExport) {
        this.service.exportAll();
      }
    });
  }
}
