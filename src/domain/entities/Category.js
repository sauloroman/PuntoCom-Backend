"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
var domain_error_1 = require("../errors/domain.error");
var Category = /** @class */ (function () {
    function Category(_a) {
        var _b = _a.id, id = _b === void 0 ? '' : _b, name = _a.name, _c = _a.description, description = _c === void 0 ? 'Categoría sin descripción' : _c, _d = _a.icon, icon = _d === void 0 ? 'Categoría sin ícono' : _d, _e = _a.isActive, isActive = _e === void 0 ? true : _e, _f = _a.createdAt, createdAt = _f === void 0 ? new Date() : _f, _g = _a.updatedAt, updatedAt = _g === void 0 ? new Date() : _g;
        this.MESSAGE_ERROR = "CATEGORY_VALIDATION_ERROR";
        this._id = id;
        this._name = name;
        this._description = description;
        this._icon = icon;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this.validate();
    }
    Category.prototype.validate = function () {
        this.validateName(this._name);
        this.validateDescription(this._description);
        this.validateIcon(this._icon);
    };
    Category.prototype.validateName = function (name) {
        if (!name || name.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El nombre de la categoría es obligatorio');
        }
        if (name.length > Category.MAX_NAME_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "El nombre de la categor\u00EDa no puede exceder ".concat(Category.MAX_NAME_LENGTH, " caracteres"));
        }
    };
    Category.prototype.validateDescription = function (description) {
        if (description.length > Category.MAX_DESCRIPTION_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "La descripci\u00F3n no puede exceder ".concat(Category.MAX_DESCRIPTION_LENGTH, " caracteres"));
        }
    };
    Category.prototype.validateIcon = function (icon) {
        if (icon.length > Category.MAX_ICON_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "El icono no puede exceder ".concat(Category.MAX_ICON_LENGTH, " caracteres"));
        }
    };
    Object.defineProperty(Category.prototype, "id", {
        get: function () {
            var _a;
            return (_a = this._id) !== null && _a !== void 0 ? _a : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "updatedAt", {
        get: function () {
            return this._updatedAt;
        },
        enumerable: false,
        configurable: true
    });
    Category.prototype.activate = function () {
        this._isActive = true;
        this.touchUpdatedAt();
    };
    Category.prototype.deactivate = function () {
        this._isActive = false;
        this.touchUpdatedAt();
    };
    Category.prototype.update = function (params) {
        if (params.name !== undefined) {
            this.validateName(params.name);
            this._name = params.name;
        }
        if (params.description !== undefined) {
            this.validateDescription(params.description);
            this._description = params.description;
        }
        if (params.icon !== undefined) {
            this.validateIcon(params.icon);
            this._icon = params.icon;
        }
        if (params.isActive !== undefined) {
            this._isActive = params.isActive;
        }
        this.touchUpdatedAt();
    };
    Category.prototype.touchUpdatedAt = function () {
        this._updatedAt = new Date();
    };
    Category.MAX_NAME_LENGTH = 100;
    Category.MAX_DESCRIPTION_LENGTH = 220;
    Category.MAX_ICON_LENGTH = 200;
    return Category;
}());
exports.Category = Category;
