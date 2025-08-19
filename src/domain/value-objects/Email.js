"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
var utils_1 = require("../../config/utils");
var domain_error_1 = require("../errors/domain.error");
var Email = /** @class */ (function () {
    function Email(email) {
        this._emailRegex = utils_1.RegularExp.EMAIL_REGEX;
        this.MESSAGE_ERROR = "EMAIL_VALIDATION_ERROR";
        if (!this._emailRegex.test(email)) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'Email inválido');
        }
        this._value = email.toLowerCase();
    }
    Object.defineProperty(Email.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    Email.prototype.equals = function (other) {
        return this._value === other.value;
    };
    return Email;
}());
exports.Email = Email;
