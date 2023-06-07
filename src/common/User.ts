import { generateLongIdentifier } from './Identifier';

export class User {

  public readonly userId: string;

  public readonly token: string;

  public active: boolean;

  public index: number;

  public size: number;

  public constructor() {
    this.userId = generateLongIdentifier();
    this.token = generateLongIdentifier();
    this.active = true;
    this.index = 0;
    this.size = 0;
  }

}
