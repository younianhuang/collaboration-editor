export default class Guid {
  // public static create(): string {
  //   let result = '';
  //   for (let index = 0; index < MODEL_ID.length; index += 1) {
  //     if (MODEL_ID[index] === 'x') {
  //       result += Math.floor(Math.random() * 16).toString(16);
  //     } else {
  //       result += MODEL_ID[index];
  //     }
  //   }

  //   return result;
  // }

  public static validator = new RegExp(
    '^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$',
    'i',
  );

  public static empty = '00000000-0000-0000-0000-000000000000';

  public static isGuid(guid: any): boolean {
    const value: string = guid.toString();
    return guid && (guid instanceof Guid || Guid.validator.test(value));
  }

  public static create(): Guid {
    return new Guid(
      [
        Guid._gen(2),
        Guid._gen(1),
        Guid._gen(1),
        Guid._gen(1),
        Guid._gen(3),
      ].join('-'),
    );
  }

  public static createEmpty(): Guid {
    return new Guid('emptyguid');
  }

  public static parse(guid: string): Guid {
    return new Guid(guid);
  }

  public static raw(): string {
    return [
      Guid._gen(2),
      Guid._gen(1),
      Guid._gen(1),
      Guid._gen(1),
      Guid._gen(3),
    ].join('-');
  }

  private static _gen(count: number) {
    let out = '';
    for (let i = 0; i < count; i += 1) {
      out += Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return out;
  }

  private _value: string;

  private constructor(guid: string) {
    if (!guid) {
      throw new TypeError('Invalid argument; `value` has no value.');
    }

    this._value = Guid.empty;

    if (guid && Guid.isGuid(guid)) {
      this._value = guid;
    }
  }

  public equals(other: Guid): boolean {
    // Comparing string `value` against provided `guid` will auto-call
    // toString on `guid` for comparison
    return Guid.isGuid(other) && this._value === other.toString();
  }

  public isEmpty(): boolean {
    return this._value === Guid.empty;
  }

  public toString(): string {
    return this._value;
  }

  public toJSON(): any {
    return {
      value: this._value,
    };
  }
}
