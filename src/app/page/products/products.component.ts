import {Component, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {Product} from '../../model/product.model';
import {SettingsService} from '../../service/settings.service';
import {EditProductComponent} from '../../component/edit-product/edit-product.component';
import {EDIT_COLUMN} from '../../constants/constants';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class ProductsComponent implements OnInit {
  dataSource = new MatTableDataSource<Product>();
  displayColumns: string[] = ['id', 'name', 'description'];
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.settingsService.products;
    if (this.settingsService.canEdit) {
      this.displayColumns.push(EDIT_COLUMN);
    }
    this.settingsService.productsSubject.subscribe(products => {
      this.dataSource.data = products;
    });

    const queryParams = new URLSearchParams(window.location.search);
    const pageParam = queryParams.get('page');

    if (pageParam) {
      this.settingsService.setShowWithUrlParam(pageParam);
    }
  }

  openEditDialog(product: Product): void {
    if (!!event) {
      event.preventDefault();
    }

    this.dialog.open(EditProductComponent, {
      data: {
        product
      }
    });
  }
}
