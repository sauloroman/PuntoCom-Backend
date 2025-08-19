"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quantity = void 0;
var domain_error_1 = require("../errors/domain.error");
var Quantity = /** @class */ (function () {
    function Quantity(value) {
        this.MESSAGE_ERROR = "QUANTITY_VALIDATION_ERROR";
        if (!Number.isInteger(value) || value <= 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'La cantidad debe ser un número entero positivo');
        }
        this._value = value;
    }
    Object.defineProperty(Quantity.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    Quantity.prototype.equals = function (other) {
        return this._value === other.value;
    };
    return Quantity;
}());
exports.Quantity = Quantity;
