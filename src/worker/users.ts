import { Hono } from "hono";
import { Env } from "./index";
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { eq, sql } from 'drizzle-orm';


const usersTable = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    password: text('password').notNull(),
    createdAt: text('createdAt').notNull(),
    updatedAt: text('updatedAt').notNull(),
    roles: text('roles'),
    active: integer('active').notNull(),
});


export const usersRoute = new Hono<{ Bindings: Env }>()
    .get("/", async (c) => {
        const db = drizzle(c.env.DB);
        console.log("Getting all users");
        const users = await db.select().from(usersTable).all();
        return c.json(users);
    })
    .post("/", async (c) => {
        const { name, password, roles } = await c.req.json();
        if (!name) {
            return c.json({ error: "Name is required" }, 400);
        }
        const db = drizzle(c.env.DB);
        // check if username already exists
        const existingUser = await db.select()
            .from(usersTable)
            .where(eq(usersTable.name, name));
        if (existingUser.length > 0) {
            // user already exists
            return c.json({ error: "User already exists" }, 400);
        }
        // create user
        const user = {
            name,
            // hash password
            password: await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)).then((hash) => {
                const hashArray = Array.from(new Uint8Array(hash)); // convert buffer to byte array
                const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
                return hashHex;
            }),
            roles: roles ? roles.join(",") : "guest",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            active: 1,
        }
        const newUser = await db.insert(usersTable).values(user).returning().get();
        return c.json(newUser);
    })
    .get("/initTable", async (c) => {
        const db = drizzle(c.env.DB);
        // delete table if exists
        // console.log("Deleting table");
        const dropRes = await db.run(sql`DROP TABLE IF EXISTS users`);
        // console.log("Table deleted");
        // console.log("Creating table");
        const createRes = await db.run(
            sql`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                password TEXT NOT NULL,
                roles TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                active INTEGER NOT NULL
            )`
        );
        // console.log("Table created");
        // console.log("Creating user");
        const user = {
            name: "goran",
            password: "goran",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            roles: "admin,salesman",
            active: 1,
        }
        const newUser = await db.insert(usersTable).values(user).returning().get();
        // console.log(newUser)
        return c.json({dropRes, createRes, newUser});
    })
    .get("/:name", async (c) => {
        // console.log("Getting user");
        const { name } = c.req.param();
        const user = await c.env.DB.prepare(`SELECT * FROM users WHERE name = ${name}`).first();
        if (!user) {
            return c.notFound();
        }
        return c.json(user);
    });
