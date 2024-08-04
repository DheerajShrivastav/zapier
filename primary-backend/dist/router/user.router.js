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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const client_1 = require("@prisma/client");
const types_1 = require("../types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const router = (0, express_1.Router)();
const client = new client_1.PrismaClient();
function isUserExist(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield client.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return false;
        }
        return true;
    });
}
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.SignupSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(400).send('Input is invalid');
    }
    if (yield isUserExist(parsedData.data.email)) {
        return res.status(400).send('User already exist');
    }
    else
        yield client.user.create({
            data: {
                name: parsedData.data.name,
                email: parsedData.data.email,
                password: parsedData.data.password,
            },
        });
    res.send('User created successfully');
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.SigninSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(400).send('Input is invalid');
    }
    const user = yield client.user.findFirst({
        where: {
            email: parsedData.data.email,
            password: parsedData.data.password,
        },
    });
    if (!user)
        return res.status(400).send('User does not exits');
    if (user) {
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            name: user.name,
        }, config_1.JWT_SECRET_KEY, { expiresIn: '2 days' });
        // return { user: { id: user.id, name: user.name }, token: token }
        return res
            .status(300)
            .json({
            token: token,
            message: 'User logged in successfully'
        });
    }
}));
router.get('/:id', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const id = parseInt(req.params.id, 10);
    console.log(id);
    if (!id) {
        return res.status(400).send('User does not exits');
    }
    const user = yield client.user.findFirst({
        where: {
            id: id,
        },
        select: {
            name: true,
            email: true,
        },
    });
    if (!user) {
        return res.status(404).send('User does not exist in the database');
    }
    return res.status(200).json({ user });
}));
exports.userRouter = router;
