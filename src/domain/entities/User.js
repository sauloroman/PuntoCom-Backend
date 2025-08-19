"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var domain_error_1 = require("../errors/domain.error");
var User = /** @class */ (function () {
    function User(_a) {
        var _b = _a.id, id = _b === void 0 ? '' : _b, name = _a.name, lastname = _a.lastname, email = _a.email, password = _a.password, role = _a.role, _c = _a.isActive, isActive = _c === void 0 ? true : _c, _d = _a.isValidated, isValidated = _d === void 0 ? false : _d, _e = _a.image, image = _e === void 0 ? 'Usuario sin imagen' : _e, _f = _a.createdAt, createdAt = _f === void 0 ? new Date() : _f, _g = _a.updatedAt, updatedAt = _g === void 0 ? new Date() : _g;
        this.MESSAGE_ERROR = "USER_VALIDATION_ERROR";
        this._id = id;
        this._name = name;
        this._lastname = lastname;
        this._email = email;
        this._password = password;
        this._role = role;
        this._image = image;
        this._isActive = isActive;
        this._isValidated = isValidated;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this.validate();
    }
    User.prototype.validate = function () {
        this.validateName(this._name);
        this.validateLastname(this._lastname);
        this.validateImage(this._image);
    };
    User.prototype.validateName = function (name) {
        if (!name || name.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El nombre es obligatorio');
        }
        if (name.length > User.MAX_NAME_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "El nombre no puede exceder ".concat(User.MAX_NAME_LENGTH, " caracteres"));
        }
    };
    User.prototype.validateLastname = function (lastname) {
        if (!lastname || lastname.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El apellido es obligatorio');
        }
        if (lastname.length > User.MAX_LASTNAME_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "El apellido no puede exceder ".concat(User.MAX_LASTNAME_LENGTH, " caracteres"));
        }
    };
    User.prototype.validateImage = function (image) {
        if (image.length > User.MAX_IMAGE_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "La imagen no puede exceder ".concat(User.MAX_IMAGE_LENGTH, " caracteres"));
        }
    };
    Object.defineProperty(User.prototype, "id", {
        get: function () {
            var _a;
            return (_a = this._id) !== null && _a !== void 0 ? _a : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "lastname", {
        get: function () {
            return this._lastname;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "email", {
        get: function () {
            return this._email;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "password", {
        get: function () {
            return this._password;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "role", {
        get: function () {
            return this._role;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "isValidated", {
        get: function () {
            return this._isValidated;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "updatedAt", {
        get: function () {
            return this._updatedAt;
        },
        enumerable: false,
        configurable: true
    });
    User.prototype.activate = function () {
        this._isActive = true;
        this.touchUpdatedAt();
    };
    User.prototype.deactivate = function () {
        this._isActive = false;
        this.touchUpdatedAt();
    };
    User.prototype.update = function (params) {
        if (params.name !== undefined) {
            this.validateName(params.name);
            this._name = params.name;
        }
        if (params.lastname !== undefined) {
            this.validateLastname(params.lastname);
            this._lastname = params.lastname;
        }
        if (params.email !== undefined) {
            this._email = params.email;
        }
        if (params.password !== undefined) {
            this._password = params.password;
        }
        if (params.role !== undefined) {
            this._role = params.role;
        }
        if (params.image !== undefined) {
            this.validateImage(params.image);
            this._image = params.image;
        }
        if (params.isActive !== undefined) {
            this._isActive = params.isActive;
        }
        this.touchUpdatedAt();
    };
    User.prototype.touchUpdatedAt = function () {
        this._updatedAt = new Date();
    };
    User.MAX_NAME_LENGTH = 60;
    User.MAX_LASTNAME_LENGTH = 60;
    User.MAX_IMAGE_LENGTH = 200;
    return User;
}());
exports.User = User;
