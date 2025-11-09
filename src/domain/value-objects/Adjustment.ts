import { DomainError } from '../errors/domain.error';

export enum AdjustmentEnum {
  entrada = 'entrada',
  salida = 'salida',
}

export class AdjustmentType {
  private readonly _value: AdjustmentEnum;
  private readonly MESSAGE_ERROR: string = "ADJUSTMENTTYPE_VALIDATION_ERROR"

  constructor(value: AdjustmentEnum) {
    if (!Object.values(AdjustmentEnum).includes(value)) {
      throw new DomainError(this.MESSAGE_ERROR, `Tipo de ajuste inválido`);
    }
    this._value = value;
  }

  public get value(): AdjustmentEnum {
    return this._value;
  }

  public equals(other: AdjustmentType ): boolean {
    return this._value === other.value;
  }
}
