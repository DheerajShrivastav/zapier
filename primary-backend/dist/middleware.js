"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const config_1 = require("./config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY);
        // @ts-ignore
        req.id = payload.id;
        next();
    }
    catch (error) {
        return res.status(400).send({
            message: "your are not logged in"
        });
    }
}
exports.authMiddleware = authMiddleware;
