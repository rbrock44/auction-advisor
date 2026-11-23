import {UntypedFormGroup} from '@angular/forms';

export const RESET_EVERYTHING_MESSAGE: string = 'This will reset everything to the default settings. The current auction is saved to History first.';
export const RESET_SCORES_MESSAGE: string = 'This will reset the scores only.';
export const APPLY_SETTING_MESSAGE: string = 'Applying settings changes will reset scores.';
export const RESET_SCORES_SUCCESS_MESSAGE: string = 'Scores reset successfully.';
export const RESET_EVERYTHING_SUCCESS_MESSAGE: string = 'Settings and scores reset successfully.';
export const APPLY_SETTING_SUCCESS_MESSAGE: string = 'Settings applied successfully.';
export const ACTION_CANCELLED_MESSAGE: string = 'Action Cancelled.';

export const PERFORM_THIS_ACTION: string = 'Are you sure you want to perform this action?';
export const EXPORT_CONFIRM_MESSAGE: string = 'This will download the auction\'s records as an Excel workbook.';

export const COLOR_OPTIONS = [
  {
    name: 'Black',
    value: '--black-color-'
  },
  {
    name: 'Blue',
    value: '--blue-color-'
  },
  {
    name: 'Gray',
    value: '--gray-color-'
  },
  {
    name: 'Gray Dark',
    value: '--gray-dark-color-'
  },
  {
    name: 'Green',
    value: '--green-color-'
  },
  {
    name: 'Orange',
    value: '--orange-color-'
  },
  {
    name: 'Pink',
    value: '--pink-color-'
  },
  {
    name: 'Purple',
    value: '--purple-color-'
  },
  {
    name: 'Red',
    value: '--red-color-'
  },
  {
    name: 'Yellow',
    value: '--yellow-color-'
  },
  {
    name: 'White',
    value: '--white-color-'
  }
];

export const TITLE_DEFAULT = 'Auction Advisor';
export const COLOR_DEFAULT = '--blue-color-';

export const EDIT_COLUMN = 'edit';
export const EDIT_HEADER = 'Edit';
export const ID_HEADER = 'Id';

export const PURCHASE_TYPE = 'purchase';
export const DONATION_TYPE = 'donation';
export const PRODUCT_TYPE = 'product';
export const PERSON_TYPE = 'person';

export const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
export const EXCEL_EXTENSION = '.xlsx';

export const BACKUP_TYPE = 'application/json;charset=UTF-8';
export const BACKUP_EXTENSION = '.json';

export const BACKUP_EXPORT_SUCCESS_MESSAGE: string = 'Backup downloaded.';
export const BACKUP_IMPORT_SUCCESS_MESSAGE: string = 'Auction restored from backup.';
export const BACKUP_IMPORT_INVALID_MESSAGE: string = 'That file is not an Auction Advisor backup. Nothing was changed.';
export const BACKUP_IMPORT_UNREADABLE_MESSAGE: string = 'That file could not be read. Nothing was changed.';

export const SHARE_AUCTION_COPIED_MESSAGE: string = 'Share link copied. Open it on another device to pick up this auction.';
export const SHARE_AUCTION_FAILED_MESSAGE: string = 'Could not share the auction link.';
export const SHARE_AUCTION_BROKEN_MESSAGE: string = 'That share link is broken or incomplete. Nothing was changed.';
export const LOAD_SHARED_AUCTION_MESSAGE: string = 'This link has a shared auction. Loading it will overwrite the auction and settings on this device.';
export const LOAD_SHARED_AUCTION_SUCCESS_MESSAGE: string = 'Shared auction loaded.';

export const NEW_AUCTION_MESSAGE: string = 'This saves the current auction to History and starts a new one. Settings and people are kept; products, donations, and purchases are cleared.';
export const NEW_AUCTION_SUCCESS_MESSAGE: string = 'Auction saved to History. New auction started.';
export const NEW_AUCTION_EMPTY_MESSAGE: string = 'New auction started. Nothing was recorded, so nothing was saved to History.';
export const RESET_EVERYTHING_SAVED_SUCCESS_MESSAGE: string = 'Auction saved to History, then everything was reset.';
export const LOAD_HISTORY_AUCTION_MESSAGE: string = 'This replaces the current auction with the saved one. Press New Auction first if you want to keep the current auction.';
export const LOAD_HISTORY_AUCTION_SUCCESS_MESSAGE: string = 'Saved auction loaded.';
export const DELETE_HISTORY_AUCTION_MESSAGE: string = 'This permanently deletes the saved auction.';
export const DELETE_HISTORY_AUCTION_SUCCESS_MESSAGE: string = 'Saved auction deleted.';
export const EXPORT_HISTORY_SUCCESS_MESSAGE: string = 'All saved auctions exported.';

export function addedSuccessfully(value: string): string {
  return `${value} added successfully`;
}

export function clearFormGroup(group: UntypedFormGroup) {
  Object.keys(group.controls).forEach(key => {
    group.get(key).setValue('');
    group.get(key).markAsUntouched();
  });
}

// Export isn't a page you navigate to — it's an action you trigger from the
// header, so it has no slot here.
export enum Pages {
 Products,
 People,
 Purchases,
 Donations,
 Settings,
 History
}
