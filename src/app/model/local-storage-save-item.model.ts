export class LocalStorageSaveItem {
  key: string;
  value: string;

  constructor(init?: Partial<LocalStorageSaveItem>) {
    Object.assign(this, init);
  }
}
