import { DomainError } from '../errors/domain.error';

interface CategoryProps {
  id: string;
  name: string;
  description?: string; // opcional con default
  icon?: string;        // opcional con default
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category {
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _icon: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private static MAX_NAME_LENGTH: number = 100;
  private static MAX_DESCRIPTION_LENGTH: number = 220;
  private static MAX_ICON_LENGTH: number = 100;
  private readonly MESSAGE_ERROR: string = "CATEGORY_VALIDATION_ERROR"

  constructor({
    id,
    name,
    description = 'Categoría sin descripción',
    icon = 'Categoría sin ícono',
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: CategoryProps) {
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
    this.validateName(this._name);
    this.validateDescription(this._description);
    this.validateIcon(this._icon);
  }

  private validateName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El nombre de la categoría es obligatorio');
    }
    if (name.length > Category.MAX_NAME_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `El nombre de la categoría no puede exceder ${Category.MAX_NAME_LENGTH} caracteres`);
    }
  }

  private validateDescription(description: string) {
    if (description.length > Category.MAX_DESCRIPTION_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `La descripción no puede exceder ${Category.MAX_DESCRIPTION_LENGTH} caracteres`);
    }
  }

  private validateIcon(icon: string) {
    if (icon.length > Category.MAX_ICON_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `El icono no puede exceder ${Category.MAX_ICON_LENGTH} caracteres`);
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
      this.validateName(params.name);
      this._name = params.name;
    }
    if (params.description !== undefined) {
      this.validateDescription(params.description);
      this._description = params.description;
    }
    if (params.icon !== undefined) {
      this.validateIcon(params.icon);
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
