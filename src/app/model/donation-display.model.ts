export class DonationDisplay {
  id: number;
  product: string;
  donatedBy: string;
  estimatedValue: number;
  creditTo: string;
  minSellAmount: number;

  constructor(init?: Partial<DonationDisplay>) {
    Object.assign(this, init);
  }
}
