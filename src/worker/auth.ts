import { Hono } from "hono";
import { Env } from "./index";
import { drizzle } from 'drizzle-orm/d1';
import { sign } from 'hono/jwt'
import { eq } from 'drizzle-orm';
import { users } from './db/schema'


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
      .from(users)
      .where(eq(users.id, username));
    if (existingUser.length === 0) {
      // user already exists
      return c.json({ error: "User does not exist" }, 400);
    }
    // check password
    const user = existingUser[0];
    const hashedPassword = await hashPassword(password);
    console.log("Hashed password:", hashedPassword)
    if (user.password_hash !== hashedPassword) {
      return c.json({ error: "Invalid password" }, 400);
    }
    // create JWT token
    const token = await sign({
        username,
        roles: user.roles,
        name: user.name,
      },
      c.env.JWT_SECRET, "HS256"
    );
    return c.json({ token });
  })
