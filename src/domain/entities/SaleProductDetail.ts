import { Money, Quantity, Discount } from '../value-objects';
import { DomainError } from '../errors/domain.error';

interface SaleProductDetailProps {
  id: string;
  saleQuantity: Quantity;
  saleUnitPrice: Money;
  saleDiscount?: Discount;
  productId: string;
  saleId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SaleProductDetail {
  private readonly _id: string;
  private _saleQuantity: Quantity;
  private _saleUnitPrice: Money;
  private _saleDiscount?: Discount;
  private _productId: string;
  private _saleId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private readonly MESSAGE_ERROR: string = "SALE_PRODUCT_DETAIL_VALIDATION_ERROR"

  constructor({
    id,
    saleQuantity,
    saleUnitPrice,
    saleDiscount,
    productId,
    saleId,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: SaleProductDetailProps) {
    this._id = id;
    this._saleQuantity = saleQuantity;
    this._saleUnitPrice = saleUnitPrice;
    this._saleDiscount = saleDiscount;
    this._productId = productId;
    this._saleId = saleId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  private validate() {
    this.validateQuantity(this._saleQuantity);
    this.validateUnitPrice(this._saleUnitPrice);
    this.validateDiscount(this._saleDiscount);
    this.validateProductId(this._productId);
    this.validateSaleId(this._saleId);
  }

  private validateQuantity(quantity: Quantity) {
    if (!quantity) {
      throw new DomainError(this.MESSAGE_ERROR, 'La cantidad de venta es obligatoria');
    }
  }

  private validateUnitPrice(price: Money) {
    if (!price) {
      throw new DomainError(this.MESSAGE_ERROR, 'El precio unitario es obligatorio');
    }
  }

  private validateDiscount(discount?: Discount) {
    if (discount !== undefined && !(discount instanceof Discount)) {
      throw new DomainError(this.MESSAGE_ERROR, 'Descuento inválido');
    }
  }

  private validateProductId(productId: string) {
    if (!productId || productId.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El ID del producto es obligatorio');
    }
  }

  private validateSaleId(saleId: string) {
    if (!saleId || saleId.trim().length === 0) {
      throw new DomainError(this.MESSAGE_ERROR, 'El ID de la venta es obligatorio');
    }
  }

  get id(): string {
    return this._id;
  }

  get saleQuantity(): Quantity {
    return this._saleQuantity;
  }

  get saleUnitPrice(): Money {
    return this._saleUnitPrice;
  }

  get saleDiscount(): Discount | undefined {
    return this._saleDiscount;
  }

  get productId(): string {
    return this._productId;
  }

  get saleId(): string {
    return this._saleId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public update(params: {
    saleQuantity?: Quantity;
    saleUnitPrice?: Money;
    saleDiscount?: Discount | null;
    productId?: string;
    saleId?: string;
  }) {
    if (params.saleQuantity !== undefined) {
      this.validateQuantity(params.saleQuantity);
      this._saleQuantity = params.saleQuantity;
    }

    if (params.saleUnitPrice !== undefined) {
      this.validateUnitPrice(params.saleUnitPrice);
      this._saleUnitPrice = params.saleUnitPrice;
    }

    if (params.saleDiscount !== undefined) {
      if (params.saleDiscount === null) {
        this._saleDiscount = undefined;
      } else {
        this.validateDiscount(params.saleDiscount);
        this._saleDiscount = params.saleDiscount;
      }
    }

    if (params.productId !== undefined) {
      this.validateProductId(params.productId);
      this._productId = params.productId;
    }

    if (params.saleId !== undefined) {
      this.validateSaleId(params.saleId);
      this._saleId = params.saleId;
    }

    this.touchUpdatedAt();
  }

  private touchUpdatedAt() {
    this._updatedAt = new Date();
  }
}
