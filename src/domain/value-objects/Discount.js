"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discount = void 0;
var domain_error_1 = require("../errors/domain.error");
var Discount = /** @class */ (function () {
    function Discount(amount) {
        this.MESSAGE_ERROR = "DISCOUNT_VALIDATION_ERROR";
        if (amount < 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El descuento no puede ser negativo');
        }
        this._amount = amount;
    }
    Object.defineProperty(Discount.prototype, "value", {
        get: function () {
            return this._amount;
        },
        enumerable: false,
        configurable: true
    });
    Discount.prototype.equals = function (other) {
        return this._amount === other.value;
    };
    return Discount;
}());
exports.Discount = Discount;
