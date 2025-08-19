"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseDetail = void 0;
var domain_error_1 = require("../errors/domain.error");
var PurchaseDetail = /** @class */ (function () {
    function PurchaseDetail(_a) {
        var id = _a.id, purchaseQuantity = _a.purchaseQuantity, purchaseUnitPrice = _a.purchaseUnitPrice, productId = _a.productId, purchaseId = _a.purchaseId, _b = _a.createdAt, createdAt = _b === void 0 ? new Date() : _b, _c = _a.updatedAt, updatedAt = _c === void 0 ? new Date() : _c;
        this.MESSAGE_ERROR = "PURCHASE_DETAIL_VALIDATION_ERROR";
        this._id = id;
        this._purchaseQuantity = purchaseQuantity;
        this._purchaseUnitPrice = purchaseUnitPrice;
        this._productId = productId;
        this._purchaseId = purchaseId;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this.validate();
    }
    PurchaseDetail.prototype.validate = function () {
        this.validateQuantity(this._purchaseQuantity);
        this.validateUnitPrice(this._purchaseUnitPrice);
        this.validateProductId(this._productId);
        this.validatePurchaseId(this._purchaseId);
    };
    PurchaseDetail.prototype.validateQuantity = function (quantity) {
        if (!quantity) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'La cantidad de compra es obligatoria');
        }
    };
    PurchaseDetail.prototype.validateUnitPrice = function (price) {
        if (!price) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El precio unitario es obligatorio');
        }
    };
    PurchaseDetail.prototype.validateProductId = function (productId) {
        if (!productId || productId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID del producto es obligatorio');
        }
    };
    PurchaseDetail.prototype.validatePurchaseId = function (purchaseId) {
        if (!purchaseId || purchaseId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID de la compra es obligatorio');
        }
    };
    Object.defineProperty(PurchaseDetail.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseDetail.prototype, "purchaseQuantity", {
        get: function () {
            return this._purchaseQuantity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseDetail.prototype, "purchaseUnitPrice", {
        get: function () {
            return this._purchaseUnitPrice;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseDetail.prototype, "productId", {
        get: function () {
            return this._productId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseDetail.prototype, "purchaseId", {
        get: function () {
            return this._purchaseId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseDetail.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseDetail.prototype, "updatedAt", {
        get: function () {
            return this._updatedAt;
        },
        enumerable: false,
        configurable: true
    });
    PurchaseDetail.prototype.update = function (params) {
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
    };
    PurchaseDetail.prototype.touchUpdatedAt = function () {
        this._updatedAt = new Date();
    };
    return PurchaseDetail;
}());
exports.PurchaseDetail = PurchaseDetail;
