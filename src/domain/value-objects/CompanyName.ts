export class CompanyName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('El nombre de la empresa es obligatorio');
    }
    
    if (value.length > 100) {
      throw new Error('El nombre de la empresa es demasiado largo');
    }
 
    this._value = value.trim();
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: CompanyName): boolean {
    return this._value === other.value;
  }
}
