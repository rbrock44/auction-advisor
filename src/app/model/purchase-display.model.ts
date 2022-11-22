import {Purchase} from './purchase.model';

export class PurchaseDisplay {
  id: number;
  purchasedByName: string;
  productName: string;
  amount: number;
  productId: number;
  purchasedBy: number;

  constructor(init?: Partial<PurchaseDisplay>) {
    Object.assign(this, init);
  }

  public static mapFromPurchase(
    purchases: Purchase[],
    productInfo: (value: number) => string,
    personInfo: (value: number) => string
  ): PurchaseDisplay[] {
    let array: PurchaseDisplay[] = [];

    purchases.forEach(item => {
      array.push(new PurchaseDisplay({
        id: item.id,
        amount: item.amount,
        purchasedByName: personInfo(item.purchasedBy),
        productName: productInfo(item.productId),
        productId: item.productId,
        purchasedBy: item.purchasedBy
      }));
    });
    return array;
  }
}
