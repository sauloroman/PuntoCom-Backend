"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
var domain_error_1 = require("../errors/domain.error");
var Stock = /** @class */ (function () {
    function Stock(quantity) {
        this.MESSAGE_ERROR = "STOCK_VALIDATION_ERROR";
        if (!Number.isInteger(quantity) || quantity < 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El stock debe ser un número entero no negativo');
        }
        this._quantity = quantity;
    }
    Object.defineProperty(Stock.prototype, "value", {
        get: function () {
            return this._quantity;
        },
        enumerable: false,
        configurable: true
    });
    Stock.prototype.equals = function (other) {
        return this._quantity === other.value;
    };
    return Stock;
}());
exports.Stock = Stock;
