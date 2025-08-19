"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
var domain_error_1 = require("../errors/domain.error");
var Money = /** @class */ (function () {
    function Money(amount) {
        this.MESSAGE_ERROR = "MONEY_VALIDATION_ERROR";
        if (isNaN(amount) || amount <= 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El precio debe ser un número positivo');
        }
        this._amount = parseFloat(amount.toFixed(Money.QUANTITY_DECIMALS));
    }
    Object.defineProperty(Money.prototype, "value", {
        get: function () {
            return this._amount;
        },
        enumerable: false,
        configurable: true
    });
    Money.prototype.equals = function (other) {
        return this._amount === other.value;
    };
    Money.QUANTITY_DECIMALS = 2;
    return Money;
}());
exports.Money = Money;
