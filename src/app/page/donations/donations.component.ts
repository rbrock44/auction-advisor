import {Component, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {SettingsService} from '../../service/settings.service';
import {DonationDisplay} from '../../model/donation-display.model';
import {EditDonationComponent, EditDonationDialogData} from '../../component/edit-donation/edit-donation.component';
import {EDIT_COLUMN} from '../../constants/constants';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-donations',
    templateUrl: './donations.component.html',
    styleUrls: ['./donations.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class DonationsComponent implements OnInit {
  dataSource = new MatTableDataSource<DonationDisplay>();
  displayColumns: string[] = ['id', 'product', 'donatedBy', 'estimatedValue', 'creditTo', 'minSellAmount'];

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.settingsService.getDonationDisplay();
    if (this.settingsService.canEdit) {
      this.displayColumns.push(EDIT_COLUMN);
    }
    this.settingsService.donationsSubject.subscribe(donations => {
      this.dataSource.data = this.settingsService.getDonationDisplay(donations);
    });
  }

  openEditDialog(donation: DonationDisplay): void {
    if (!!event) {
      event.preventDefault();
    }

    this.dialog.open<EditDonationComponent, EditDonationDialogData>(EditDonationComponent, {
      data: {
        donation
      }
    });
  }
}
