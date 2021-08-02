import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {SettingsService} from '../../service/settings.service';
import {Donation} from '../../model/donation.model';
import {DonationDisplay} from '../../model/donation-display.model';
import {EditDonationComponent} from '../../component/edit-donation/edit-donation.component';

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
    this.dataSource.data = this.mapDonationToDonationDisplay(this.settingsService.donations);
    if (this.settingsService.canEdit) {
      this.displayColumns.push('edit');
    }
    this.settingsService.getDonationsChange().subscribe(donations => {
      this.dataSource.data = this.mapDonationToDonationDisplay(donations);
    });
  }

  mapDonationToDonationDisplay(donations: Donation[]): DonationDisplay[] {
    let array: DonationDisplay[] = [];

    donations.forEach(item => {
      array.push(this.settingsService.mapDonationToDonationDisplay(item));
    });
    return array;
  }

  openEditDialog(donation: DonationDisplay): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(EditDonationComponent, {
      data: {
        donation: donation
      }
    });
  }
}
