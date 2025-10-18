import type { TasksByQuadrant } from "@/components/EisenhowerMatrix";
import { tasksSchema } from "./validation";

const STORAGE_KEY = "eisenhower-matrix-tasks";

export const saveTasks = (tasks: TasksByQuadrant): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

export const loadTasks = (): TasksByQuadrant | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const validated = tasksSchema.safeParse(parsed);

    if (validated.success) {
      return validated.data as TasksByQuadrant;
    } else {
      console.error("Invalid stored tasks format:", validated.error);
      return null;
    }
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return null;
  }
};

export const clearTasks = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing tasks from localStorage:", error);
  }
};
