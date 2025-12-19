"use client";

import { useState } from "react";
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

interface CreateFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateFeedback({
  isOpen,
  onClose,
}: CreateFeedbackProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Melhoria",
    description: "",
  });

  const handleCreate = () => {
    console.log("Feedback Criado:", formData);
    setFormData({ name: "", email: "", category: "Melhoria", description: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-500px border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Criar Novo Feedback
          </DialogTitle>
          <DialogDescription>
            Compartilhe sua ideia ou reporte um problema preenchendo os campos
            abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Seu E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Título do Feedback
            </Label>
            <Input
              id="name"
              placeholder="Resuma sua ideia..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(v) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger className="h-10 bg-white">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Funcionalidade">Funcionalidade</SelectItem>
                <SelectItem value="Bug">Bug</SelectItem>
                <SelectItem value="Melhoria">Melhoria</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Descrição Detalhada
            </Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Conte-nos mais detalhes..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="resize-none focus-visible:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 px-8"
          >
            Enviar Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
