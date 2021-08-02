export class DonationDisplay {
  id: number;
  productName: string;
  productId: number;
  donatedBy: number;
  donatedByName: string;
  estimatedValue: number;
  creditTo: number;
  creditToName: string;
  minSellAmount: number;

  constructor(init?: Partial<DonationDisplay>) {
    Object.assign(this, init);
  }
}
