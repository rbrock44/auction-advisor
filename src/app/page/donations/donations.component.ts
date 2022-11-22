import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {SettingsService} from '../../service/settings.service';
import {DonationDisplay} from '../../model/donation-display.model';
import {EditDonationComponent} from '../../component/edit-donation/edit-donation.component';
import {EDIT_COLUMN} from '../../constants/constants';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
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
    event.preventDefault();

    this.dialog.open(EditDonationComponent, {
      data: {
        donation
      }
    });
  }
}
