"use client";

import { useState } from "react";
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
import { api } from "@/src/lib/api";

interface CreateFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateFeedback({
  isOpen,
  onClose,
  onSuccess,
}: CreateFeedbackProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Começa com valor válido em inglês
  const [category, setCategory] = useState("improvement");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples no Front antes de incomodar o Back
    if (title.length < 3 || description.length < 3) {
      alert("Título e descrição precisam ter no mínimo 3 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      // Enviamos para o backend.
      // O 'category' já está em inglês por causa do <SelectItem value="..."> abaixo.
      await api.post("/feedback", {
        title,
        description,
        category,
      });

      // Limpa o form e avisa o pai
      setTitle("");
      setDescription("");
      setCategory("improvement");
      onSuccess(); // Atualiza a lista lá fora
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error("Erro ao criar feedback:", error);
      const msg =
        error.response?.data?.error?.formErrors?.[0] ||
        "Verifique os dados e tente novamente.";
      alert(`Erro: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-500px bg-white text-black">
        <DialogHeader>
          <DialogTitle>Novo Feedback</DialogTitle>
          <DialogDescription>
            Compartilhe sua ideia ou reporte um erro para a comunidade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: Adicionar modo escuro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3} // Ajuda visual do HTML5
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="bg-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {/* O SEGREDO ESTÁ AQUI: O 'value' é inglês (pro backend), o texto é PT (pro usuário) */}
                <SelectItem value="improvement">Melhoria</SelectItem>
                <SelectItem value="feature">Funcionalidade Nova</SelectItem>
                <SelectItem value="bug">Reportar Erro (Bug)</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Detalhada</Label>
            <Textarea
              id="description"
              placeholder="Explique melhor sua ideia..."
              className="resize-none h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {isLoading ? "Enviando..." : "Publicar Feedback"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
