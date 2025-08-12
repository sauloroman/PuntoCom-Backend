export class Phone {

  private readonly _phoneRegex: RegExp =  /^[0-9\s\-()+]*$/
  private readonly _phone: string;

  private static MAX_PHONE_LENGTH = 12

  constructor( phone: string ) {
    if (phone.length > Phone.MAX_PHONE_LENGTH) {
      throw new Error(`El teléfono no puede exceder ${Phone.MAX_PHONE_LENGTH} caracteres`);
    }

    if ( this._phoneRegex.test(phone) ) {
      throw new Error(`El teléfono tiene un formato inválido`)
    }

    this._phone = phone
  }

  public get value(): string {
    return this._phone
  }

  public equals(other: Phone): boolean {
    return this._phone === other.value
  }

}