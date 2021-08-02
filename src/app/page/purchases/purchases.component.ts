import {Component, OnInit, ViewChild} from '@angular/core';
import {Purchase} from '../../model/purchase.model';
import {SettingsService} from '../../service/settings.service';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {PurchaseDisplay} from '../../model/purchase-display.model';
import {EditPurchaseComponent} from '../../component/edit-purchase/edit-purchase.component';

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

  constructor(
    public dialog: MatDialog,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.mapPurchaseToPurchaseDisplay(this.settingsService.purchases);
    if (this.settingsService.canEdit) {
      this.displayColumns.push('edit');
    }
    this.settingsService.getPurchasesChange().subscribe(purchases => {
      this.dataSource.data = this.mapPurchaseToPurchaseDisplay(purchases);
    });
  }

  mapPurchaseToPurchaseDisplay(purchases: Purchase[]): PurchaseDisplay[] {
    let array: PurchaseDisplay[] = [];

    purchases.forEach(item => {
      array.push(this.settingsService.mapPurchaseToPurchaseDisplay(item));
    });
    return array;
  }

  openEditDialog(purchase: PurchaseDisplay): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(EditPurchaseComponent, {
      data: {
        purchase: purchase
      }
    });
  }
}
