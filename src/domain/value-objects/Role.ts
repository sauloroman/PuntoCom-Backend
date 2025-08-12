export enum RoleEnum {
  ADMINISTRADOR = "Administrador",
  SUPERVISOR = "Supervisor",
  VENDEDOR = "Vendedor"
}

export class Role {

  private readonly _role: RoleEnum;

  constructor(role: RoleEnum) {
    if ( !Object.values(RoleEnum).includes(role) ) {
      throw new Error('Rol Inválido')
    }
    this._role = role
  }

  public get value(): RoleEnum {
    return this._role
  }

  public equals( other: Role ): boolean {
    return this._role === other.value
  }

}