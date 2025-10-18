import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, QuadrantType } from "./EisenhowerMatrix";

type QuadrantCardProps = {
  quadrant: QuadrantType;
  title: string;
  subtitle: string;
  tasks: Task[];
  onAddTask: (text: string) => void;
  onRemoveTask: (taskId: string) => void;
};

const quadrantStyles = {
  "urgent-important": {
    bg: "bg-quadrant-urgent-important/20",
    border: "border-quadrant-urgent-important",
    text: "text-quadrant-urgent-important-foreground",
    titleBg: "bg-quadrant-urgent-important",
  },
  "not-urgent-important": {
    bg: "bg-quadrant-not-urgent-important/20",
    border: "border-quadrant-not-urgent-important",
    text: "text-quadrant-not-urgent-important-foreground",
    titleBg: "bg-quadrant-not-urgent-important",
  },
  "urgent-not-important": {
    bg: "bg-quadrant-urgent-not-important/20",
    border: "border-quadrant-urgent-not-important",
    text: "text-quadrant-urgent-not-important-foreground",
    titleBg: "bg-quadrant-urgent-not-important",
  },
  "not-urgent-not-important": {
    bg: "bg-quadrant-not-urgent-not-important/20",
    border: "border-quadrant-not-urgent-not-important",
    text: "text-quadrant-not-urgent-not-important-foreground",
    titleBg: "bg-quadrant-not-urgent-not-important",
  },
};

export const QuadrantCard = ({
  quadrant,
  title,
  subtitle,
  tasks,
  onAddTask,
  onRemoveTask,
}: QuadrantCardProps) => {
  const [newTaskText, setNewTaskText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const styles = quadrantStyles[quadrant];

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewTaskText("");
    }
  };

  return (
    <Card
      className={cn(
        "border-2 transition-all hover:shadow-md min-h-[300px] flex flex-col",
        styles.border,
        styles.bg
      )}
    >
      <CardHeader className={cn("rounded-t-lg", styles.titleBg)}>
        <CardTitle className={cn("text-xl font-bold", styles.text)}>
          {title}
        </CardTitle>
        <CardDescription className={cn("text-sm", styles.text, "opacity-90")}>
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-start gap-2 p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors border"
            >
              <span className="flex-1 text-sm text-foreground break-words">
                {task.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={() => onRemoveTask(task.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {isAdding ? (
          <div className="flex gap-2 mt-4">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Entrez une nouvelle tâche..."
              autoFocus
              className="flex-1"
            />
            <Button size="sm" onClick={handleAddTask}>
              Ajouter
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewTaskText("");
              }}
            >
              Annuler
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full mt-4 gap-2"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4" />
            Ajouter une tâche
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
