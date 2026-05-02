"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdSpacesController = void 0;
const common_1 = require("@nestjs/common");
const adspaces_service_1 = require("./adspaces.service");
const create_adspace_dto_1 = require("./dto/create-adspace.dto");
const update_adspace_dto_1 = require("./dto/update-adspace.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
let AdSpacesController = class AdSpacesController {
    constructor(adSpacesService) {
        this.adSpacesService = adSpacesService;
    }
    async findAll(location, type, minPrice, maxPrice, isAvailable) {
        return this.adSpacesService.findAll({
            location,
            type,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
        });
    }
    async findById(id) {
        return this.adSpacesService.findById(id);
    }
    async create(user, dto) {
        return this.adSpacesService.create(user.id, user.role, dto);
    }
    async update(id, user, dto) {
        return this.adSpacesService.update(id, user.id, user.role, dto);
    }
};
exports.AdSpacesController = AdSpacesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('location')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('minPrice')),
    __param(3, (0, common_1.Query)('maxPrice')),
    __param(4, (0, common_1.Query)('isAvailable')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdSpacesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdSpacesController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.PROVIDER, enums_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_adspace_dto_1.CreateAdSpaceDto]),
    __metadata("design:returntype", Promise)
], AdSpacesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.PROVIDER, enums_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_adspace_dto_1.UpdateAdSpaceDto]),
    __metadata("design:returntype", Promise)
], AdSpacesController.prototype, "update", null);
exports.AdSpacesController = AdSpacesController = __decorate([
    (0, common_1.Controller)('adspaces'),
    __metadata("design:paramtypes", [adspaces_service_1.AdSpacesService])
], AdSpacesController);
//# sourceMappingURL=adspaces.controller.js.map