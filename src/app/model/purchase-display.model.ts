export class PurchaseDisplay {
  id: number;
  purchasedBy: string;
  product: string;
  amount: number;

  constructor(init?: Partial<PurchaseDisplay>) {
    Object.assign(this, init);
  }
}
