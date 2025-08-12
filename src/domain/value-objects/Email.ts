export class Email {
  private readonly _value: string

  constructor(email: string) {
    if ( !this.validate(email) ) {
      throw new Error('Email inválido')
    }
    this._value = email.toLowerCase()
  }

  private validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test( email )
  }

  public get value(): string {
    return this._value
  }

  public equals(other: Email): boolean {
    return this._value === other.value
  }

}