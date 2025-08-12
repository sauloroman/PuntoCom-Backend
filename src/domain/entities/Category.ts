export class Category {
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _icon: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string = 'Categoría sin descripción',
    icon: string = 'Categoría sin ícono',
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._icon = icon;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  private validate() {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('El nombre de la categoría es obligatorio');
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get icon(): string {
    return this._icon;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public activate() {
    this._isActive = true;
    this.touchUpdatedAt();
  }

  public deactivate() {
    this._isActive = false;
    this.touchUpdatedAt();
  }

  public update(params: {
    name?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
  }) {
    if (params.name !== undefined) {
      if (!params.name.trim()) throw new Error('El nombre de la categoría es obligatorio');
      this._name = params.name;
    }
    if (params.description !== undefined) {
      this._description = params.description;
    }
    if (params.icon !== undefined) {
      this._icon = params.icon;
    }
    if (params.isActive !== undefined) {
      this._isActive = params.isActive;
    }
    this.touchUpdatedAt();
  }

  private touchUpdatedAt() {
    this._updatedAt = new Date();
  }
}
