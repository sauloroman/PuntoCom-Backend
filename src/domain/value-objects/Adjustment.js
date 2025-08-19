"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustmentType = exports.AdjustmentEnum = void 0;
var domain_error_1 = require("../errors/domain.error");
var AdjustmentEnum;
(function (AdjustmentEnum) {
    AdjustmentEnum["ENTRADA"] = "entrada";
    AdjustmentEnum["SALIDA"] = "salida";
})(AdjustmentEnum || (exports.AdjustmentEnum = AdjustmentEnum = {}));
var AdjustmentType = /** @class */ (function () {
    function AdjustmentType(value) {
        this.MESSAGE_ERROR = "ADJUSTMENTTYPE_VALIDATION_ERROR";
        if (!Object.values(AdjustmentEnum).includes(value)) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "Tipo de ajuste inv\u00E1lido");
        }
        this._value = value;
    }
    Object.defineProperty(AdjustmentType.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    AdjustmentType.prototype.equals = function (other) {
        return this._value === other.value;
    };
    return AdjustmentType;
}());
exports.AdjustmentType = AdjustmentType;
