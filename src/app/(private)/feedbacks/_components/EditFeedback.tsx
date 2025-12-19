"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: any | null;
}

export default function EditFeedback({
  isOpen,
  onClose,
  feedback,
}: EditFeedbackProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "",
    priority: "",
    description: "",
  });

  useEffect(() => {
    if (feedback) {
      setFormData({
        name: feedback.name || "",
        category: feedback.category || "Melhoria",
        status: feedback.status || "novo",
        priority: feedback.priority || "Media",
        description: feedback.description || "",
      });
    }
  }, [feedback]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-600px border-none overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Editar Feedback
          </DialogTitle>
          <DialogDescription>
            Enviado por:{" "}
            <span className="font-medium text-gray-900">{feedback?.email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Título
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Categoria */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Funcionalidade">Funcionalidade</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Melhoria">Melhoria</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="em analise">Em análise</SelectItem>
                  <SelectItem value="Planejado">Planejado</SelectItem>
                  <SelectItem value="Em progresso">Em progresso</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prioridade */}
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Prioridade</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Media">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Descrição
            </Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-between">
          <Button variant="destructive" className="sm:mr-auto">
            Deletar feedback
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={() => onClose()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Salvar Alterações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
