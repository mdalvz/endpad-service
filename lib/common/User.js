"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Identifier_1 = require("./Identifier");
class User {
    constructor() {
        this.userId = (0, Identifier_1.generateLongIdentifier)();
        this.token = (0, Identifier_1.generateLongIdentifier)();
        this.active = true;
        this.index = 0;
        this.size = 0;
    }
}
exports.User = User;
