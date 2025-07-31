import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  video: text("video"),
  technologies: json("technologies").$type<string[]>().notNull(),
  category: text("category").notNull(),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  featured: text("featured").default("false"),
});

export const profile = pgTable("profile", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  bio: text("bio").notNull(),
  mission: text("mission").notNull(),
  image: text("image").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  resumeUrl: text("resume_url"),
  skills: json("skills").$type<{
    frontend: string[];
    backend: string[];
  }>().notNull(),
  social: json("social").$type<{
    linkedin: string;
    github: string;
    twitter: string;
  }>().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertProfileSchema = createInsertSchema(profile).omit({
  id: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profile.$inferSelect;
