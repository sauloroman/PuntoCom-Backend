"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var domain_error_1 = require("../errors/domain.error");
var Product = /** @class */ (function () {
    function Product(_a) {
        var id = _a.id, name = _a.name, _b = _a.description, description = _b === void 0 ? 'Producto sin descripción' : _b, _c = _a.image, image = _c === void 0 ? 'Producto sin imagen' : _c, code = _a.code, sellingPrice = _a.sellingPrice, stock = _a.stock, stockMin = _a.stockMin, categoryId = _a.categoryId, supplierId = _a.supplierId, _d = _a.isActive, isActive = _d === void 0 ? true : _d, _e = _a.createdAt, createdAt = _e === void 0 ? new Date() : _e, _f = _a.updatedAt, updatedAt = _f === void 0 ? new Date() : _f;
        this.MESSAGE_ERROR = "PRODUCT_VALIDATION_ERROR";
        this._id = id;
        this._name = name;
        this._description = description;
        this._image = image;
        this._code = code;
        this._sellingPrice = sellingPrice;
        this._stock = stock;
        this._stockMin = stockMin;
        this._categoryId = categoryId;
        this._supplierId = supplierId;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this.validate();
    }
    Product.prototype.validate = function () {
        this.validateName(this._name);
        this.validateDescription(this._description);
        this.validateImage(this._image);
        this.validateCategoryId(this._categoryId);
        this.validateSupplierId(this._supplierId);
        this.validateStockConsistency(this._stock, this._stockMin);
    };
    Product.prototype.validateName = function (name) {
        if (!name || name.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El nombre del producto es obligatorio');
        }
        if (name.length > Product.MAX_NAME_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "El nombre no puede exceder ".concat(Product.MAX_NAME_LENGTH, " caracteres"));
        }
    };
    Product.prototype.validateDescription = function (description) {
        if (description.trim().length > Product.MAX_DESCRIPTION_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "La descripci\u00F3n no puede exceder ".concat(Product.MAX_DESCRIPTION_LENGTH, " caracteres"));
        }
    };
    Product.prototype.validateImage = function (image) {
        if (image.trim().length > Product.MAX_IMAGE_LENGTH) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, "La URL de la imagen no puede exceder ".concat(Product.MAX_IMAGE_LENGTH, " caracteres"));
        }
    };
    Product.prototype.validateCategoryId = function (categoryId) {
        if (!categoryId || categoryId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID de categoría es obligatorio');
        }
    };
    Product.prototype.validateSupplierId = function (supplierId) {
        if (!supplierId || supplierId.trim().length === 0) {
            throw new domain_error_1.DomainError(this.MESSAGE_ERROR, 'El ID de proveedor es obligatorio');
        }
    };
    Product.prototype.validateStockConsistency = function (stock, stockMin) {
        if (stockMin.value > stock.value) {
            throw new Error('El stock mínimo no puede ser mayor que el stock actual');
        }
    };
    Object.defineProperty(Product.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "code", {
        get: function () {
            return this._code;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "sellingPrice", {
        get: function () {
            return this._sellingPrice;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "stock", {
        get: function () {
            return this._stock;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "stockMin", {
        get: function () {
            return this._stockMin;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "categoryId", {
        get: function () {
            return this._categoryId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "supplierId", {
        get: function () {
            return this._supplierId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "updatedAt", {
        get: function () {
            return this._updatedAt;
        },
        enumerable: false,
        configurable: true
    });
    Product.prototype.update = function (params) {
        if (params.name !== undefined) {
            this.validateName(params.name);
            this._name = params.name.trim();
        }
        if (params.description !== undefined) {
            this.validateDescription(params.description);
            this._description = params.description;
        }
        if (params.image !== undefined) {
            this.validateImage(params.image);
            this._image = params.image;
        }
        if (params.code !== undefined) {
            this._code = params.code;
        }
        if (params.sellingPrice !== undefined) {
            this._sellingPrice = params.sellingPrice;
        }
        if (params.stock !== undefined) {
            this._stock = params.stock;
        }
        if (params.stockMin !== undefined) {
            this._stockMin = params.stockMin;
        }
        if (params.categoryId !== undefined) {
            this.validateCategoryId(params.categoryId);
            this._categoryId = params.categoryId;
        }
        if (params.supplierId !== undefined) {
            this.validateSupplierId(params.supplierId);
            this._supplierId = params.supplierId;
        }
        if (params.isActive !== undefined) {
            this._isActive = params.isActive;
        }
        this.touchUpdatedAt();
    };
    Product.prototype.touchUpdatedAt = function () {
        this._updatedAt = new Date();
    };
    Product.MAX_NAME_LENGTH = 100;
    Product.MAX_DESCRIPTION_LENGTH = 220;
    Product.MAX_IMAGE_LENGTH = 200;
    return Product;
}());
exports.Product = Product;
