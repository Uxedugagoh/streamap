import 'express-session'

declare module 'express-session' {
    interface SessionData {
        UserId?: string
        createdAt?: Date | string
    }
}