import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {Product} from '../../model/product.model';
import {SettingsService} from '../../service/settings.service';
import {EditProductComponent} from '../../component/edit-product/edit-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
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
      this.displayColumns.push('edit');
    }
    this.settingsService.getProductsChange().subscribe(products => {
      this.dataSource.data = products;
    });
  }

  openEditDialog(product: Product): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(EditProductComponent, {
      data: {
        product: product
      }
    });
  }

}
