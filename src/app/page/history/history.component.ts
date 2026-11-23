import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SettingsService} from '../../service/settings.service';
import {AlertService} from '../../service/alert.service';
import {ConfirmationPopupComponent, ConfirmationPopupData} from '../../component/confirmation-popup/confirmation-popup.component';
import {AuctionHistoryEntry, AuctionSummary} from '../../model/auction-history.model';
import {
  DELETE_HISTORY_AUCTION_MESSAGE,
  DELETE_HISTORY_AUCTION_SUCCESS_MESSAGE,
  EXPORT_HISTORY_SUCCESS_MESSAGE,
  LOAD_HISTORY_AUCTION_MESSAGE,
  LOAD_HISTORY_AUCTION_SUCCESS_MESSAGE,
  Pages,
  SHARE_AUCTION_COPIED_MESSAGE,
  SHARE_AUCTION_FAILED_MESSAGE
} from '../../constants/constants';

interface HistoryRow {
  entry: AuctionHistoryEntry;
  summary: AuctionSummary;
}

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [DatePipe]
})
export class HistoryComponent implements OnInit {
  rows: HistoryRow[] = [];

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    public settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.rows = this.settingsService.getHistory().map(entry => ({
      entry,
      summary: this.settingsService.getAuctionSummary(entry.auction)
    }));
  }

  load(entry: AuctionHistoryEntry): void {
    this.getConfirmationPopup(LOAD_HISTORY_AUCTION_MESSAGE).afterClosed().subscribe(shouldLoad => {
      if (shouldLoad) {
        this.settingsService.applyBackup(entry.auction);
        this.alertService.success(LOAD_HISTORY_AUCTION_SUCCESS_MESSAGE);
        this.settingsService.navigateTo(Pages.Products);
      } else {
        this.alertService.actionCancelled();
      }
    });
  }

  async share(entry: AuctionHistoryEntry): Promise<void> {
    try {
      if (await this.settingsService.shareAuctionLink(entry.auction) === 'copied') {
        this.alertService.success(SHARE_AUCTION_COPIED_MESSAGE);
      }
    } catch {
      this.alertService.error(SHARE_AUCTION_FAILED_MESSAGE);
    }
  }

  remove(entry: AuctionHistoryEntry): void {
    this.getConfirmationPopup(DELETE_HISTORY_AUCTION_MESSAGE).afterClosed().subscribe(shouldDelete => {
      if (shouldDelete) {
        this.settingsService.deleteHistoryEntry(entry.id);
        this.refresh();
        this.alertService.success(DELETE_HISTORY_AUCTION_SUCCESS_MESSAGE);
      } else {
        this.alertService.actionCancelled();
      }
    });
  }

  exportAll(): void {
    this.settingsService.exportHistoryToExcel();
    this.alertService.success(EXPORT_HISTORY_SUCCESS_MESSAGE);
  }

  private getConfirmationPopup(label: string): MatDialogRef<ConfirmationPopupComponent, boolean> {
    return this.dialog.open<ConfirmationPopupComponent, ConfirmationPopupData, boolean>(ConfirmationPopupComponent, {
      data: {
        label
      },
      id: 'confirmation-modal',
      width: '35vw'
    });
  }
}
