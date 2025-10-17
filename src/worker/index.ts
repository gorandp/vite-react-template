import { Hono } from "hono";
// import { Context, Next } from "hono";
import { cors } from "hono/cors";
// import { drizzle } from 'drizzle-orm/d1';
// import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
// import { sql } from 'drizzle-orm';
// import { handleRest } from './rest';
import { authRoute } from "./auth";
import { usersRoute } from "./users";
import { productsRoute } from "./products";
import { salesRoute } from "./sales";
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'


export interface Env {
    DB: D1Database;
    JWT_SECRET: string;
}
type Variables = JwtVariables


export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const app = new Hono<{ Bindings: Env, Variables: Variables }>();

        // Apply CORS to all routes
        app.use('*', async (c, next) => {
            return cors()(c, next);
        })
        app.use('/api/*', (c, next) => {
            if (c.req.path === '/api/auth/login' && c.req.method === 'POST') {
                console.log("Skipping auth for login");
                return next();
            }
            const jwtMiddleware = jwt({
                secret: c.env.JWT_SECRET,
            })
            return jwtMiddleware(c, next)
        })
        app.get('/api/authTest', (c) => {
            return c.text('You are authorized')
        })

        app.route('/api/auth', authRoute);
        app.route('/api/users', usersRoute);
        app.route('/api/products', productsRoute);
        app.route('/api/sales', salesRoute);

        return app.fetch(request, env, ctx);
    }
} satisfies ExportedHandler<Env>;
