import {Component, OnInit, ViewChild} from '@angular/core';
import {SettingsService} from '../../service/settings.service';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {PurchaseDisplay} from '../../model/purchase-display.model';
import {EditPurchaseComponent} from '../../component/edit-purchase/edit-purchase.component';
import {EDIT_COLUMN} from '../../constants/constants';

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
    this.dataSource.data = this.settingsService.getPurchaseDisplay();
    if (this.settingsService.canEdit) {
      this.displayColumns.push(EDIT_COLUMN);
    }
    this.settingsService.purchasesSubject.subscribe(purchases => {
      this.dataSource.data = this.settingsService.getPurchaseDisplay(purchases);
    });
  }

  openEditDialog(purchase: PurchaseDisplay): void {
    event.preventDefault();

    this.dialog.open(EditPurchaseComponent, {
      data: {
        purchase
      }
    });
  }
}
