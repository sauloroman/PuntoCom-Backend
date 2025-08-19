"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegularExp = void 0;
var RegularExp = /** @class */ (function () {
    function RegularExp() {
    }
    RegularExp.EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    RegularExp.PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    RegularExp.PHONE_REGEX = /^[0-9\s\-()+]*$/;
    return RegularExp;
}());
exports.RegularExp = RegularExp;
