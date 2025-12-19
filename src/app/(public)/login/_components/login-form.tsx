import type React from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SeparatorWithText,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="gap-6">
          <CardTitle className="text-2xl">Fazer Login</CardTitle>
          <CardDescription>Faça login para enviar feedback</CardDescription>
          <Button variant="outline" className="w-full bg-blue-400">
            Fazer Login com Google
          </Button>
        </CardHeader>

        <CardContent>
          <SeparatorWithText />

          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  ></a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <CardDescription>
                Clique em "Fazer Login com Google" para continuar
              </CardDescription>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
