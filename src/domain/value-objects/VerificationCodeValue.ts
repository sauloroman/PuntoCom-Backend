import { DomainError } from '../errors/domain.error';

export class VerificationCodeValue {
  private readonly _value: string;
  private static readonly CODE_LENGTH = 6;
  private readonly MESSAGE_ERROR = 'VERIFICATION_CODE_VALUE_ERROR';

  constructor(value: string) {
    if (!/^\d+$/.test(value)) {
      throw new DomainError(
        this.MESSAGE_ERROR,
        'El código de verificación debe contener solo números'
      );
    }
    if (value.length !== VerificationCodeValue.CODE_LENGTH) {
      throw new DomainError(
        this.MESSAGE_ERROR,
        `El código de verificación debe tener exactamente ${VerificationCodeValue.CODE_LENGTH} dígitos`
      );
    }

    this._value = value;
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: VerificationCodeValue): boolean {
    return this._value === other.value;
  }
}
