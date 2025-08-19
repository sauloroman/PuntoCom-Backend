"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
var utils_1 = require("../../config/utils");
var domain_error_1 = require("../errors/domain.error");
var Phone = /** @class */ (function () {
    function Phone(phone) {
        this._phoneRegex = utils_1.RegularExp.PHONE_REGEX;
        this.MESSAGE_ERROR = "PHONE_VALIDATION_ERROR";
        if (phone.length > Phone.MAX_PHONE_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "El tel\u00E9fono no puede exceder ".concat(Phone.MAX_PHONE_LENGTH, " caracteres"));
        }
        if (this._phoneRegex.test(phone)) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "El tel\u00E9fono tiene un formato inv\u00E1lido");
        }
        this._phone = phone;
    }
    Object.defineProperty(Phone.prototype, "value", {
        get: function () {
            return this._phone;
        },
        enumerable: false,
        configurable: true
    });
    Phone.prototype.equals = function (other) {
        return this._phone === other.value;
    };
    Phone.MAX_PHONE_LENGTH = 12;
    return Phone;
}());
exports.Phone = Phone;
