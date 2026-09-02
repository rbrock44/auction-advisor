import {Component, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {SettingsService} from '../../service/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {PurchaseDisplay} from '../../model/purchase-display.model';
import {EditPurchaseComponent} from '../../component/edit-purchase/edit-purchase.component';
import {EDIT_COLUMN} from '../../constants/constants';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-purchases',
    templateUrl: './purchases.component.html',
    styleUrls: ['./purchases.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
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
    if (!!event) {
      event.preventDefault();
    }

    this.dialog.open(EditPurchaseComponent, {
      data: {
        purchase
      }
    });
  }
}
