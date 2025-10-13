import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';


// export const primary_products = sqliteTable('p_products', {
//   id: text('id', {length: 36}).notNull().primaryKey(),
//   name: text('name', {length: 256}).notNull(),
//   buy_price: real('buy_price').notNull(),
//   unit: text('unit', {length: 36}).notNull(),
//   last_update: text('last_update')
//     .default(sql`CURRENT_TIMESTAMP`)
//     .notNull(),
// });

export const products = sqliteTable('products', {
  id: text('id', {length: 36}).notNull().primaryKey(),
  name: text('name', {length: 256}).notNull(),
  primary_products: text('primary_products', {length: 256}).notNull(),
  unit: text('unit', {length: 36}).notNull(),
  active: integer('active').notNull().default(1),
  buy_price: real('buy_price').notNull(),
  sell_price: real('sell_price').notNull(),
  profit_margin: real('profit_margin').notNull().default(0),
  stock: real('stock').notNull().default(0),
  last_update: text('last_update')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const products_price_history = sqliteTable('products_price_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  product_id: text('product_id', {length: 36}).notNull(),
  buy_price: real('buy_price').notNull(),
  sell_price: real('sell_price').notNull(),
  profit_margin: real('profit_margin').notNull().default(0),
  user_id: text('user_id', {length: 36}),
  inserted_at: text('inserted_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sales = sqliteTable('sales', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  link_hash: text('hash', {length: 36}).notNull(),
  customer_id: text('customer_id', {length: 36}).notNull(),
  combo_id: text('combo_id', {length: 36}),
  combo_name: text('combo_name', {length: 256}),
  product_id: text('product_id', {length: 36}).notNull(),
  product_name: text('product_name', {length: 256}).notNull(),
  product_unit: text('product_unit', {length: 36}).notNull(),
  payment_method: text('payment_method', {length: 36}).notNull(),
  product_unit_sell_price: real('product_unit_sell_price').notNull(),
  quantity: real('quantity').notNull(),
  total_amount: real('total_amount').notNull(),
  sale_date: text('sale_date')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const users = sqliteTable('users', {
  id: text('id', {length: 36}).notNull().primaryKey(),
  name: text('name', {length: 64}).notNull(),
  email: text('email', {length: 128}).notNull().unique(),
  password_hash: text('password_hash', {length: 256}).notNull(),
  roles: text('roles', {length: 32}).notNull().default('user'), // user, admin, salesman
  active: integer('active').notNull().default(1),
  created_at: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  last_update: text('last_update')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  last_login: text('last_login'),
})
