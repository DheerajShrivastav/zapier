import { NextFunction, Request, Response } from "express";
import { JWT_SECRET_KEY } from "./config";
import jwt from "jsonwebtoken";
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as unknown as string
    try {
        const payload = jwt.verify(token, JWT_SECRET_KEY)
        // @ts-ignore
        req.id = payload.id
        next()  
    } catch (error) {
        return res.status(400).send({
            message: "your are not logged in"
        })
        }
    }