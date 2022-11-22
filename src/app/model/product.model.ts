export class Product {
  id: number;
  name: string;
  description: string;

  constructor(init?: Partial<Product>) {
    Object.assign(this, init);
  }

  display(): string {
    return `${this.name} - ${this.description}`;
  }
}
