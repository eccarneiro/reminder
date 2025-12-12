import { pgTable, serial, text, timestamp, varchar, boolean, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Better Auth ---
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull()
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(()=> user.id)
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(()=> user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    expiresAt: timestamp("expiresAt"),
    password: text("password")
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull()
});

// --- App Schema ---
export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 30 }).notNull().unique(), 
  name: text('name').notNull(),
  ownerId: text('owner_id').references(() => user.id).notNull(), 
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  channelId: integer('channel_id').references(() => channels.id).notNull(),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('unique_sub').on(t.userId, t.channelId),
}));

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id').references(() => channels.id),
  ownerId: text('owner_id').references(() => user.id).notNull(),
  title: text('title').notNull(),
  description: text('description'), 
  scheduledAt: timestamp('scheduled_at').notNull(), // A hora REAL do evento
  //Quantos minutos antes notificar? (0 = na hora exata, 15 = 15 min antes)
  notifyBeforeMinutes: integer('notify_before_minutes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const devices = pgTable('devices', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  token: text('token').notNull(), // O token do Expo/FCM
  platform: varchar('platform', { length: 10 }), // 'ios' ou 'android'
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Relations ---

export const userRelations = relations(user, ({ many }) => ({
  ownedChannels: many(channels),
  subscriptions: many(subscriptions),
  events: many(events),
  devices: many(devices),
}));

export const devicesRelations = relations(devices, ({ one }) => ({
  user: one(user, {
    fields: [devices.userId],
    references: [user.id],
  }),
}));

export const channelsRelations = relations(channels, ({ one, many }) => ({
  owner: one(user, {
    fields: [channels.ownerId],
    references: [user.id],
  }),
  subscriptions: many(subscriptions),
  events: many(events),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, {
    fields: [subscriptions.userId],
    references: [user.id],
  }),
  channel: one(channels, {
    fields: [subscriptions.channelId],
    references: [channels.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  owner: one(user, {
    fields: [events.ownerId],
    references: [user.id],
  }),
  channel: one(channels, {
    fields: [events.channelId],
    references: [channels.id],
  }),
}));