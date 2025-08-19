"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = void 0;
var domain_error_1 = require("../errors/domain.error");
var Purchase = /** @class */ (function () {
    function Purchase(_a) {
        var id = _a.id, _b = _a.date, date = _b === void 0 ? new Date() : _b, total = _a.total, supplierId = _a.supplierId, userId = _a.userId, _c = _a.createdAt, createdAt = _c === void 0 ? new Date() : _c, _d = _a.updatedAt, updatedAt = _d === void 0 ? new Date() : _d;
        this.MESSAGE_ERROR = "PURCHASE_VALIDATION_ERROR";
        this._id = id;
        this._date = date;
        this._total = total;
        this._supplierId = supplierId;
        this._userId = userId;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this.validate();
    }
    Purchase.prototype.validate = function () {
        this.validateTotal(this._total);
        this.validateSupplierId(this._supplierId);
        this.validateUserId(this._userId);
    };
    Purchase.prototype.validateTotal = function (total) {
        if (!total) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El total de la compra es obligatorio');
        }
    };
    Purchase.prototype.validateSupplierId = function (supplierId) {
        if (!supplierId || supplierId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID del proveedor es obligatorio');
        }
    };
    Purchase.prototype.validateUserId = function (userId) {
        if (!userId || userId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID del usuario es obligatorio');
        }
    };
    Object.defineProperty(Purchase.prototype, "id", {
        // Getters
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Purchase.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Purchase.prototype, "total", {
        get: function () {
            return this._total;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Purchase.prototype, "supplierId", {
        get: function () {
            return this._supplierId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Purchase.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Purchase.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Purchase.prototype, "updatedAt", {
        get: function () {
            return this._updatedAt;
        },
        enumerable: false,
        configurable: true
    });
    // Método para actualizar datos
    Purchase.prototype.update = function (params) {
        if (params.date !== undefined) {
            this._date = params.date;
        }
        if (params.total !== undefined) {
            this.validateTotal(params.total);
            this._total = params.total;
        }
        if (params.supplierId !== undefined) {
            this.validateSupplierId(params.supplierId);
            this._supplierId = params.supplierId;
        }
        if (params.userId !== undefined) {
            this.validateUserId(params.userId);
            this._userId = params.userId;
        }
        this.touchUpdatedAt();
    };
    Purchase.prototype.touchUpdatedAt = function () {
        this._updatedAt = new Date();
    };
    return Purchase;
}());
exports.Purchase = Purchase;
