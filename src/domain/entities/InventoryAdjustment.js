"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryAdjustment = void 0;
var domain_error_1 = require("../errors/domain.error");
var InventoryAdjustment = /** @class */ (function () {
    function InventoryAdjustment(_a) {
        var id = _a.id, productId = _a.productId, adjustmentType = _a.adjustmentType, adjustmentQuantity = _a.adjustmentQuantity, adjustmentReason = _a.adjustmentReason, userId = _a.userId, _b = _a.adjustmentDate, adjustmentDate = _b === void 0 ? new Date() : _b, _c = _a.createdAt, createdAt = _c === void 0 ? new Date() : _c, _d = _a.updatedAt, updatedAt = _d === void 0 ? new Date() : _d;
        this.MESSAGE_ERROR = "INVENTORY_ADJUSTMENT_VALIDATION_ERROR";
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
    InventoryAdjustment.prototype.validate = function () {
        this.validateProductId(this._productId);
        this.validateAdjustmentType(this._adjustmentType);
        this.validateAdjustmentQuantity(this._adjustmentQuantity);
        this.validateAdjustmentReason(this._adjustmentReason);
        this.validateUserId(this._userId);
    };
    InventoryAdjustment.prototype.validateProductId = function (productId) {
        if (!productId || productId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID del producto es obligatorio');
        }
    };
    InventoryAdjustment.prototype.validateAdjustmentType = function (adjustmentType) {
        if (!adjustmentType) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El tipo de ajuste es obligatorio');
        }
    };
    InventoryAdjustment.prototype.validateAdjustmentQuantity = function (quantity) {
        if (!quantity) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'La cantidad de ajuste es obligatoria');
        }
    };
    InventoryAdjustment.prototype.validateAdjustmentReason = function (reason) {
        if (!reason || reason.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'La razón del ajuste es obligatoria');
        }
        if (reason.length > InventoryAdjustment.MAX_REASON_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "La raz\u00F3n del ajuste no puede exceder ".concat(InventoryAdjustment.MAX_REASON_LENGTH, " caracteres"));
        }
    };
    InventoryAdjustment.prototype.validateUserId = function (userId) {
        if (!userId || userId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID del usuario es obligatorio');
        }
    };
    Object.defineProperty(InventoryAdjustment.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InventoryAdjustment.prototype, "productId", {
        get: function () {
            return this._productId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InventoryAdjustment.prototype, "adjustmentType", {
        get: function () {
            return this._adjustmentType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InventoryAdjustment.prototype, "adjustmentQuantity", {
        get: function () {
            return this._adjustmentQuantity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InventoryAdjustment.prototype, "adjustmentReason", {
        get: function () {
            return this._adjustmentReason;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InventoryAdjustment.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InventoryAdjustment.prototype, "adjustmentDate", {
        get: function () {
            return this._adjustmentDate;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InventoryAdjustment.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InventoryAdjustment.prototype, "updatedAt", {
        get: function () {
            return this._updatedAt;
        },
        enumerable: false,
        configurable: true
    });
    InventoryAdjustment.prototype.update = function (params) {
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
    };
    InventoryAdjustment.prototype.touchUpdatedAt = function () {
        this._updatedAt = new Date();
    };
    InventoryAdjustment.MAX_REASON_LENGTH = 255;
    return InventoryAdjustment;
}());
exports.InventoryAdjustment = InventoryAdjustment;
