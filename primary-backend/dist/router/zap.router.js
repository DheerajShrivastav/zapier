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
exports.zapRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const client = new client_1.PrismaClient();
router.post('/', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const id = req.id;
    const body = req.body;
    const parseData = types_1.ZapCreateSchema.safeParse(body);
    if (!parseData.success) {
        return res.status(400).send('Invalid data');
    }
    yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zap = yield client.zap.create({
            data: {
                userId: parseInt(id),
                triggerId: '',
                actions: {
                    create: parseData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index,
                    })),
                },
            },
        });
        const trigger = yield client.trigger.create({
            data: {
                triggerId: parseData.data.availableTriggerId,
                zapId: zap.id,
            },
        });
        yield tx.zap.update({
            where: {
                id: zap.id,
            },
            data: {
                triggerId: trigger.id,
            },
        });
    }));
    return res.send('Zap created successfully');
}));
router.get('/', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //@ts-ignore
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const zaps = yield client.zap.findMany({
        where: {
            userId: id,
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true,
                },
            },
        }
    });
    return res.json({
        zaps
    });
}));
router.get('/:zapId', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // @ts-ignore
    const id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const zapId = req.params.zapId;
    const zap = yield client.zap.findFirst({
        where: {
            id: zapId,
            userId: id,
        },
        include: {
            actions: {
                include: {
                    type: true,
                },
            },
            trigger: {
                include: {
                    type: true,
                },
            },
        },
    });
    if (!zap) {
        return res.status(404).send('Zap not found');
    }
    return res.json({
        zap,
    });
}));
exports.zapRouter = router;
