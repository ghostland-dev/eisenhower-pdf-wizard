import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, QuadrantType } from "./EisenhowerMatrix";

type QuadrantCardProps = {
  quadrant: QuadrantType;
  title: string;
  subtitle: string;
  tasks: Task[];
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
  onRemoveTask,
}: QuadrantCardProps) => {
  const styles = quadrantStyles[quadrant];

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
        <div className="space-y-2 flex-1 min-h-[200px]">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Aucune tâche
            </div>
          ) : (
            tasks.map((task) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
