import { Hono } from "hono";
import { Env } from "./index";
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { eq, sql } from 'drizzle-orm';


const drinksTable = sqliteTable('drinks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  price: real('price').notNull(),
});


export const drinksRoute = new Hono<{ Bindings: Env }>()
    .get("/", async (c) => {
        const db = drizzle(c.env.DB);
        console.log("Getting all drinks");
        const drinksList = await db.select().from(drinksTable).all();
        return c.json(drinksList);
    })
    .post("/add", async (c) => {
        const { name, price } = await c.req.json();
        if (!name) {
            return c.json({ error: "Name is required" }, 400);
        }
        const db = drizzle(c.env.DB);
        // check if drink already exists
        const existingDrink = await db.select()
            .from(drinksTable)
            .where(eq(drinksTable.name, name));
        if (existingDrink.length > 0) {
            // drink already exists
            return c.json({ error: "Drink already exists" }, 400);
        }
        // create drink
        const drink = {
            name,
            price,
        }
        const newDrink = await db.insert(drinksTable).values(drink).returning().get();
        return c.json(newDrink);
    })
    .post("/initTable", async (c) => {
        const db = drizzle(c.env.DB);
        // delete table if exists
        const dropRes = await db.run(sql`DROP TABLE IF EXISTS drinks`);
        // create table
        const createRes = await db.run(
            sql`CREATE TABLE IF NOT EXISTS drinks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL
            )`
        );
        // create test data
        const pop_drinks = [
            { name: "Cerveza",
              price: 4000.0, },
            { name: "Vino",
              price: 8000.0, },
            { name: "Fernet",
              price: 12000.0, },
            { name: "Gancia",
              price: 6000.0, },
            { name: "Whisky",
              price: 20000.0, },
        ]
        const data = await db.insert(drinksTable).values(pop_drinks).returning().get();
        // console.log(data)
        return c.json({dropRes, createRes, data});
    })
    .post("/update/:id{[0-9]+}", async (c) => {
        const drinkId = Number(c.req.param("id"));
        const { name, price } = await c.req.json();
        if (!name) {
            return c.json({ error: "Name is required" }, 400);
        }
        const db = drizzle(c.env.DB);
        // check if drink already exists
        const existingDrink = await db.select()
            .from(drinksTable)
            .where(eq(drinksTable.id, drinkId));
        if (existingDrink.length === 0) {
            // drink doesn't exist
            return c.json({ error: "Drink does not exist" }, 400);
        }
        const existingDrinkName = await db.select()
            .from(drinksTable)
            .where(eq(drinksTable.name, name));
        if (existingDrinkName.length > 0 && existingDrinkName[0].id !== drinkId) {
            // drink already exists
            return c.json({ error: "Drink name already exists to other drink object" }, 400);
        }
        // update drink
        const drink = {
            name,
            price,
        }
        const newDrink = await db.update(drinksTable)
            .set(drink)
            .where(eq(drinksTable.id, drinkId))
            .returning().get();
        return c.json(newDrink);
    })
    .post("/delete/:id{[0-9]+}", async (c) => {
        const drinkId = Number(c.req.param("id"));
        const db = drizzle(c.env.DB);
        // check if drink already exists
        const existingDrink = await db.select()
            .from(drinksTable)
            .where(eq(drinksTable.id, drinkId));
        if (existingDrink.length === 0) {
            // drink doesn't exist
            return c.json({ error: "Drink does not exist" }, 400);
        }
        // delete drink
        const deletedDrink = await db.delete(drinksTable)
            .where(eq(drinksTable.id, drinkId))
            .returning().get();
        return c.json(deletedDrink);
    })
    .get("/:id{[0-9]+}", async (c) => {
        //validate it is a number
        if (isNaN(Number(c.req.param("id")))) {
            return c.json({ error: "Invalid drink id" }, 400);
        }
        const drinkId = Number(c.req.param("id"));
        const db = drizzle(c.env.DB);
        // check if drink already exists
        const existingDrink = await db.select()
            .from(drinksTable)
            .where(eq(drinksTable.id, drinkId));
        if (existingDrink.length === 0) {
            // drink doesn't exist
            return c.json({ error: "Drink does not exist" }, 400);
        }
        return c.json(existingDrink[0]);
    });
