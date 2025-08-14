import { DomainError } from '../errors/domain.error';

export class Password {

  private readonly _hashedValue: string;
  private readonly MESSAGE_ERROR: string = "PASSWORD_VALIDATION_ERROR"

  constructor(hashedValue: string) {
    if (!hashedValue ||  hashedValue.length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'Hash de contraseña inválido.')
    }
    this._hashedValue = hashedValue
  }

  public get value(): string {
    return this._hashedValue
  }

  public equals(other: Password): boolean {
    return this._hashedValue === other.value
  }

}