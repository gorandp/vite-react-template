import { Hono, Context, Next } from "hono";
import { cors } from "hono/cors";
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
// import { handleRest } from './rest';
import { usersRoute } from "./users";
import { drinksRoute } from "./drinks";


export interface Env {
    DB: D1Database;
    SECRET: SecretsStoreSecret;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const app = new Hono<{ Bindings: Env }>();

        // Apply CORS to all routes
        app.use('*', async (c, next) => {
            return cors()(c, next);
        })

        // // Secret Store key value that we have set
        // const secret = await env.SECRET.get();

        // // Authentication middleware that verifies the Authorization header
        // // is sent in on each request and matches the value of our Secret key.
        // // If a match is not found we return a 401 and prevent further access.
        // const authMiddleware = async (c: Context, next: Next) => {
        //     const authHeader = c.req.header('Authorization');
        //     if (!authHeader) {
        //         return c.json({ error: 'Unauthorized' }, 401);
        //     }

        //     const token = authHeader.startsWith('Bearer ')
        //         ? authHeader.substring(7)
        //         : authHeader;

        //     if (token !== secret) {
        //         return c.json({ error: 'Unauthorized' }, 401);
        //     }

        //     return next();
        // };

        // CRUD REST endpoints made available to all of our tables
        // app.all('/api/*', authMiddleware, handleRest);
        app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

        app.route('/api/users', usersRoute);
        app.route('/api/drinks', drinksRoute);

        // // Execute a raw SQL statement with parameters with this route
        // app.post('/query', authMiddleware, async (c) => {
        //     try {
        //         const body = await c.req.json();
        //         const { query, params } = body;

        //         if (!query) {
        //             return c.json({ error: 'Query is required' }, 400);
        //         }

        //         // Execute the query against D1 database
        //         const results = await env.DB.prepare(query)
        //             .bind(...(params || []))
        //             .all();

        //         return c.json(results);
        //     } catch (error: any) {
        //         return c.json({ error: error.message }, 500);
        //     }
        // });

        return app.fetch(request, env, ctx);
    }
} satisfies ExportedHandler<Env>;

// const app = new Hono<{ Bindings: Env }>();

// app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// app.get("/api/drinks", (c) => {
//   const drinks = [
//     { id: "1", name: "Cerveza", price: 3000 },
//     { id: "2", name: "Fernet", price: 8000 },
//     { id: "3", name: "Vino", price: 4000 },
//   ];
//   return c.json(drinks);
// });

// app.get("/api/drinks/:id", (c) => {
//   const drinks = [
//     { id: "1", name: "Cerveza", price: 3000 },
//     { id: "2", name: "Fernet", price: 8000 },
//     { id: "3", name: "Vino", price: 4000 },
//   ];
//   const drink = drinks.find((drink) => drink.id === c.req.param("id"));
//   if (!drink) {
//     return c.notFound();
//   }
//   return c.json(drink);
// });


// export default app;
