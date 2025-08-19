"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.RoleEnum = void 0;
var domain_error_1 = require("../errors/domain.error");
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["Administrador"] = "Administrador";
    RoleEnum["Supervisor"] = "Supervisor";
    RoleEnum["Vendedor"] = "Vendedor";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var Role = /** @class */ (function () {
    function Role(role) {
        this.MESSAGE_ERROR = "ROLE_VALIDATION_ERROR";
        if (!Object.values(RoleEnum).includes(role)) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'Rol Inválido');
        }
        this._role = role;
    }
    Object.defineProperty(Role.prototype, "value", {
        get: function () {
            return this._role;
        },
        enumerable: false,
        configurable: true
    });
    Role.prototype.equals = function (other) {
        return this._role === other.value;
    };
    return Role;
}());
exports.Role = Role;
