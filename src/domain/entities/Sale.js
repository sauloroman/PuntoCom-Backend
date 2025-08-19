"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sale = void 0;
var domain_error_1 = require("../errors/domain.error");
var Sale = /** @class */ (function () {
    function Sale(_a) {
        var id = _a.id, _b = _a.date, date = _b === void 0 ? new Date() : _b, total = _a.total, userId = _a.userId, _c = _a.createdAt, createdAt = _c === void 0 ? new Date() : _c, _d = _a.updatedAt, updatedAt = _d === void 0 ? new Date() : _d;
        this.MESSAGE_ERROR = "SALE_VALIDATION_ERROR";
        this._id = id;
        this._date = date;
        this._total = total;
        this._userId = userId;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this.validate();
    }
    Sale.prototype.validate = function () {
        this.validateDate(this._date);
        this.validateTotal(this._total);
        this.validateUserId(this._userId);
    };
    Sale.prototype.validateDate = function (date) {
        if (!date || !(date instanceof Date)) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'La fecha de la venta no es válida');
        }
    };
    Sale.prototype.validateTotal = function (total) {
        if (!total) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El total de la venta es obligatorio');
        }
    };
    Sale.prototype.validateUserId = function (userId) {
        if (!userId || userId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID del usuario es obligatorio');
        }
    };
    Object.defineProperty(Sale.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sale.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sale.prototype, "total", {
        get: function () {
            return this._total;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sale.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sale.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sale.prototype, "updatedAt", {
        get: function () {
            return this._updatedAt;
        },
        enumerable: false,
        configurable: true
    });
    Sale.prototype.update = function (params) {
        if (params.date !== undefined) {
            this.validateDate(params.date);
            this._date = params.date;
        }
        if (params.total !== undefined) {
            this.validateTotal(params.total);
            this._total = params.total;
        }
        if (params.userId !== undefined) {
            this.validateUserId(params.userId);
            this._userId = params.userId;
        }
        this.touchUpdatedAt();
    };
    Sale.prototype.touchUpdatedAt = function () {
        this._updatedAt = new Date();
    };
    return Sale;
}());
exports.Sale = Sale;
