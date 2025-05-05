
const sales = sqliteTable('sales', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    drinkId: integer('drinkId').notNull(),
    drinkName: text('drinkName').notNull(),
    quantity: integer('quantity').notNull(),
    unitPrice: real('unitPrice').notNull(),
    totalAmount: real('totalAmount').notNull(),
    userId: integer('userId').notNull(),
    userName: text('userName').notNull(),
    createdAt: text('createdAt').notNull(),
    updatedAt: text('updatedAt').notNull(),
});
