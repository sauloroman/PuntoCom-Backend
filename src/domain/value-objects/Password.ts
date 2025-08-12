export class Password {

  private readonly _hashedValue: string;

  constructor(hashedValue: string) {
    if (!hashedValue ||  hashedValue.length === 0) {
      throw new Error('Hash de contraseña inválido.')
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