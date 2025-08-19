"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supplier = void 0;
var domain_error_1 = require("../errors/domain.error");
var Supplier = /** @class */ (function () {
    function Supplier(_a) {
        var id = _a.id, name = _a.name, lastname = _a.lastname, company = _a.company, email = _a.email, phone = _a.phone, _b = _a.address, address = _b === void 0 ? 'Proveedor sin dirección' : _b, _c = _a.isActive, isActive = _c === void 0 ? true : _c, _d = _a.createdAt, createdAt = _d === void 0 ? new Date() : _d, _e = _a.updatedAt, updatedAt = _e === void 0 ? new Date() : _e;
        this.MESSAGE_ERROR = "SUPPLIER_VALIDATION_ERROR";
        this._id = id;
        this._name = name;
        this._lastname = lastname;
        this._company = company;
        this._phone = phone;
        this._email = email;
        this._address = address;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this.validate();
    }
    Supplier.prototype.validate = function () {
        this.validateName(this._name);
        this.validateLastname(this._lastname);
        this.validateCompany(this._company);
        this.validateAddress(this._address);
    };
    Supplier.prototype.validateName = function (name) {
        if (!name || name.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El nombre es obligatorio');
        }
        if (name.length > Supplier.MAX_NAME_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "El nombre no puede exceder ".concat(Supplier.MAX_NAME_LENGTH, " caracteres"));
        }
    };
    Supplier.prototype.validateLastname = function (lastname) {
        if (!lastname || lastname.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El apellido es obligatorio');
        }
        if (lastname.length > Supplier.MAX_LASTNAME_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "El apellido no puede exceder ".concat(Supplier.MAX_LASTNAME_LENGTH, " caracteres"));
        }
    };
    Supplier.prototype.validateCompany = function (company) {
        if (!company || company.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'La compañía es obligatoria');
        }
        if (company.length > Supplier.MAX_COMPANY_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "La compa\u00F1\u00EDa no puede exceder ".concat(Supplier.MAX_COMPANY_LENGTH, " caracteres"));
        }
    };
    Supplier.prototype.validateAddress = function (address) {
        if (address.length > Supplier.MAX_ADDRESS_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "La direcci\u00F3n no puede exceder ".concat(Supplier.MAX_ADDRESS_LENGTH, " caracteres"));
        }
    };
    Object.defineProperty(Supplier.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Supplier.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Supplier.prototype, "lastname", {
        get: function () {
            return this._lastname;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Supplier.prototype, "company", {
        get: function () {
            return this._company;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Supplier.prototype, "phone", {
        get: function () {
            return this._phone;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Supplier.prototype, "email", {
        get: function () {
            return this._email;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Supplier.prototype, "address", {
        get: function () {
            return this._address;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Supplier.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Supplier.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Supplier.prototype, "updatedAt", {
        get: function () {
            return this._updatedAt;
        },
        enumerable: false,
        configurable: true
    });
    Supplier.prototype.activate = function () {
        this._isActive = true;
        this.touchUpdatedAt();
    };
    Supplier.prototype.deactivate = function () {
        this._isActive = false;
        this.touchUpdatedAt();
    };
    Supplier.prototype.update = function (params) {
        if (params.name !== undefined) {
            this.validateName(params.name);
            this._name = params.name;
        }
        if (params.lastname !== undefined) {
            this.validateLastname(params.lastname);
            this._lastname = params.lastname;
        }
        if (params.company !== undefined) {
            this.validateCompany(params.company);
            this._company = params.company;
        }
        if (params.phone !== undefined) {
            this._phone = params.phone;
        }
        if (params.email !== undefined) {
            this._email = params.email;
        }
        if (params.address !== undefined) {
            this.validateAddress(params.address);
            this._address = params.address;
        }
        if (params.isActive !== undefined) {
            this._isActive = params.isActive;
        }
        this.touchUpdatedAt();
    };
    Supplier.prototype.touchUpdatedAt = function () {
        this._updatedAt = new Date();
    };
    Supplier.MAX_NAME_LENGTH = 100;
    Supplier.MAX_LASTNAME_LENGTH = 100;
    Supplier.MAX_COMPANY_LENGTH = 100;
    Supplier.MAX_ADDRESS_LENGTH = 200;
    return Supplier;
}());
exports.Supplier = Supplier;
