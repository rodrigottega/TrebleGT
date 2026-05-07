import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";

export function AISettingsView() {
  const [temp, setTemp] = useState(0.7);

  const save = () => toast({ title: "Configuración guardada" });

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6 shrink-0 z-10 sticky top-0 bg-background/95 backdrop-blur">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configuración IA</h1>
          <p className="text-sm text-muted-foreground mt-1">Ajusta el motor, los parámetros y el comportamiento global.</p>
        </div>
        <Button onClick={save} className="shadow-sm">Guardar cambios</Button>
      </div>

      <div className="p-8 max-w-4xl space-y-10">
        
        <section>
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Motor de IA</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-[1fr_2fr] gap-6 items-start border p-6 rounded-xl bg-muted/10 shadow-sm border-primary/20">
               <div>
                  <Label className="text-sm font-medium">Modelo principal</Label>
                  <p className="text-xs text-muted-foreground mt-1">Selecciona la red neuronal que dará respuesta en general.</p>
               </div>
               <Select defaultValue="gpt-4o">
                  <SelectTrigger className="w-full">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="gpt-4o">GPT-4o (Recomendado, más capaz)</SelectItem>
                     <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet (Excelente razonador)</SelectItem>
                     <SelectItem value="llama-3">Llama 3 (Más rápido, menos costo)</SelectItem>
                  </SelectContent>
               </Select>
            </div>
            
            <div className="grid grid-cols-[1fr_2fr] gap-6 items-center">
               <div>
                  <Label className="text-sm font-medium">Creatividad (Temperatura)</Label>
                  <p className="text-xs text-muted-foreground mt-1">Valores bajos = respuestas exactas. Valores altos = impredecibles.</p>
               </div>
               <div className="flex items-center gap-4">
                  <input 
                     type="range" 
                     min="0" max="1" step="0.1" 
                     value={temp} 
                     onChange={(e) => setTemp(parseFloat(e.target.value))}
                     className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
                  <span className="text-sm font-mono font-medium min-w-[3ch]">{temp}</span>
               </div>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Copiloto vs Auto-piloto</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-xl bg-primary/5 border-primary/20">
               <div className="space-y-0.5">
                  <Label className="text-base">Habilitar revisión humana antes de enviar</Label>
                  <p className="text-sm text-muted-foreground">La IA redactará borradores y esperará que un agente los apruebe. Nunca enviará directo al cliente.</p>
               </div>
               <Switch />
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-6 items-start mt-6">
               <div>
                  <Label className="text-sm font-medium">Nivel de autonomía</Label>
                  <p className="text-xs text-muted-foreground mt-1">Si auto-piloto está activo, qué tanta libertad tiene.</p>
               </div>
               <Select defaultValue="balanceado">
                  <SelectTrigger className="max-w-[300px]">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="conservador">Conservador (Solo responde exacto)</SelectItem>
                     <SelectItem value="balanceado">Balanceado</SelectItem>
                     <SelectItem value="proactivo">Proactivo (Toma iniciativas comerciales)</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Restricciones de Respuesta</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
               <Label>Requerir traspaso cuando haya baja confianza</Label>
               <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
               <Label>Bloquear respuestas fuera de conocimiento</Label>
               <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
               <div className="space-y-0.5">
                  <Label>Pedir confirmación antes de cerrar un ticket</Label>
                  <p className="text-xs text-muted-foreground">La IA no resolverá chats por sí sola.</p>
               </div>
               <Switch />
            </div>
            <div className="grid grid-cols-[1fr_2fr] gap-6 items-center pt-4">
               <div>
                  <Label className="text-sm font-medium">Confianza mínima (%)</Label>
               </div>
               <Select defaultValue="80">
                  <SelectTrigger className="max-w-[300px]"><SelectValue placeholder="80%" /></SelectTrigger>
                  <SelectContent>
                     <SelectItem value="90">90% (Muy estricto)</SelectItem>
                     <SelectItem value="80">80%</SelectItem>
                     <SelectItem value="70">70%</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}
