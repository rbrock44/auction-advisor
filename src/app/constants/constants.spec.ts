import {Person} from '../model/person.model';
import {Product} from '../model/product.model';

export const PEOPLE_OPTIONS = [
  new Person({id: 0, firstName: 'name0', lastName: 'last0'}),
  new Person({id: 1, firstName: 'name1', lastName: 'last1'}),
  new Person({id: 2, firstName: 'name2', lastName: 'last2'}),
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

