import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_HANDOFF_RULES } from "@/data/mockData";
import { toast } from "@/components/ui/toaster";

export function HandoffRulesView() {
  const [rules, setRules] = useState(MOCK_HANDOFF_RULES);
  const [activeRuleId, setActiveRuleId] = useState<string | null>(rules[0]?.id || null);

  const activeRule = rules.find(r => r.id === activeRuleId);

  const handleToggle = (id: string, current: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, estado: current === "Activo" ? "Inactivo" : "Activo" } : r));
    toast({ title: `Regla ${current === "Activo" ? "desactivada" : "activada"}` });
  };

  const handleSave = () => {
    toast({ title: "Cambios guardados" });
  };

  const createRule = () => {
     const newId = `rule-${Date.now()}`;
     const newRule = {
        id: newId,
        nombre: "Nueva Regla",
        descripción: "Descripción de la regla",
        condicion: "sentiment",
        accion: "inbox-support",
        prioridad: "Media",
        canales: ["Todos"],
        agentes: ["Todos"],
        estado: "Borrador",
        ultimaActivacion: "-"
     };
     setRules([...rules, newRule]);
     setActiveRuleId(newId);
  }

  return (
      <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <div className="flex items-center justify-between border-b px-8 py-5 shrink-0 bg-background z-10">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Reglas de traspaso humano</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Define cuándo la IA debe detenerse y pasar una conversación a una persona.</p>
        </div>
        <Button onClick={createRule} className="shadow-sm">
          <i className="ri-add-line mr-2"></i> Crear regla
        </Button>
      </div>

      <div className="bg-primary/5 px-8 py-3 flex items-start gap-2 border-b shrink-0">
        <i className="ri-information-fill text-primary mt-0.5"></i>
        <p className="text-sm text-muted-foreground">Estas reglas no asignan conversaciones. Solo determinan cuándo la IA debe pedir intervención humana. La asignación del responsable se configura en Canales {'>'} Asignación automática.</p>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
         <div className="w-[320px] lg:w-[380px] border-r flex flex-col bg-muted/10 shrink-0">
            <div className="p-4 border-b bg-background">
               <Input placeholder="Buscar regla..." className="shadow-none bg-muted/50" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               {rules.map(rule => (
                  <div 
                     key={rule.id} 
                     onClick={() => setActiveRuleId(rule.id)}
                     className={`p-4 rounded-xl border cursor-pointer transition-colors ${activeRuleId === rule.id ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-background hover:bg-muted/50 shadow-sm'}`}
                  >
                     <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-sm text-foreground">{rule.nombre}</div>
                        <Switch 
                           checked={rule.estado === "Activo"}
                           onCheckedChange={(v) => handleToggle(rule.id, rule.estado)}
                           onClick={(e) => e.stopPropagation()}
                        />
                     </div>
                     <div className="text-xs text-muted-foreground line-clamp-1 mb-3">{rule.descripción}</div>
                     <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-normal text-[10px]">{rule.prioridad}</Badge>
                        <Badge variant={rule.estado === 'Activo' ? 'outline' : 'secondary'} className="font-normal text-[10px] shadow-none">{rule.estado}</Badge>
                     </div>
                  </div>
               ))}
               {rules.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">No hay reglas configuradas.</div>
               )}
            </div>
         </div>
         <div className="flex-1 overflow-y-auto bg-background">
            {activeRule ? (
               <div className="max-w-3xl mx-auto p-8 lg:p-12 space-y-10">
                  <div>
                     <h2 className="text-2xl font-semibold tracking-tight mb-2">Editor de regla</h2>
                     <p className="text-sm text-muted-foreground">Configura las condiciones bajo las cuales se activará este disparador de traspaso humano.</p>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Información general</h3>
                     <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground">Nombre de la regla</label>
                        <Input defaultValue={activeRule.nombre} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground">Descripción</label>
                        <Input defaultValue={activeRule.descripción} />
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Constructor Visual</h3>
                     <div className="rounded-xl border border-dashed border-border p-6 bg-muted/10 relative">
                        <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">1</div>
                        <div className="mb-4">
                           <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CONDICIÓN</label>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                           <div className="space-y-2">
                              <Select defaultValue="explicit">
                                 <SelectTrigger><SelectValue/></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="explicit">Si el usuario solicita explícitamente hablar con una persona</SelectItem>
                                    <SelectItem value="fails">Si la conversación lleva demasiados intentos sin resolverse</SelectItem>
                                    <SelectItem value="frustration">Si se detecta frustración o molestia en el cliente</SelectItem>
                                    <SelectItem value="low-confidence">Si la IA responde con baja confianza repetidamente</SelectItem>
                                    <SelectItem value="keyword">Si el mensaje del usuario contiene palabras clave específicas</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-center">
                        <div className="h-8 w-[2px] bg-border/50"></div>
                     </div>

                     <div className="rounded-xl border border-dashed border-border p-6 bg-muted/10 relative">
                        <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">2</div>
                        <div className="mb-4 flex items-center justify-between">
                           <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACCIÓN Y MOTIVO</label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Select defaultValue="pause">
                                 <SelectTrigger><SelectValue/></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="pause">Pausar respuesta de IA y marcar como Necesita humano</SelectItem>
                                    <SelectItem value="notify">Solo notificar al supervisor (La IA continúa)</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <Input placeholder="Motivo que verá el agente (Ej. Usuario pidió humano)" defaultValue="Usuario pidió humano" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 border-t flex justify-end">
                     <Button onClick={handleSave}>Guardar cambios</Button>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                     <i className="ri-git-merge-line text-2xl"></i>
                  </div>
                  <div className="font-medium">Selecciona una regla</div>
                  <div className="text-sm">o crea una nueva para configurar transferencias automáticas.</div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
