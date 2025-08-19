"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCode = void 0;
var domain_error_1 = require("../errors/domain.error");
var ProductCode = /** @class */ (function () {
    function ProductCode(value) {
        this.MESSAGE_ERROR = "PRODUCT_CODE_VALIDATION_ERROR";
        var code = value.trim();
        if (!/^\d+$/.test(code)) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El código del producto debe ser un número entero positivo');
        }
        if (code.length > ProductCode.MAX_QUANTITY_CHARACTERS) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El código del producto no puede tener más de 15 dígitos');
        }
        this._value = code;
    }
    Object.defineProperty(ProductCode.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    ProductCode.prototype.equals = function (other) {
        return this._value === other.value;
    };
    ProductCode.MAX_QUANTITY_CHARACTERS = 15;
    return ProductCode;
}());
exports.ProductCode = ProductCode;
