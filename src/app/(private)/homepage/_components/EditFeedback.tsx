"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeedbackService } from "@/src/services/feedback";
import { Feedback } from "@/src/types/feedback"; // Importando do novo local

interface EditFeedbackProps {
  feedback: Feedback | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditFeedback({
  feedback,
  isOpen,
  onClose,
  onSuccess,
}: EditFeedbackProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("improvement");

  // Carrega os dados quando abre o modal ou muda o feedback selecionado
  useEffect(() => {
    if (feedback) {
      setTitle(feedback.title);
      setDescription(feedback.description);
      setCategory(feedback.category);
    }
  }, [feedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;

    if (title.length < 3 || description.length < 3) {
      alert("Mínimo de 3 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      await FeedbackService.update(feedback.id, {
        title,
        description,
        category,
      });
      onSuccess(); // Recarrega a lista pai
      onClose();
    } catch (error: any) {
      alert(
        "Erro ao editar: " +
          (error.response?.data?.error || "Erro desconhecido")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-500px bg-white text-black">
        <DialogHeader>
          <DialogTitle>Editar Feedback</DialogTitle>
          <DialogDescription>
            Faça correções no seu feedback pendente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="improvement">Melhoria</SelectItem>
                <SelectItem value="feature">Funcionalidade Nova</SelectItem>
                <SelectItem value="bug">Reportar Erro (Bug)</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32 resize-none"
              required
              minLength={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Salvar Alterações" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
