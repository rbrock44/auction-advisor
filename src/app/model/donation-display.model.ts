import {Donation} from './donation.model';

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

  public static mapFromDonations(
    donations: Donation[],
    productInfo: (value: number) => string,
    personInfo: (value: number) => string
  ): DonationDisplay[] {
    let array: DonationDisplay[] = [];

    donations.forEach(item => {
      array.push(new DonationDisplay({
        id: item.id,
        estimatedValue: item.estimatedValue,
        minSellAmount: item.minSellAmount,
        productName: productInfo(item.productId),
        donatedByName: personInfo(item.donatedBy),
        creditToName: personInfo(item.creditTo),
        creditTo: item.creditTo,
        donatedBy: item.donatedBy,
        productId: item.productId
      }));
    });
    return array;
  }
}
