import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {EXCEL_EXTENSION, EXCEL_TYPE} from '../constants/constants';
import {Product} from '../model/product.model';
import {Donation} from '../model/donation.model';
import {Purchase} from '../model/purchase.model';
import {Person} from '../model/person.model';

@Injectable()
export class ExcelService {
  public exportToExcelTotals(
    title: string,
    people: Person[],
    donations: Donation[],
    purchases: Purchase[],
    personInfo: (value: number) => string
  ): void {
    const personTitle: string = 'Person';
    const amountPurchased: string = 'Amount Purchased';
    const itemsPurchasedTitle: string = 'Number Of Items Purchased';
    const itemsCreditedTitle: string = 'Number Of Items Credited';
    const creditTotal: string = 'Amount to Credit Account';
    let dataArray: any = [];

    people.forEach(person => {
      const name = personInfo(person.id);
      const purchasedItems = purchases.filter(x => x.purchasedBy === person.id);
      const credits = donations.filter(x => x.creditTo === person.id)
        .filter(y => purchases.findIndex(c => c.productId === y.productId) > -1);
      let totalPurchased: number = 0;
      const itemsPurchased: number = purchasedItems.length;
      const itemsCredited: number = credits.length;
      let totalCredit: number = 0;

      purchasedItems.forEach(purchase => {
        totalPurchased += +purchase.amount;
      });

      credits.forEach(donation => {
        const purchase = purchases.find(x => x.productId === donation.productId);
        totalCredit += +purchase.amount;
      });

      let data: any = {};
      data[personTitle] = name;
      data[amountPurchased] = '$' + totalPurchased;
      data[itemsPurchasedTitle] = itemsPurchased;
      data[creditTotal] = '$' + totalCredit;
      data[itemsCreditedTitle] = itemsCredited;

      dataArray.push(data);
    });

    this.exportAsExcelFile(dataArray, title);

    // This helped
    // https://medium.com/@madhavmahesh/exporting-an-excel-file-in-angular-927756ac9857
  }

  public exportToExcelByProduct(
    title: string,
    products: Product[],
    donations: Donation[],
    purchases: Purchase[],
    personInfo: (value: number) => string
  ): void {
    const productName: string = 'Product Name';
    const productDesc: string = 'Product Description';
    const donatedBy: string = 'Donated By';
    const creditTo: string = 'Credit To';
    const purchasedBy: string = 'Purchased By';
    const purchasedAmount: string = 'Purchased Amount';

    let dataArray: any = [];

    products.forEach(product => {
      let data: any = {};
      let donation: Donation = donations.find(x => x.productId === product.id);
      let purchase: Purchase = purchases.find(x => x.productId === product.id);
      data[productName] = product.name;
      data[productDesc] = product.description;
      data[donatedBy] = donation !== undefined ? personInfo(donation.donatedBy) : '';
      data[creditTo] = donation !== undefined ? personInfo(donation.creditTo) : '';
      data[purchasedBy] = purchase !== undefined ? personInfo(purchase.purchasedBy) : '';
      data[purchasedAmount] = purchase.amount;

      dataArray.push(data);
    });

    this.exportAsExcelFile(dataArray, title);
    // This helped
    // https://medium.com/@madhavmahesh/exporting-an-excel-file-in-angular-927756ac9857
  }

  public exportToExcelByPurchaser(
    title: string,
    products: Product[],
    people: Person[],
    purchases: Purchase[],
    personInfo: (value: number) => string
  ): void {
    const purchaser: string = 'Purchaser';
    const productName: string = 'Product Name';
    const productDescription: string = 'Product Description';
    const amount: string = 'Amount Purchased';
    let dataArray: any = [];

    people.forEach(person => {
      const name = personInfo(person.id);

      purchases.filter(x => x.purchasedBy === person.id).forEach(purchase => {
        let data: any = {};
        let product: Product = products.find(x => x.id === purchase.productId);
        data[purchaser] = name;
        data[productName] = product !== undefined ? product.name : '';
        data[productDescription] = product !== undefined ? product.description : '';
        data[amount] = purchase.amount;

        dataArray.push(data);
      });
    });

    this.exportAsExcelFile(dataArray, title);

    // This helped
    // https://medium.com/@madhavmahesh/exporting-an-excel-file-in-angular-927756ac9857
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const data: string = 'data';
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {data: worksheet}, SheetNames: [data]};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});

    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
