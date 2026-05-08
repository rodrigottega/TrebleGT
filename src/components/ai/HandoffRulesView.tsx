import React, { useState } from "react";
  import { Badge } from "@/components/ui/badge";
  import { Switch } from "@/components/ui/switch";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Checkbox } from "@/components/ui/checkbox";
  import { toast } from "@/components/ui/toaster";
  
  type HandoffRule = {
    id: string;
    name: string;
    description: string;
    conditionType: string;
    actionType: string;
    handoffReason: string;
    priority: "Baja" | "Media" | "Alta";
    enabled: boolean;
    channels: string[];
    affectedAgents: string[];
  };
  
  const INITIAL_HANDOFF_RULES: HandoffRule[] = [
    {
      id: "r1",
      name: "Usuario pide hablar con una persona",
      description: "Detecta intención explícita de hablar con humano.",
      conditionType: "El usuario pide hablar con una persona",
      actionType: "Pausar IA y solicitar traspaso humano",
      handoffReason: "Usuario pidió humano",
      priority: "Alta",
      channels: ["WhatsApp", "Instagram", "Web Chat"],
      affectedAgents: ["Todos los agentes"],
      enabled: true
    },
    {
      id: "r2",
      name: "La IA tiene baja confianza",
      description: "Confianza de IA por debajo del umbral configurado.",
      conditionType: "La IA responde con baja confianza",
      actionType: "Marcar conversación como Necesita humano",
      handoffReason: "Baja confianza IA",
      priority: "Alta",
      channels: ["WhatsApp", "Web Chat"],
      affectedAgents: ["Todos los agentes"],
      enabled: true
    },
    {
      id: "r3",
      name: "El usuario expresa frustración",
      description: "Análisis de sentimiento detecta enojo o frustración.",
      conditionType: "Se detecta frustración o molestia en el cliente",
      actionType: "Pausar IA y solicitar traspaso humano",
      handoffReason: "Frustración detectada",
      priority: "Media",
      channels: ["WhatsApp", "Instagram"],
      affectedAgents: ["Agente de soporte"],
      enabled: true
    },
    {
      id: "r4",
      name: "El usuario solicita descuento o excepción",
      description: "Usuario menciona descuentos, rebajas, precios especiales o excepciones comerciales.",
      conditionType: "El usuario solicita descuento o excepción comercial",
      actionType: "Crear nota interna para el equipo",
      handoffReason: "Excepción comercial",
      priority: "Media",
      channels: ["WhatsApp", "Web Chat"],
      affectedAgents: ["Agente de ventas"],
      enabled: true
    },
    {
      id: "r5",
      name: "Fuera de la base de conocimiento",
      description: "Preguntas sin información disponible en la base conectada al agente.",
      conditionType: "La pregunta está fuera de la base de conocimiento",
      actionType: "Pedir contexto adicional antes de traspasar",
      handoffReason: "Fuera de conocimiento",
      priority: "Alta",
      channels: ["Web Chat"],
      affectedAgents: ["Todos los agentes"],
      enabled: true
    },
    {
      id: "r6",
      name: "Usuario comparte información sensible",
      description: "Detecta tarjetas, contraseñas, documentos o datos sensibles.",
      conditionType: "El usuario comparte información sensible",
      actionType: "Bloquear respuesta automática",
      handoffReason: "Información sensible",
      priority: "Alta",
      channels: ["WhatsApp", "Instagram", "Web Chat"],
      affectedAgents: ["Todos los agentes"],
      enabled: true
    },
    {
      id: "r7",
      name: "Conversación lleva más de 3 intentos",
      description: "La IA no logra resolver después de varios intercambios.",
      conditionType: "La conversación lleva demasiados intentos sin resolverse",
      actionType: "Escalar solo si ocurre dos veces",
      handoffReason: "Demasiados intentos",
      priority: "Media",
      channels: ["WhatsApp", "Web Chat"],
      affectedAgents: ["Agente de soporte"],
      enabled: true
    },
    {
      id: "r8",
      name: "Usuario reporta error crítico",
      description: "Detecta errores que impiden que el usuario avance.",
      conditionType: "El usuario reporta un error crítico",
      actionType: "Marcar conversación como Necesita humano",
      handoffReason: "Error crítico",
      priority: "Alta",
      channels: ["Web Chat"],
      affectedAgents: ["Agente de soporte"],
      enabled: true
    },
    {
      id: "r9",
      name: "Contacto de prioridad alta",
      description: "Escala conversaciones de contactos marcados como prioridad alta.",
      conditionType: "El contacto tiene prioridad alta",
      actionType: "Marcar conversación como Necesita humano",
      handoffReason: "Contacto prioritario",
      priority: "Alta",
      channels: ["WhatsApp", "Instagram", "Web Chat"],
      affectedAgents: ["Agente de ventas"],
      enabled: false
    },
    {
      id: "r10",
      name: "Intención de queja detectada",
      description: "La intención principal de la conversación es una queja.",
      conditionType: "La intención detectada es queja",
      actionType: "Pausar IA y solicitar traspaso humano",
      handoffReason: "Queja detectada",
      priority: "Alta",
      channels: ["WhatsApp", "Instagram"],
      affectedAgents: ["Agente de soporte"],
      enabled: true
    }
  ];
  
  const CONDITION_OPTIONS = [
    "El usuario pide hablar con una persona",
    "La IA responde con baja confianza",
    "Se detecta frustración o molestia en el cliente",
    "El usuario solicita descuento o excepción comercial",
    "La pregunta está fuera de la base de conocimiento",
    "El usuario comparte información sensible",
    "La conversación lleva demasiados intentos sin resolverse",
    "El usuario reporta un error crítico",
    "El contacto tiene prioridad alta",
    "La intención detectada es queja"
  ];
  
  const ACTION_OPTIONS = [
    "Pausar IA y solicitar traspaso humano",
    "Marcar conversación como Necesita humano",
    "Pedir contexto adicional antes de traspasar",
    "Crear nota interna para el equipo",
    "Escalar solo si ocurre dos veces",
    "Bloquear respuesta automática"
  ];
  
  const REASON_OPTIONS = [
    "Usuario pidió humano",
    "Baja confianza IA",
    "Frustración detectada",
    "Excepción comercial",
    "Fuera de conocimiento",
    "Información sensible",
    "Demasiados intentos",
    "Error crítico",
    "Contacto prioritario",
    "Queja detectada"
  ];
  
  const PRIORITY_OPTIONS = ["Baja", "Media", "Alta"];
  const CHANNELS_OPTIONS = ["WhatsApp", "Instagram", "Web Chat"];
  const AGENTS_OPTIONS = ["Agente de soporte", "Agente de ventas", "Agente de onboarding", "Todos los agentes"];
  
  const DEFAULT_NEW_RULE: Omit<HandoffRule, 'id'> = {
    name: "",
    description: "",
    conditionType: "El usuario pide hablar con una persona",
    actionType: "Pausar IA y solicitar traspaso humano",
    handoffReason: "Usuario pidió humano",
    priority: "Media",
    enabled: true,
    channels: ["WhatsApp", "Instagram", "Web Chat"],
    affectedAgents: ["Todos los agentes"]
  };
  
  export function HandoffRulesView() {
    const [rules, setRules] = useState<HandoffRule[]>(INITIAL_HANDOFF_RULES);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeRuleId, setActiveRuleId] = useState<string | null>(rules[0]?.id || null);
    const [draft, setDraft] = useState<HandoffRule | null>(rules[0] || null);
    const [isCreatingRule, setIsCreatingRule] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
  
    const filteredRules = rules.filter(r => {
      const q = searchQuery.toLowerCase();
      return r.name.toLowerCase().includes(q) || 
             r.description.toLowerCase().includes(q) || 
             r.conditionType.toLowerCase().includes(q) || 
             r.handoffReason.toLowerCase().includes(q);
    });
  
    const handleSelectRule = (rule: HandoffRule) => {
      setIsCreatingRule(false);
      setActiveRuleId(rule.id);
      setDraft({ ...rule });
      setErrorMsg("");
    };
  
    const handleToggleState = (id: string, currentlyEnabled: boolean) => {
      setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !currentlyEnabled } : r));
      if (activeRuleId === id && draft) {
         setDraft({ ...draft, enabled: !currentlyEnabled });
      }
      toast({ title: `Regla ${currentlyEnabled ? "desactivada" : "activada"}` });
    };
  
    const handleCreateRule = () => {
      setIsCreatingRule(true);
      setActiveRuleId(null);
      setDraft({ id: "", ...DEFAULT_NEW_RULE });
      setErrorMsg("");
    };
  
    const handleDiscard = () => {
      if (activeRuleId) {
        const original = rules.find(r => r.id === activeRuleId);
        if (original) setDraft({ ...original });
        setErrorMsg("");
        toast({ title: "Cambios descartados" });
      }
    };
  
    const handleCancelCreate = () => {
      setIsCreatingRule(false);
      setErrorMsg("");
      if (filteredRules.length > 0) {
        handleSelectRule(filteredRules[0]);
      } else if (rules.length > 0) {
         handleSelectRule(rules[0]);
      } else {
         setDraft(null);
         setActiveRuleId(null);
      }
    };
  
    const validateDraft = () => {
      if (!draft) return false;
      if (!draft.name.trim()) { setErrorMsg("Agrega un nombre para guardar la regla."); return false; }
      if (!draft.description.trim()) { setErrorMsg("Agrega una descripción para guardar la regla."); return false; }
      if (!draft.conditionType) { setErrorMsg("Selecciona una condición."); return false; }
      if (!draft.actionType) { setErrorMsg("Selecciona una acción."); return false; }
      if (!draft.handoffReason) { setErrorMsg("Selecciona un motivo."); return false; }
      setErrorMsg("");
      return true;
    };
  
    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateDraft()) return;
  
      if (isCreatingRule && draft) {
        const newId = `rule-${Date.now()}`;
        const newRule = { ...draft, id: newId };
        setRules([newRule, ...rules]);
        setIsCreatingRule(false);
        setActiveRuleId(newId);
        // Do not reset draft as it represents the current selected rule now
        setDraft({...newRule});
        toast({ title: "Regla creada" });
      } else if (activeRuleId && draft) {
        setRules(prev => prev.map(r => r.id === activeRuleId ? { ...draft } : r));
        toast({ title: "Regla actualizada" });
      }
    };
  
    const handleDeleteRule = () => {
      if (window.confirm("¿Estás seguro de que deseas eliminar esta regla?")) {
        const newRules = rules.filter(r => r.id !== activeRuleId);
        setRules(newRules);
        toast({ title: "Regla eliminada" });
        if (newRules.length > 0) {
          handleSelectRule(newRules[0]);
        } else {
          setActiveRuleId(null);
          setDraft(null);
        }
      }
    };
  
    const updateDraft = (key: keyof HandoffRule, value: any) => {
      if (draft) {
        setDraft({ ...draft, [key]: value });
        setErrorMsg("");
      }
    };
  
    const toggleChannel = (channel: string) => {
      if (!draft) return;
      const current = draft.channels;
      if (current.includes(channel)) {
        updateDraft("channels", current.filter(c => c !== channel));
      } else {
        updateDraft("channels", [...current, channel]);
      }
    };
  
    const toggleAgent = (agent: string) => {
      if (!draft) return;
      const current = draft.affectedAgents;
      if (current.includes(agent)) {
        updateDraft("affectedAgents", current.filter(a => a !== agent));
      } else {
        updateDraft("affectedAgents", [...current, agent]);
      }
    };
  
    return (
      <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
        <div className="flex items-center justify-between border-b px-8 py-5 shrink-0 bg-background z-10">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Reglas de transferencia humana</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Define cuándo la IA debe detenerse y pedir ayuda a una persona.</p>
          </div>
          <Button onClick={handleCreateRule} className="shadow-sm">
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
                 <Input 
                    placeholder="Buscar regla..." 
                    className="shadow-none bg-muted/50" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {isCreatingRule && draft && (
                    <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 shadow-sm cursor-pointer transition-colors">
                       <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-sm text-foreground">{draft.name || "Nueva regla"}</div>
                          <Switch disabled checked={draft.enabled} value="on" />
                       </div>
                       <div className="text-xs text-muted-foreground line-clamp-1 mb-3">{draft.description || "Nueva descripción"}</div>
                       <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-normal text-[10px]">{draft.priority}</Badge>
                          <Badge variant={draft.enabled ? 'outline' : 'secondary'} className="font-normal text-[10px] shadow-none">{draft.enabled ? 'Activa' : 'Inactiva'}</Badge>
                       </div>
                    </div>
                 )}
  
                 {filteredRules.map(rule => (
                    <div 
                       key={rule.id} 
                       onClick={() => handleSelectRule(rule)}
                       className={`p-4 rounded-xl border cursor-pointer transition-colors ${(!isCreatingRule && activeRuleId === rule.id) ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-background hover:bg-muted/50 shadow-sm'}`}
                    >
                       <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-sm text-foreground">{rule.name}</div>
                          <Switch 
                             checked={rule.enabled}
                             value="on"
                             onCheckedChange={() => handleToggleState(rule.id, rule.enabled)}
                             onClick={(e) => e.stopPropagation()}
                          />
                       </div>
                       <div className="text-xs text-muted-foreground line-clamp-1 mb-3">{rule.description}</div>
                       <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-normal text-[10px]">{rule.priority}</Badge>
                          <Badge variant={rule.enabled ? 'outline' : 'secondary'} className="font-normal text-[10px] shadow-none">{rule.enabled ? 'Activa' : 'Inactiva'}</Badge>
                       </div>
                    </div>
                 ))}
                 {!isCreatingRule && filteredRules.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">No encontramos reglas con ese criterio.</div>
                 )}
              </div>
           </div>
           <div className="flex-1 overflow-y-auto bg-background p-8 lg:p-12">
              {draft ? (
                 <form noValidate onSubmit={handleSave} className="max-w-3xl mx-auto space-y-10">
                    <div>
                       <h2 className="text-2xl font-semibold tracking-tight mb-2">
                          {isCreatingRule ? "Crear regla de transferencia" : "Editar regla de transferencia"}
                       </h2>
                       <p className="text-sm text-muted-foreground">Configura las condiciones bajo las cuales se activará este disparador de transferencia humana.</p>
                       {errorMsg && (
                         <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200">
                           <i className="ri-error-warning-line mr-2"></i>{errorMsg}
                         </div>
                       )}
                    </div>
  
                    <div className="space-y-4">
                       <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Información general</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Nombre de la regla</label>
                            <Input value={draft.name} onChange={(e) => updateDraft("name", e.target.value)} placeholder="Ej. Usuario frustrado" />
                         </div>
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground">Descripción</label>
                            <Input value={draft.description} onChange={(e) => updateDraft("description", e.target.value)} placeholder="Breve descripción del propósito..." />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">Prioridad</label>
                            <Select value={draft.priority} onValueChange={(v) => updateDraft("priority", v)}>
                               <SelectTrigger><SelectValue placeholder="Selecciona una prioridad" /></SelectTrigger>
                               <SelectContent>
                                  {PRIORITY_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                               </SelectContent>
                            </Select>
                         </div>
                         <div className="space-y-2 flex flex-col justify-end">
                            <div className="flex items-center gap-3 border rounded-lg px-4 h-9 bg-muted/5">
                               <Switch 
                                  checked={draft.enabled}
                                  value="on"
                                  onCheckedChange={(v) => updateDraft("enabled", v)}
                               />
                               <span className="text-sm font-medium">{draft.enabled ? "Regla activa" : "Regla inactiva"}</span>
                            </div>
                         </div>
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
                                <Select value={draft.conditionType} onValueChange={(v) => updateDraft("conditionType", v)}>
                                   <SelectTrigger><SelectValue placeholder="Selecciona una condición" /></SelectTrigger>
                                   <SelectContent>
                                      {CONDITION_OPTIONS.map(opt => (
                                         <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                      ))}
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
                          <div className="mb-4">
                             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACCIÓN Y MOTIVO</label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Select value={draft.actionType} onValueChange={(v) => updateDraft("actionType", v)}>
                                   <SelectTrigger><SelectValue placeholder="Selecciona una acción" /></SelectTrigger>
                                   <SelectContent>
                                      {ACTION_OPTIONS.map(opt => (
                                         <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                             </div>
                             <div className="space-y-2">
                                <Select value={draft.handoffReason} onValueChange={(v) => updateDraft("handoffReason", v)}>
                                   <SelectTrigger><SelectValue placeholder="Selecciona un motivo" /></SelectTrigger>
                                   <SelectContent>
                                      {REASON_OPTIONS.map(opt => (
                                         <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                             </div>
                          </div>
                       </div>
                    </div>
  
                    <div className="space-y-4">
                       <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Alcance</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-xs font-semibold text-muted-foreground">Canales aplicables</label>
                             <div className="space-y-2">
                                {CHANNELS_OPTIONS.map(ch => (
                                   <label key={ch} className="flex items-center gap-2 cursor-pointer">
                                      <Checkbox value="on" checked={draft.channels.includes(ch)} onCheckedChange={() => toggleChannel(ch)} />
                                      <span className="text-sm">{ch}</span>
                                   </label>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-3">
                             <label className="text-xs font-semibold text-muted-foreground">Agentes afectados</label>
                             <div className="space-y-2">
                                {AGENTS_OPTIONS.map(ag => (
                                   <label key={ag} className="flex items-center gap-2 cursor-pointer">
                                      <Checkbox value="on" checked={draft.affectedAgents.includes(ag)} onCheckedChange={() => toggleAgent(ag)} />
                                      <span className="text-sm">{ag}</span>
                                   </label>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
  
                    <div className="space-y-4">
                       <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vista previa</h3>
                       <div className="p-4 bg-muted/40 rounded-lg border text-sm text-muted-foreground">
                          Si <span className="font-semibold text-foreground">{draft.conditionType}</span>, entonces <span className="font-semibold text-foreground">{draft.actionType}</span> y el motivo registrado será <span className="font-semibold text-foreground">{draft.handoffReason}</span>.
                       </div>
                    </div>
  
                    <div className="pt-6 border-t flex flex-wrap items-center justify-between gap-4">
                       <div>
                          {!isCreatingRule && (
                            <Button type="button" variant="destructive" onClick={handleDeleteRule}><i className="ri-delete-bin-line mr-2"></i> Eliminar regla</Button>
                          )}
                       </div>
                       <div className="flex items-center gap-2">
                          {isCreatingRule ? (
                             <Button type="button" variant="outline" onClick={handleCancelCreate}>Cancelar</Button>
                          ) : (
                             <Button type="button" variant="outline" onClick={handleDiscard}>Descartar cambios</Button>
                          )}
                          <Button type="submit">
                             {isCreatingRule ? "Guardar regla" : "Guardar cambios"}
                          </Button>
                       </div>
                    </div>
                 </form>
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
