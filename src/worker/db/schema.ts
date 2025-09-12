import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';


export const primary_products = sqliteTable('p_products', {
  id: text('id', {length: 36}).notNull().primaryKey(),
  name: text('name', {length: 256}).notNull(),
  buy_price: real('buy_price').notNull(),
  unit: text('unit', {length: 36}).notNull(),
  last_update: text('last_update')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

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

export const sales = sqliteTable('sales', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  link_hash: text('hash', {length: 36}).notNull(),
  customer_id: text('customer_id', {length: 36}).notNull(),
  product_id: text('product_id', {length: 36}).notNull(),
  quantity: real('quantity').notNull(),
  total_price: real('total_price').notNull(),
  sale_date: text('sale_date')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const users = sqliteTable('users', {
  id: text('id', {length: 36}).notNull().primaryKey(),
  name: text('name', {length: 64}).notNull(),
  email: text('email', {length: 128}).notNull().unique(),
  password_hash: text('password_hash', {length: 256}).notNull(),
  role: text('role', {length: 32}).notNull().default('user'), // user, admin
  active: integer('active').notNull().default(1),
  created_at: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  last_update: text('last_update')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  last_login: text('last_login'),
})
