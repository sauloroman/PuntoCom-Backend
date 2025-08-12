export enum AdjustmentEnum {
  ENTRADA = 'entrada',
  SALIDA = 'salida'
}

export class AdjustmentType {
  private readonly _value: AdjustmentEnum;

  constructor(value: AdjustmentEnum) {
    if (!Object.values(AdjustmentEnum).includes(value)) {
      throw new Error(`Tipo de ajuste inválido`);
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
