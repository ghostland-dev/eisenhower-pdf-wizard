import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  text: z.string()
    .min(1, { message: "La tâche ne peut pas être vide" })
    .max(500, { message: "La tâche ne peut pas dépasser 500 caractères" }),
});

export const tasksSchema = z.object({
  "urgent-important": z.array(taskSchema),
  "not-urgent-important": z.array(taskSchema),
  "urgent-not-important": z.array(taskSchema),
  "not-urgent-not-important": z.array(taskSchema),
});
