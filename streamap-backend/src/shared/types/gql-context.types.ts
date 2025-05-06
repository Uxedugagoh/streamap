import type { Request, Response } from "express";

// Получение данных запроса
export interface GqlContext {
    req: Request
    res: Response
}