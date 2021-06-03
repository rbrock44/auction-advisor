import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {SettingsService} from '../../service/settings.service';
import {Donation} from '../../model/donation.model';
import {DonationDisplay} from '../../model/donation-display.model';

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
  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.mapDonationToDonationDisplay(this.settingsService.donations);
    this.settingsService.getDonationsChange().subscribe(donations => {
      this.dataSource.data = this.mapDonationToDonationDisplay(donations);
    });
  }

  mapDonationToDonationDisplay(donations: Donation[]): DonationDisplay[] {
    let array: DonationDisplay[] = [];

    donations.forEach(item => {
      let newItem: DonationDisplay = new DonationDisplay();
      newItem.id = item.id;
      newItem.estimatedValue = item.estimatedValue;
      newItem.minSellAmount = item.minSellAmount;
      newItem.product = this.settingsService.getProductInfoById(item.productId);
      newItem.donatedBy = this.settingsService.getPersonInfoById(item.donatedBy);
      newItem.creditTo = this.settingsService.getPersonInfoById(item.creditTo);
      array.push(newItem);
    });
    return array;
  }

}
