export class Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(init?: Partial<Person>) {
    Object.assign(this, init);
  }

  name(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
