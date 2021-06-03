export class Donation {
  id: number;
  productId: number;
  donatedBy: number;
  estimatedValue: number;
  creditTo: number;
  minSellAmount: number;

  constructor(init?: Partial<Donation>) {
    Object.assign(this, init);
  }
}
