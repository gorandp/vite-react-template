import { Hono } from "hono";
import { Env } from "./index";
import { drizzle } from 'drizzle-orm/d1';
import { eq, sql } from 'drizzle-orm';
import { products } from "./db/schema";


export const productsRoute = new Hono<{ Bindings: Env }>()
    .get("/", async (c) => {
        const db = drizzle(c.env.DB);
        console.log("Getting all products");
        const productsList = await db.select().from(products).all();
        return c.json(productsList);
    })
    .post("/add", async (c) => {
        const { 
            name,
            unit,
            primary_products,
            active,
            buy_price,
            sell_price,
            stock,
         } = await c.req.json();
        if ( !name || !unit || !buy_price || !sell_price) {
            return c.json(
                { error: "name/unit/buy_price/sell_price are required",
                  errorEs: "name/unit/buy_price/sell_price son requeridos" }, 400);
        }
        const productId = name.toLowerCase().slice(0, 36)
                    .replaceAll(
                        RegExp(`[\[|\]|\(|\)|,|\.|-| |\\|/|<|>]`),
                        "_");
        const db = drizzle(c.env.DB);
        // check if product already exists
        const existingProduct = await db.select()
            .from(products)
            .where(eq(products.id, productId));
        if (existingProduct.length > 0) {
            // product already exists
            return c.json(
                { error: "Product already exists",
                  errorEs: "El producto ya existe" }, 400);
        }
        // create product
        const profit_margin = (!buy_price || !sell_price)
            ? -1
            : (sell_price / buy_price) - 1
        const product = {
            id: productId,
            name,
            unit,
            primary_products: primary_products || "[]",
            active: active || 1,
            buy_price: buy_price || 0,
            sell_price: sell_price || 0,
            stock: stock || 0,
            profit_margin
        }
        const newProduct = await db.insert(products).values(product).returning().get();
        return c.json(newProduct);
    })
    // .post("/initTable", async (c) => {
    //     const db = drizzle(c.env.DB);
    //     // delete table if exists
    //     const dropRes = await db.run(sql`DROP TABLE IF EXISTS products`);
    //     // create table
    //     const createRes = await db.run(
    //         sql`CREATE TABLE IF NOT EXISTS products (
                
    //         )`
    //     );
    //     // create test data
    //     const pop_products = [
    //         { name: "Cerveza",
    //           price: 4000.0, },
    //         { name: "Vino",
    //           price: 8000.0, },
    //         { name: "Fernet",
    //           price: 12000.0, },
    //         { name: "Gancia",
    //           price: 6000.0, },
    //         { name: "Whisky",
    //           price: 20000.0, },
    //     ]
    //     const data = await db.insert(products).values(pop_products).returning().get();
    //     // console.log(data)
    //     return c.json({dropRes, createRes, data});
    // })
    .post("/update/:id{[0-9]+}", async (c) => {
        const productId = c.req.param("id");
        const { name, price } = await c.req.json();
        if (!name) {
            return c.json(
                { error: "Name is required",
                  errorEs: "El nombre es requerido" }, 400);
        }
        const db = drizzle(c.env.DB);
        // check if product already exists
        const existingProduct = await db.select()
            .from(products)
            .where(eq(products.id, productId));
        if (existingProduct.length === 0) {
            // product doesn't exist
            return c.json(
                { error: "Product does not exist",
                  errorEs: "El producto no existe" }, 400);
        }
        const existingProductName = await db.select()
            .from(products)
            .where(eq(products.name, name));
        if (existingProductName.length > 0 && existingProductName[0].id !== productId) {
            // product already exists
            return c.json(
                { error: "Product name already used by other product",
                  errorEs: "El nombre del producto ya está en uso por otro producto"
                  }, 400);
        }
        // update product
        const product = {
            name,
            price,
        }
        const newProduct = await db.update(products)
            .set(product)
            .where(eq(products.id, productId))
            .returning().get();
        return c.json(newProduct);
    })
    .post("/delete/:id{[0-9]+}", async (c) => {
        const productId = c.req.param("id");
        const db = drizzle(c.env.DB);
        // check if product already exists
        const existingProduct = await db.select()
            .from(products)
            .where(eq(products.id, productId));
        if (existingProduct.length === 0) {
            // product doesn't exist
            return c.json(
                { error: "Product does not exist",
                  errorEs: "El producto no existe"
                }, 400);
        }
        // delete product
        const deletedProduct = await db.delete(products)
            .where(eq(products.id, productId))
            .returning().get();
        return c.json(deletedProduct);
    })
    .get("/:id{[0-9]+}", async (c) => {
        //validate it is a number
        if (isNaN(Number(c.req.param("id")))) {
            return c.json(
                { error: "Invalid product id",
                  errorEs: "ID de producto inválido"
                 }, 400);
        }
        const productId = c.req.param("id");
        const db = drizzle(c.env.DB);
        // check if product already exists
        const existingProduct = await db.select()
            .from(products)
            .where(eq(products.id, productId));
        if (existingProduct.length === 0) {
            // product doesn't exist
            return c.json(
                { error: "Product does not exist",
                  errorEs: "El producto no existe"
                }, 400);
        }
        return c.json(existingProduct[0]);
    });
