"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleProductDetail = void 0;
var value_objects_1 = require("../value-objects");
var domain_error_1 = require("../errors/domain.error");
var SaleProductDetail = /** @class */ (function () {
    function SaleProductDetail(_a) {
        var id = _a.id, saleQuantity = _a.saleQuantity, saleUnitPrice = _a.saleUnitPrice, saleDiscount = _a.saleDiscount, productId = _a.productId, saleId = _a.saleId, _b = _a.createdAt, createdAt = _b === void 0 ? new Date() : _b, _c = _a.updatedAt, updatedAt = _c === void 0 ? new Date() : _c;
        this.MESSAGE_ERROR = "SALE_PRODUCT_DETAIL_VALIDATION_ERROR";
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
    SaleProductDetail.prototype.validate = function () {
        this.validateQuantity(this._saleQuantity);
        this.validateUnitPrice(this._saleUnitPrice);
        this.validateDiscount(this._saleDiscount);
        this.validateProductId(this._productId);
        this.validateSaleId(this._saleId);
    };
    SaleProductDetail.prototype.validateQuantity = function (quantity) {
        if (!quantity) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'La cantidad de venta es obligatoria');
        }
    };
    SaleProductDetail.prototype.validateUnitPrice = function (price) {
        if (!price) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El precio unitario es obligatorio');
        }
    };
    SaleProductDetail.prototype.validateDiscount = function (discount) {
        if (discount !== undefined && !(discount instanceof value_objects_1.Discount)) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'Descuento inválido');
        }
    };
    SaleProductDetail.prototype.validateProductId = function (productId) {
        if (!productId || productId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID del producto es obligatorio');
        }
    };
    SaleProductDetail.prototype.validateSaleId = function (saleId) {
        if (!saleId || saleId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID de la venta es obligatorio');
        }
    };
    Object.defineProperty(SaleProductDetail.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SaleProductDetail.prototype, "saleQuantity", {
        get: function () {
            return this._saleQuantity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SaleProductDetail.prototype, "saleUnitPrice", {
        get: function () {
            return this._saleUnitPrice;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SaleProductDetail.prototype, "saleDiscount", {
        get: function () {
            return this._saleDiscount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SaleProductDetail.prototype, "productId", {
        get: function () {
            return this._productId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SaleProductDetail.prototype, "saleId", {
        get: function () {
            return this._saleId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SaleProductDetail.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SaleProductDetail.prototype, "updatedAt", {
        get: function () {
            return this._updatedAt;
        },
        enumerable: false,
        configurable: true
    });
    SaleProductDetail.prototype.update = function (params) {
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
            }
            else {
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
    };
    SaleProductDetail.prototype.touchUpdatedAt = function () {
        this._updatedAt = new Date();
    };
    return SaleProductDetail;
}());
exports.SaleProductDetail = SaleProductDetail;
