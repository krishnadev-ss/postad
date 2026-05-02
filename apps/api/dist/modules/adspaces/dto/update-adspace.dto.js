"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdSpaceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_adspace_dto_1 = require("./create-adspace.dto");
class UpdateAdSpaceDto extends (0, mapped_types_1.PartialType)(create_adspace_dto_1.CreateAdSpaceDto) {
}
exports.UpdateAdSpaceDto = UpdateAdSpaceDto;
//# sourceMappingURL=update-adspace.dto.js.map