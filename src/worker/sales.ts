import { Hono } from "hono";
import { Env } from "./index";
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { sales } from "./db/schema";


export const salesRoute = new Hono<{ Bindings: Env }>()
    .get("/", async (c) => {
        const db = drizzle(c.env.DB);
        console.log("Getting all sales");
        const salesList = await db.select().from(sales).all();
        return c.json(salesList);
    })
    // .post("/add", async (c) => {
    //     const { 
    //         name,
    //         unit,
    //         primary_sales,
    //         active,
    //         buy_price,
    //         sell_price,
    //         stock,
    //      } = await c.req.json();
    //     if ( !name || !unit || !buy_price || !sell_price) {
    //         return c.json(
    //             { error: "name/unit/buy_price/sell_price are required",
    //               errorEs: "name/unit/buy_price/sell_price son requeridos" }, 400);
    //     }
    //     // console.log(`name: ${name}, unit: ${unit}, buy_price: ${buy_price}, sell_price: ${sell_price}`);
    //     const productId = (name + " " + unit).toLowerCase().slice(0, 36)
    //                 .replaceAll(
    //                     RegExp(`[^a-zA-Z0-9]`, 'g'),
    //                     "_");
    //     const db = drizzle(c.env.DB);
    //     // check if product already exists
    //     const existingProduct = await db.select()
    //         .from(sales)
    //         .where(eq(sales.id, productId));
    //     if (existingProduct.length > 0) {
    //         // product already exists
    //         return c.json(
    //             { error: "Product already exists",
    //               errorEs: "El producto ya existe" }, 400);
    //     }
    //     // create product
    //     const profit_margin = (!buy_price || !sell_price)
    //         ? -1
    //         : (sell_price / buy_price) - 1
    //     const product = {
    //         id: productId,
    //         name,
    //         unit,
    //         primary_sales: primary_sales || "[]",
    //         active: active || 1,
    //         buy_price: buy_price || 0,
    //         sell_price: sell_price || 0,
    //         stock: stock || 0,
    //         profit_margin
    //     }
    //     const newProduct = await db.insert(sales).values(product).returning().get();
    //     // insert into price history
    //     const jwtPayload = await c.get("jwtPayload");
    //     // console.log(`jwtPayload JWT: ${JSON.stringify(jwtPayload)}`);
    //     await db.insert(sales_price_history).values({
    //         product_id: newProduct.id,
    //         buy_price: newProduct.buy_price,
    //         sell_price: newProduct.sell_price,
    //         profit_margin: newProduct.profit_margin,
    //         user_id: jwtPayload.username,
    //     });
    //     return c.json(newProduct);
    // })
    // .post("/update/:id", async (c) => {
    //     const productId = c.req.param("id");
    //     const {
    //         // name,
    //         unit,
    //         primary_sales,
    //         active,
    //         buy_price,
    //         sell_price,
    //         // stock,
    //      } = await c.req.json();
    //     if ( !unit || !buy_price || !sell_price) {
    //         return c.json(
    //             { error: "unit/buy_price/sell_price are required",
    //               errorEs: "unit/buy_price/sell_price son requeridos" }, 400);
    //     }
    //     const db = drizzle(c.env.DB);
    //     // check if product already exists
    //     const existingProduct = await db.select()
    //         .from(sales)
    //         .where(eq(sales.id, productId));
    //     if (existingProduct.length === 0) {
    //         // product doesn't exist
    //         return c.json(
    //             { error: "Product does not exist",
    //               errorEs: "El producto no existe" }, 400);
    //     }
    //     // const existingProductName = await db.select()
    //     //     .from(sales)
    //     //     .where(eq(sales.name, name));
    //     // if (existingProductName.length > 0 && existingProductName[0].id !== productId) {
    //     //     // product already exists
    //     //     return c.json(
    //     //         { error: "Product name already used by other product",
    //     //           errorEs: "El nombre del producto ya está en uso por otro producto"
    //     //           }, 400);
    //     // }
    //     // update product
    //     const product = {
    //         unit,
    //         primary_sales,
    //         active,
    //         buy_price,
    //         sell_price,
    //         profit_margin: (sell_price / buy_price) - 1,
    //         // stock,
    //         last_update: new Date().toISOString(),
    //     }
    //     const updatedProduct = await db.update(sales)
    //         .set(product)
    //         .where(eq(sales.id, productId))
    //         .returning().get();
    //     // insert into price history
    //     const jwtPayload = await c.get("jwtPayload");
    //     // console.log(`jwtPayload JWT: ${JSON.stringify(jwtPayload)}`);
    //     await db.insert(sales_price_history).values({
    //         product_id: updatedProduct.id,
    //         buy_price: updatedProduct.buy_price,
    //         sell_price: updatedProduct.sell_price,
    //         profit_margin: updatedProduct.profit_margin,
    //         user_id: jwtPayload.username,
    //     });
    //     return c.json(updatedProduct);
    // })
    // .post("/delete/:id", async (c) => {
    //     const productId = c.req.param("id");
    //     const db = drizzle(c.env.DB);
    //     // check if product already exists
    //     console.log(`Deleting product with id: ${productId}`);
    //     const existingProduct = await db.select()
    //         .from(sales)
    //         .where(eq(sales.id, productId));
    //     if (existingProduct.length === 0) {
    //         // product doesn't exist
    //         return c.json(
    //             { error: "Product does not exist",
    //               errorEs: "El producto no existe"
    //             }, 400);
    //     }
    //     // delete product
    //     // console.log(`Deleted: ${productId}`);
    //     // const deletedProduct = await db.delete(sales)
    //     //     .where(eq(sales.id, productId))
    //     //     .returning().get();
    //     const disabledProduct = await db.update(sales)
    //         .set({ active: 0 })
    //         .where(eq(sales.id, productId))
    //         .returning().get();
    //     return c.json(disabledProduct);
    // })
    // .get("/:id", async (c) => {
    //     //validate it is a number
    //     if (isNaN(Number(c.req.param("id")))) {
    //         return c.json(
    //             { error: "Invalid product id",
    //               errorEs: "ID de producto inválido"
    //              }, 400);
    //     }
    //     const productId = c.req.param("id");
    //     const db = drizzle(c.env.DB);
    //     // check if product already exists
    //     const existingProduct = await db.select()
    //         .from(sales)
    //         .where(eq(sales.id, productId));
    //     if (existingProduct.length === 0) {
    //         // product doesn't exist
    //         return c.json(
    //             { error: "Product does not exist",
    //               errorEs: "El producto no existe"
    //             }, 400);
    //     }
    //     return c.json(existingProduct[0]);
    // });
