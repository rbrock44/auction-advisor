export class Purchase {
  id: number;
  purchasedBy: number;
  productId: number;
  amount: number;

  constructor(init?: Partial<Purchase>) {
    Object.assign(this, init);
  }
}
