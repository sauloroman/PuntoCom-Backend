import { RegularExp } from "../../config/utils";
import { DomainError } from "../errors/domain.error";

export class Email {
  
  private readonly _emailRegex: RegExp = RegularExp.EMAIL_REGEX;
  private readonly _value: string
  private readonly MESSAGE_ERROR: string = "EMAIL_VALIDATION_ERROR"

  constructor(email: string) {
    if ( !this._emailRegex.test(email) ) {
      throw new DomainError(this.MESSAGE_ERROR, 'Email inválido')
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