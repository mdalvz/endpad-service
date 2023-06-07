"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSessionHandler = exports.connectSession = void 0;
const endpad_model_1 = require("endpad-model");
const Handler_1 = require("../common/Handler");
const Manager_1 = require("../common/Manager");
function connectSession(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let session = Manager_1.Manager.instance.getSession(request.sessionId);
        let { userId, token } = session.createUser();
        return { userId, token };
    });
}
exports.connectSession = connectSession;
exports.connectSessionHandler = (0, Handler_1.operationHandler)(connectSession, endpad_model_1.ConnectSessionRequestSchema);
