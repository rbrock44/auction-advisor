import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Person} from '../../model/person.model';
import {Product} from '../../model/product.model';
import {SettingsService} from '../../service/settings.service';

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

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.settingsService.products;
    this.settingsService.getProductsChange().subscribe(products => {
      this.dataSource.data = products;
    });
  }

}
