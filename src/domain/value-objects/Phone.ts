import { RegularExp } from "../../config/utils";
import { DomainError } from "../errors/domain.error";

export class Phone {

  private readonly _phoneRegex: RegExp =  RegularExp.PHONE_REGEX
  private readonly _phone: string;
  
  private static MAX_PHONE_LENGTH: number = 20
  private readonly MESSAGE_ERROR: string = "PHONE_VALIDATION_ERROR"

  constructor( phone: string ) {
    if (phone.length > Phone.MAX_PHONE_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `El teléfono no puede exceder ${Phone.MAX_PHONE_LENGTH} caracteres`);
    }

    if ( !this._phoneRegex.test(phone) ) {
      throw new DomainError(this.MESSAGE_ERROR, `El teléfono tiene un formato inválido`)
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