import { ProductCode, Money, Stock } from '../value-objects';
import { DomainError } from '../errors/domain.error';

interface ProductProps {
  id: string;
  name: string;
  description?: string;
  image?: string;
  code: ProductCode;
  sellingPrice: Money;
  stock: Stock;
  stockMin: Stock;
  categoryId: string;
  supplierId: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _image: string;
  private _code: ProductCode;
  private _sellingPrice: Money;
  private _stock: Stock;
  private _stockMin: Stock;
  private _categoryId: string;
  private _supplierId: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private static readonly MAX_NAME_LENGTH: number = 100;
  private static readonly MAX_DESCRIPTION_LENGTH: number = 220;
  private static readonly MAX_IMAGE_LENGTH: number = 200;
  private readonly MESSAGE_ERROR: string = "PRODUCT_VALIDATION_ERROR"


  constructor({
    id,
    name,
    description = 'Producto sin descripción',
    image = 'Producto sin imagen',
    code,
    sellingPrice,
    stock,
    stockMin,
    categoryId,
    supplierId,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }: ProductProps) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._image = image;
    this._code = code;
    this._sellingPrice = sellingPrice;
    this._stock = stock;
    this._stockMin = stockMin;
    this._categoryId = categoryId;
    this._supplierId = supplierId;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  private validate() {
    this.validateName(this._name)
    this.validateDescription(this._description)
    this.validateImage(this._image)
    this.validateCategoryId(this._categoryId)
    this.validateSupplierId(this._supplierId)
    this.validateStockConsistency( this._stock, this._stockMin )
  }

  private validateName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El nombre del producto es obligatorio');
    }
    if (name.length > Product.MAX_NAME_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `El nombre no puede exceder ${Product.MAX_NAME_LENGTH} caracteres`);
    }
  }

  private validateDescription( description: string ) {
    if (description.trim().length > Product.MAX_DESCRIPTION_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `La descripción no puede exceder ${Product.MAX_DESCRIPTION_LENGTH} caracteres`);
    }
  }

  private validateImage( image: string ) {
    if (image.trim().length > Product.MAX_IMAGE_LENGTH) {
      throw new DomainError(this.MESSAGE_ERROR, `La URL de la imagen no puede exceder ${Product.MAX_IMAGE_LENGTH} caracteres`);
    }
  }

  private validateCategoryId( categoryId: string ) {
    if ( !categoryId || categoryId.trim().length === 0 ) {
      throw new DomainError(this.MESSAGE_ERROR, 'El ID de categoría es obligatorio');
    }
  }

  private validateSupplierId( supplierId: string ) {
    if (!supplierId || supplierId.trim().length === 0 ) {
      throw new DomainError(this.MESSAGE_ERROR, 'El ID de proveedor es obligatorio');
    }
  }

  private validateStockConsistency( stock: Stock, stockMin: Stock ) {
    if ( stockMin.value > stock.value ) {
      throw new Error('El stock mínimo no puede ser mayor que el stock actual');
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

  get image(): string {
    return this._image;
  }

  get code(): ProductCode {
    return this._code;
  }

  get sellingPrice(): Money {
    return this._sellingPrice;
  }

  get stock(): Stock {
    return this._stock;
  }

  get stockMin(): Stock {
    return this._stockMin;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get supplierId(): string {
    return this._supplierId;
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

  public update(params: {
    name?: string;
    description?: string;
    image?: string;
    code?: ProductCode;
    sellingPrice?: Money;
    stock?: Stock;
    stockMin?: Stock;
    categoryId?: string;
    supplierId?: string;
    isActive?: boolean;
  }) {
    if (params.name !== undefined) {
      this.validateName(params.name)
      this._name = params.name.trim();
    }

    if (params.description !== undefined) {
      this.validateDescription(params.description)
      this._description = params.description;
    }

    if (params.image !== undefined) {
      this.validateImage(params.image)
      this._image = params.image
    }

    if (params.code !== undefined) {
      this._code = params.code;
    }

    if (params.sellingPrice !== undefined) {
      this._sellingPrice = params.sellingPrice;
    }

    if (params.stock !== undefined) {
      this._stock = params.stock;
    }

    if (params.stockMin !== undefined) {
      this._stockMin = params.stockMin;
    }

    if (params.categoryId !== undefined) {
      this.validateCategoryId(params.categoryId)
      this._categoryId = params.categoryId;
    }

    if (params.supplierId !== undefined) {
      this.validateSupplierId(params.supplierId)
      this._supplierId = params.supplierId;
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
