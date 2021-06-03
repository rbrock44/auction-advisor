import {Component, OnInit, ViewChild} from '@angular/core';
import {Purchase} from '../../model/purchase.model';
import {SettingsService} from '../../service/settings.service';
import {MatSort, MatTableDataSource} from '@angular/material';
import {PurchaseDisplay} from '../../model/purchase-display.model';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
  dataSource = new MatTableDataSource<PurchaseDisplay>();
  displayColumns: string[] = ['id', 'purchasedBy', 'product', 'amount'];

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.mapPurchaseToPurchaseDisplay(this.settingsService.purchases);
    this.settingsService.getPurchasesChange().subscribe(purchases => {
      this.dataSource.data = this.mapPurchaseToPurchaseDisplay(purchases);
    });
  }

  mapPurchaseToPurchaseDisplay(purchases: Purchase[]): PurchaseDisplay[] {
    let array: PurchaseDisplay[] = [];

    purchases.forEach(item => {
      let newItem: PurchaseDisplay = new PurchaseDisplay();
      newItem.id = item.id;
      newItem.amount = item.amount;
      newItem.purchasedBy = this.settingsService.getPersonInfoById(item.purchasedBy);
      newItem.product = this.settingsService.getProductInfoById(item.id);
      array.push(newItem);
    });
    return array;
  }
}
