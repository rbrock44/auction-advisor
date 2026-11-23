import {AuctionBackup} from './auction-backup.model';

// One finished auction kept on the History page. It's a full backup, so it
// can be loaded back or shared exactly like a backup file.
export interface AuctionHistoryEntry {
  id: string;
  savedAt: string;
  auction: AuctionBackup;
}

export interface AuctionSummary {
  people: number;
  products: number;
  donations: number;
  purchases: number;
  totalRaised: number;
}
