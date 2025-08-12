import { Quantity, AdjustmentType } from '../value-objects';

interface InventoryAdjustmentProps {
  id: string;
  productId: string;
  adjustmentType: AdjustmentType;
  adjustmentQuantity: Quantity;
  adjustmentReason: string;
  userId: string;
  adjustmentDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class InventoryAdjustment {
  private readonly _id: string;
  private _productId: string;
  private _adjustmentType: AdjustmentType;
  private _adjustmentQuantity: Quantity;
  private _adjustmentReason: string;
  private _userId: string;
  private _adjustmentDate: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  private static readonly MAX_REASON_LENGTH = 255;

  constructor({
    id,
    productId,
    adjustmentType,
    adjustmentQuantity,
    adjustmentReason,
    userId,
    adjustmentDate = new Date(),
    createdAt = new Date(),
    updatedAt = new Date()
  }: InventoryAdjustmentProps) {
    this._id = id;
    this._productId = productId;
    this._adjustmentType = adjustmentType;
    this._adjustmentQuantity = adjustmentQuantity;
    this._adjustmentReason = adjustmentReason;
    this._userId = userId;
    this._adjustmentDate = adjustmentDate;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  private validate() {
    this.validateProductId(this._productId);
    this.validateAdjustmentType(this._adjustmentType);
    this.validateAdjustmentQuantity(this._adjustmentQuantity);
    this.validateAdjustmentReason(this._adjustmentReason);
    this.validateUserId(this._userId);
  }

  private validateProductId(productId: string) {
    if (!productId || productId.trim().length === 0) {
      throw new Error('El ID del producto es obligatorio');
    }
  }

  private validateAdjustmentType(adjustmentType: AdjustmentType) {
    if (!adjustmentType) {
      throw new Error('El tipo de ajuste es obligatorio');
    }
  }

  private validateAdjustmentQuantity(quantity: Quantity) {
    if (!quantity) {
      throw new Error('La cantidad de ajuste es obligatoria');
    }
  }

  private validateAdjustmentReason(reason: string) {
    if (!reason || reason.trim().length === 0) {
      throw new Error('La razón del ajuste es obligatoria');
    }
    if (reason.length > InventoryAdjustment.MAX_REASON_LENGTH) {
      throw new Error(`La razón del ajuste no puede exceder ${InventoryAdjustment.MAX_REASON_LENGTH} caracteres`);
    }
  }

  private validateUserId(userId: string) {
    if (!userId || userId.trim().length === 0) {
      throw new Error('El ID del usuario es obligatorio');
    }
  }

  get id(): string {
    return this._id;
  }

  get productId(): string {
    return this._productId;
  }

  get adjustmentType(): AdjustmentType {
    return this._adjustmentType;
  }

  get adjustmentQuantity(): Quantity {
    return this._adjustmentQuantity;
  }

  get adjustmentReason(): string {
    return this._adjustmentReason;
  }

  get userId(): string {
    return this._userId;
  }

  get adjustmentDate(): Date {
    return this._adjustmentDate;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public update(params: {
    productId?: string;
    adjustmentType?: AdjustmentType;
    adjustmentQuantity?: Quantity;
    adjustmentReason?: string;
    userId?: string;
    adjustmentDate?: Date;
  }) {
    if (params.productId !== undefined) {
      this.validateProductId(params.productId);
      this._productId = params.productId;
    }
    if (params.adjustmentType !== undefined) {
      this.validateAdjustmentType(params.adjustmentType);
      this._adjustmentType = params.adjustmentType;
    }
    if (params.adjustmentQuantity !== undefined) {
      this.validateAdjustmentQuantity(params.adjustmentQuantity);
      this._adjustmentQuantity = params.adjustmentQuantity;
    }
    if (params.adjustmentReason !== undefined) {
      this.validateAdjustmentReason(params.adjustmentReason);
      this._adjustmentReason = params.adjustmentReason;
    }
    if (params.userId !== undefined) {
      this.validateUserId(params.userId);
      this._userId = params.userId;
    }
    if (params.adjustmentDate !== undefined) {
      this._adjustmentDate = params.adjustmentDate;
    }
    this.touchUpdatedAt();
  }

  private touchUpdatedAt() {
    this._updatedAt = new Date();
  }
}
