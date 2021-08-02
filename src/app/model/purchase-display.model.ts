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
}
