import { Hono } from "hono";
import { Env } from "./index";
import { drizzle } from 'drizzle-orm/d1';
import { decode, sign, verify } from 'hono/jwt'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { eq, sql } from 'drizzle-orm';


const authTable = sqliteTable('auth', {
  username: text('username').primaryKey(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  roles: text('roles').notNull(),
  isActive: integer('isActive').notNull(),
  isDeleted: integer('isDeleted').notNull(),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
  deletedAt: text('deletedAt'),
});


export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "Authorization header is required" }, 401);
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return c.json({ error: "Token is required" }, 401);
  }
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("user", payload);
    return next();
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
};


const hashPassword = async (password: string) => {
  const hashedPassword = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)).then((hash) => {
    const hashArray = Array.from(new Uint8Array(hash)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    return hashHex;
  });
  return hashedPassword;
}


export const authRoute = new Hono<{ Bindings: Env }>()
  .post("/login", async (c) => {
    const { username, password } = await c.req.json();
    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }
    const db = drizzle(c.env.DB);
    // check if username already exists
    const existingUser = await db.select()
      .from(authTable)
      .where(eq(authTable.username, username));
    if (existingUser.length === 0) {
      // user already exists
      return c.json({ error: "User does not exist" }, 400);
    }
    // check password
    const user = existingUser[0];
    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) {
      return c.json({ error: "Invalid password" }, 400);
    }
    // create JWT token
    const token = sign({
        username,
        roles: user.roles,
        name: user.name,
      },
      c.env.JWT_SECRET, "HS256"
    );
    // return token
    return c.json({ token });
  })
  .post("/initTable", async (c) => {
    const db = drizzle(c.env.DB);
    // delete table if exists
    const dropRes = await db.run(sql`DROP TABLE IF EXISTS auth`);
    // create table
    const createRes = await db.run(
      sql`CREATE TABLE IF NOT EXISTS auth (
        username TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        roles TEXT NOT NULL,
        isActive INTEGER NOT NULL,
        isDeleted INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      )`
    );
    // create test data
    const pop_auth = [
      {
        username: "admin",
        name: "Administrator",
        password: await hashPassword("admin123"),
        roles: JSON.stringify(["admin"]),
        isActive: 1,
        isDeleted: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
      {
        username: "user",
        name: "Regular User",
        password: await hashPassword("user123"),
        roles: JSON.stringify(["user"]),
        isActive: 1,
        isDeleted: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
    ];
    const data = await db.insert(authTable).values(pop_auth).returning().get();
    // console.log(data)
    return c.json({ dropRes, createRes, data });
  })
