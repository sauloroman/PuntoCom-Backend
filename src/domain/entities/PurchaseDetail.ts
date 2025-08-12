import { Money, Stock } from '../value-objects';

interface PurchaseDetailProps {
  id: string;
  purchaseQuantity: Stock; // usamos Stock para validar cantidad entera y no negativa
  purchaseUnitPrice: Money; // Money para precio unitario positivo con decimales
  productId: string;
  purchaseId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PurchaseDetail {
  private readonly _id: string;
  private _purchaseQuantity: Stock;
  private _purchaseUnitPrice: Money;
  private _productId: string;
  private _purchaseId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor({
    id,
    purchaseQuantity,
    purchaseUnitPrice,
    productId,
    purchaseId,
    createdAt = new Date(),
    updatedAt = new Date()
  }: PurchaseDetailProps) {
    this._id = id;
    this._purchaseQuantity = purchaseQuantity;
    this._purchaseUnitPrice = purchaseUnitPrice;
    this._productId = productId;
    this._purchaseId = purchaseId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  private validate() {
    this.validateQuantity(this._purchaseQuantity);
    this.validateUnitPrice(this._purchaseUnitPrice);
    this.validateProductId(this._productId);
    this.validatePurchaseId(this._purchaseId);
  }

  private validateQuantity(quantity: Stock) {
    if (!quantity) {
      throw new Error('La cantidad de compra es obligatoria');
    }
  }

  private validateUnitPrice(price: Money) {
    if (!price) {
      throw new Error('El precio unitario es obligatorio');
    }
  }

  private validateProductId(productId: string) {
    if (!productId || productId.trim().length === 0) {
      throw new Error('El ID del producto es obligatorio');
    }
  }

  private validatePurchaseId(purchaseId: string) {
    if (!purchaseId || purchaseId.trim().length === 0) {
      throw new Error('El ID de la compra es obligatorio');
    }
  }

  get id(): string {
    return this._id;
  }

  get purchaseQuantity(): Stock {
    return this._purchaseQuantity;
  }

  get purchaseUnitPrice(): Money {
    return this._purchaseUnitPrice;
  }

  get productId(): string {
    return this._productId;
  }

  get purchaseId(): string {
    return this._purchaseId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public update(params: {
    purchaseQuantity?: Stock;
    purchaseUnitPrice?: Money;
    productId?: string;
    purchaseId?: string;
  }) {
    if (params.purchaseQuantity !== undefined) {
      this.validateQuantity(params.purchaseQuantity);
      this._purchaseQuantity = params.purchaseQuantity;
    }
    if (params.purchaseUnitPrice !== undefined) {
      this.validateUnitPrice(params.purchaseUnitPrice);
      this._purchaseUnitPrice = params.purchaseUnitPrice;
    }
    if (params.productId !== undefined) {
      this.validateProductId(params.productId);
      this._productId = params.productId;
    }
    if (params.purchaseId !== undefined) {
      this.validatePurchaseId(params.purchaseId);
      this._purchaseId = params.purchaseId;
    }
    this.touchUpdatedAt();
  }

  private touchUpdatedAt() {
    this._updatedAt = new Date();
  }
}
