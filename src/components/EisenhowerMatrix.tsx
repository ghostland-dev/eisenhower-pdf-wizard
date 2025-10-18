import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuadrantCard } from "./QuadrantCard";
import { Download, Trash2, Save } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { saveTasks, loadTasks, clearTasks } from "@/lib/storage";

export type Task = {
  id: string;
  text: string;
};

export type QuadrantType = 
  | "urgent-important"
  | "not-urgent-important"
  | "urgent-not-important"
  | "not-urgent-not-important";

export type TasksByQuadrant = {
  [key in QuadrantType]: Task[];
};

const quadrantOptions = [
  { value: "urgent-important", label: "À faire (Urgent & Important)" },
  { value: "not-urgent-important", label: "À planifier (Important)" },
  { value: "urgent-not-important", label: "À déléguer (Urgent)" },
  { value: "not-urgent-not-important", label: "À abandonner" },
] as const;

const EisenhowerMatrix = () => {
  const matrixRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<TasksByQuadrant>({
    "urgent-important": [],
    "not-urgent-important": [],
    "urgent-not-important": [],
    "not-urgent-not-important": [],
  });
  
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType>("urgent-important");
  const [isExporting, setIsExporting] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = loadTasks();
    if (stored) {
      setTasks(stored);
      toast.success("Tâches chargées depuis la sauvegarde locale");
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    const hasAnyTasks = Object.values(tasks).some(quadrant => quadrant.length > 0);
    if (hasAnyTasks) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const addTask = (quadrant: QuadrantType, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      toast.error("La tâche ne peut pas être vide");
      return;
    }

    if (trimmedText.length > 500) {
      toast.error("La tâche ne peut pas dépasser 500 caractères");
      return;
    }

    const newTask: Task = {
      id: `${quadrant}-${Date.now()}`,
      text: trimmedText,
    };
    
    setTasks((prev) => ({
      ...prev,
      [quadrant]: [...prev[quadrant], newTask],
    }));
  };
  
  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(selectedQuadrant, newTaskText);
      setNewTaskText("");
      toast.success("Tâche ajoutée !");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const removeTask = (quadrant: QuadrantType, taskId: string) => {
    setTasks((prev) => ({
      ...prev,
      [quadrant]: prev[quadrant].filter((task) => task.id !== taskId),
    }));
    toast.success("Tâche supprimée");
  };

  const clearAllTasks = () => {
    setTasks({
      "urgent-important": [],
      "not-urgent-important": [],
      "urgent-not-important": [],
      "not-urgent-not-important": [],
    });
    clearTasks();
    toast.success("Toutes les tâches ont été supprimées");
  };

  const getTotalTaskCount = () => {
    return Object.values(tasks).reduce((total, quadrant) => total + quadrant.length, 0);
  };

  const exportToPDF = async () => {
    if (!matrixRef.current) return;

    const totalTasks = getTotalTaskCount();
    if (totalTasks === 0) {
      toast.error("Ajoutez au moins une tâche avant d'exporter");
      return;
    }

    try {
      setIsExporting(true);
      toast.info("Génération du PDF en cours...");
      
      const canvas = await html2canvas(matrixRef.current, {
        scale: 2,
        backgroundColor: "#fafafa",
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Add footer with date
      const date = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Généré le ${date}`, pdfWidth / 2, pdfHeight - 5, { align: 'center' });

      pdf.save(`matrice-eisenhower-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF généré avec succès !");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Matrice d'Eisenhower
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Organisez vos tâches selon leur importance et leur urgence pour une
            meilleure productivité
          </p>
          
          {/* Single Task Input */}
          <div className="max-w-3xl mx-auto bg-card p-6 rounded-xl shadow-md space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Entrez une nouvelle tâche..."
                maxLength={500}
                className="flex-1 text-base"
                aria-label="Nouvelle tâche"
              />
              <Select
                value={selectedQuadrant}
                onValueChange={(value) => setSelectedQuadrant(value as QuadrantType)}
              >
                <SelectTrigger className="w-full md:w-[280px]" aria-label="Catégorie de tâche">
                  <SelectValue placeholder="Choisir la catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {quadrantOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddTask}
                size="lg"
                className="md:w-auto"
                disabled={!newTaskText.trim()}
              >
                Ajouter
              </Button>
            </div>
            {newTaskText.length > 450 && (
              <p className="text-sm text-muted-foreground text-right">
                {500 - newTaskText.length} caractères restants
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={exportToPDF}
              size="lg"
              variant="outline"
              className="gap-2"
              disabled={isExporting || getTotalTaskCount() === 0}
            >
              <Download className="h-5 w-5" />
              {isExporting ? "Génération..." : "Télécharger en PDF"}
            </Button>
            
            {getTotalTaskCount() > 0 && (
              <>
                <Button
                  onClick={() => saveTasks(tasks)}
                  size="lg"
                  variant="outline"
                  className="gap-2"
                >
                  <Save className="h-5 w-5" />
                  Sauvegarde manuelle
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="destructive"
                      className="gap-2"
                    >
                      <Trash2 className="h-5 w-5" />
                      Tout effacer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action supprimera toutes vos tâches ({getTotalTaskCount()} tâches).
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={clearAllTasks}>
                        Supprimer tout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Matrix */}
        <div ref={matrixRef} className="bg-card p-4 md:p-8 rounded-2xl shadow-lg">
          {/* Axis Labels */}
          <div className="grid grid-cols-[auto_1fr_1fr] gap-4 mb-4">
            <div className="flex items-center justify-center"></div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">Urgent</h2>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">
                Non urgent
              </h2>
            </div>
          </div>

          {/* Quadrants Grid */}
          <div className="grid grid-cols-[auto_1fr_1fr] gap-4">
            {/* Important Row */}
            <div className="flex items-center justify-center">
              <h2 className="text-xl font-semibold text-foreground -rotate-90 whitespace-nowrap">
                Important
              </h2>
            </div>
            <QuadrantCard
              quadrant="urgent-important"
              title="À faire"
              subtitle="Tâches à échéance précise dont le retard entraînera des conséquences"
              tasks={tasks["urgent-important"]}
              onRemoveTask={(taskId) => removeTask("urgent-important", taskId)}
            />
            <QuadrantCard
              quadrant="not-urgent-important"
              title="À planifier"
              subtitle="Tâches à échéance vague qui contribuent à la réussite à long terme"
              tasks={tasks["not-urgent-important"]}
              onRemoveTask={(taskId) =>
                removeTask("not-urgent-important", taskId)
              }
            />

            {/* Non Important Row */}
            <div className="flex items-center justify-center">
              <h2 className="text-xl font-semibold text-foreground -rotate-90 whitespace-nowrap">
                Non important
              </h2>
            </div>
            <QuadrantCard
              quadrant="urgent-not-important"
              title="À déléguer"
              subtitle="Tâches à traiter, mais qui ne mobilisent pas vos compétences"
              tasks={tasks["urgent-not-important"]}
              onRemoveTask={(taskId) =>
                removeTask("urgent-not-important", taskId)
              }
            />
            <QuadrantCard
              quadrant="not-urgent-not-important"
              title="À abandonner"
              subtitle="Distractions et tâches superflues"
              tasks={tasks["not-urgent-not-important"]}
              onRemoveTask={(taskId) =>
                removeTask("not-urgent-not-important", taskId)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EisenhowerMatrix;
