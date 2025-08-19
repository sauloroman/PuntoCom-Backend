"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
var domain_error_1 = require("../errors/domain.error");
var Password = /** @class */ (function () {
    function Password(hashedValue) {
        this.MESSAGE_ERROR = "PASSWORD_VALIDATION_ERROR";
        if (!hashedValue || hashedValue.length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'Hash de contraseña inválido.');
        }
        this._hashedValue = hashedValue;
    }
    Object.defineProperty(Password.prototype, "value", {
        get: function () {
            return this._hashedValue;
        },
        enumerable: false,
        configurable: true
    });
    Password.prototype.equals = function (other) {
        return this._hashedValue === other.value;
    };
    return Password;
}());
exports.Password = Password;
