import {Person} from '../model/person.model';
import {Product} from '../model/product.model';
import {Purchase} from '../model/purchase.model';
import {PurchaseDisplay} from '../model/purchase-display.model';
import {DonationDisplay} from '../model/donation-display.model';

export const HEADER = '[data-header-title]';

export const PEOPLE_OPTIONS = [
  new Person({id: 0, firstName: 'name0', lastName: 'last0', email: 'email0'}),
  new Person({id: 1, firstName: 'name1', lastName: 'last1', email: 'email1'}),
  new Person({id: 2, firstName: 'name2', lastName: 'last2', email: 'email2'}),
];

export const PEOPLE_OPTION_VALUES = [
  'name0 last0',
  'name1 last1',
  'name2 last2',
];

export const PRODUCT_OPTIONS = [
  new Product({id: 0, name: 'name0', description: 'desc0'}),
  new Product({id: 1, name: 'name1', description: 'desc1'}),
  new Product({id: 2, name: 'name2', description: 'desc2'}),
];

export const PRODUCT_OPTION_VALUES = [
  'name0 - desc0',
  'name1 - desc1',
  'name2 - desc2',
];

export const PURCHASE_OPTIONS = [
  new Purchase({id: 0, purchasedBy: 0, productId: 0, amount: 0}),
  new Purchase({id: 1, purchasedBy: 1, productId: 1, amount: 1}),
  new Purchase({id: 2, purchasedBy: 2, productId: 2, amount: 2}),
];

export const PURCHASE_DISPLAY_OPTIONS = [
  new PurchaseDisplay({id: 0, purchasedBy: 0, productId: 0, amount: 0, productName: 'product0', purchasedByName: 'name0'}),
  new PurchaseDisplay({id: 1, purchasedBy: 1, productId: 1, amount: 1, productName: 'product1', purchasedByName: 'name1'}),
  new PurchaseDisplay({id: 2, purchasedBy: 2, productId: 2, amount: 2, productName: 'product2', purchasedByName: 'name2'}),
];

export const DONATION_DISPLAY_OPTIONS = [
  new DonationDisplay({
    id: 0,
    donatedBy: 0,
    productId: 0,
    minSellAmount: 0,
    estimatedValue: 0,
    productName: 'product0',
    donatedByName: 'name0',
    creditToName: 'name0'
  }),
  new DonationDisplay({
    id: 1,
    donatedBy: 1,
    productId: 1,
    minSellAmount: 1,
    estimatedValue: 1,
    productName: 'product1',
    donatedByName: 'name1',
    creditToName: 'name1'
  }),
  new DonationDisplay({
    id: 2,
    donatedBy: 2,
    productId: 2,
    minSellAmount: 2,
    estimatedValue: 2,
    productName: 'product2',
    donatedByName: 'name2',
    creditToName: 'name2'
  }),
];
