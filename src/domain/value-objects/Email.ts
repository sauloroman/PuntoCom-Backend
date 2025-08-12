export class Email {
  
  private readonly _emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly _value: string

  constructor(email: string) {
    if ( !this._emailRegex.test(email) ) {
      throw new Error('Email inválido')
    }
    this._value = email.toLowerCase()
  }

  public get value(): string {
    return this._value
  }

  public equals(other: Email): boolean {
    return this._value === other.value
  }

}