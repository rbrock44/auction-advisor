import {Person} from './person.model';
import {Product} from './product.model';
import {Donation} from './donation.model';
import {Purchase} from './purchase.model';

// Bumped only when the shape below changes in a way an older file cannot
// satisfy, so a restore can tell "old backup" from "not a backup at all".
export const BACKUP_VERSION: number = 1;

export interface AuctionBackup {
  version: number;
  exportedAt: string;
  title: string;
  color: string;
  canEdit: boolean;
  exportHasPopup: boolean;
  people: Person[];
  products: Product[];
  donations: Donation[];
  purchases: Purchase[];
}
