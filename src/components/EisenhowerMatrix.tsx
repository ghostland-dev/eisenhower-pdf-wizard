import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { QuadrantCard } from "./QuadrantCard";
import { Download, Plus } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

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

const EisenhowerMatrix = () => {
  const matrixRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<TasksByQuadrant>({
    "urgent-important": [],
    "not-urgent-important": [],
    "urgent-not-important": [],
    "not-urgent-not-important": [],
  });

  const addTask = (quadrant: QuadrantType, text: string) => {
    const newTask: Task = {
      id: `${quadrant}-${Date.now()}`,
      text,
    };
    setTasks((prev) => ({
      ...prev,
      [quadrant]: [...prev[quadrant], newTask],
    }));
  };

  const removeTask = (quadrant: QuadrantType, taskId: string) => {
    setTasks((prev) => ({
      ...prev,
      [quadrant]: prev[quadrant].filter((task) => task.id !== taskId),
    }));
  };

  const exportToPDF = async () => {
    if (!matrixRef.current) return;

    try {
      toast.info("Génération du PDF en cours...");
      
      const canvas = await html2canvas(matrixRef.current, {
        scale: 2,
        backgroundColor: "#fafafa",
        logging: false,
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

      pdf.save("matrice-eisenhower.pdf");
      toast.success("PDF généré avec succès !");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
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
          <Button
            onClick={exportToPDF}
            size="lg"
            className="gap-2"
          >
            <Download className="h-5 w-5" />
            Télécharger en PDF
          </Button>
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
              onAddTask={(text) => addTask("urgent-important", text)}
              onRemoveTask={(taskId) => removeTask("urgent-important", taskId)}
            />
            <QuadrantCard
              quadrant="not-urgent-important"
              title="À planifier"
              subtitle="Tâches à échéance vague qui contribuent à la réussite à long terme"
              tasks={tasks["not-urgent-important"]}
              onAddTask={(text) => addTask("not-urgent-important", text)}
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
              onAddTask={(text) => addTask("urgent-not-important", text)}
              onRemoveTask={(taskId) =>
                removeTask("urgent-not-important", taskId)
              }
            />
            <QuadrantCard
              quadrant="not-urgent-not-important"
              title="À abandonner"
              subtitle="Distractions et tâches superflues"
              tasks={tasks["not-urgent-not-important"]}
              onAddTask={(text) => addTask("not-urgent-not-important", text)}
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
