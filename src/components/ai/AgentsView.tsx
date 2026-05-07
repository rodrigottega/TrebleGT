import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MOCK_AGENTS, MOCK_KNOWLEDGE_BASES } from "@/data/mockData";
import { toast } from "@/components/ui/toaster";

export function AgentsView() {
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [mode, setMode] = useState<"list" | "edit">("list");
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false); // To autofocus test panel
  const [testMessages, setTestMessages] = useState<{sender: string, text: string}[]>([]);

  const toggleAgent = (id: string, currentStatus: string) => {
    setAgents(prev => prev.map(a => 
      a.id === id ? { ...a, estado: currentStatus === "Activo" ? "Pausado" : "Activo" } : a
    ));
    toast({ title: currentStatus === "Activo" ? "Agente pausado" : "Agente activado" });
  };

  if (mode === "edit") {
     const agent = activeAgentId ? agents.find(a => a.id === activeAgentId) : null;

     const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.target as HTMLFormElement);
        
        const nombre = fd.get("nombre") as string;
        const objetivo = fd.get("objetivo") as string;
        
        // Collect checked channels
        const formDataObj = Object.fromEntries(fd.entries());
        const canales = ["WhatsApp", "Instagram", "Web Chat"].filter(c => fd.get(`canal_${c}`) === "on");
        
        if (!nombre?.trim()) {
           toast({ title: "Atención", description: "Agrega un nombre para crear el agente.", variant: "destructive" });
           return;
        }

        if (!objetivo?.trim()) {
           toast({ title: "Atención", description: "Agrega un objetivo principal para el agente.", variant: "destructive" });
           return;
        }

        if (canales.length === 0) {
           toast({ title: "Atención", description: "Debes seleccionar al menos un canal.", variant: "destructive" });
           return;
        }

        if(activeAgentId) {
           setAgents(prev => prev.map(a => a.id === activeAgentId ? { ...a, nombre, objetivo, canales } : a));
           toast({ title: "Agente guardado" });
        } else {
           const newA = {
              id: `ag-${Date.now()}`,
              nombre,
              descripción: fd.get("descripcion") as string,
              estado: fd.get("estado") as string || "Borrador",
              objetivo,
              tono: fd.get("tono") as string || "Profesional",
              canales,
              fuentesConocimiento: [],
              conversacionesGestionadas: 0,
              tasaResolucion: 0,
              tasaTraspasoHumano: 0,
              ultimaActualizacion: new Date().toISOString()
           };
           setAgents([newA, ...agents]);
           toast({ title: "Agente creado" });
        }
        setMode("list");
     };

     const handleTest = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.target as HTMLFormElement);
        const msg = fd.get("testMsg") as string;
        if(!msg.trim()) return;

        const newMsgs = [...testMessages, { sender: "user", text: msg }];
        setTestMessages(newMsgs);
        (e.target as HTMLFormElement).reset();

        setTimeout(() => {
           setTestMessages([...newMsgs, { sender: "ai", text: "Esta es una respuesta simulada por la IA basándose en su configuración." }]);
        }, 1000);
     };

     return (
        <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
           <div className="flex items-center justify-between border-b px-8 py-5 shrink-0">
              <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon" onClick={() => setMode("list")}><i className="ri-arrow-left-line text-lg"></i></Button>
                 <div>
                    <h1 className="text-xl font-semibold tracking-tight">{agent ? "Configurar agente" : "Nuevo agente"}</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Define el comportamiento, canales, conocimiento y reglas de este agente.</p>
                 </div>
              </div>
              <Button type="submit" form="agent-form">{activeAgentId ? "Guardar cambios" : "Crear agente"}</Button>
           </div>
           
           <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
              <div className="overflow-y-auto p-8 border-r">
                 <form id="agent-form" onSubmit={handleSave} className="space-y-8" noValidate>
                    <div className="space-y-4">
                       <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Información general</h3>
                       <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground">Nombre del agente</label>
                          <Input name="nombre" defaultValue={agent?.nombre} placeholder="Ej. Agente de Soporte Técnico" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground">Descripción</label>
                          <Input name="descripcion" defaultValue={agent?.descripción} placeholder="Breve resumen de sus responsabilidades" />
                       </div>
                       <div className="space-y-2">
                           <label className="text-xs font-semibold text-muted-foreground">Objetivo principal</label>
                           <Textarea name="objetivo" defaultValue={agent?.objetivo} placeholder="Ej. Resolver dudas técnicas recurrentes con precisión" className="h-16" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-xs font-semibold text-muted-foreground">Tono de respuesta</label>
                             <Select name="tono" defaultValue={agent ? "amable" : "profesional"}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="profesional">Profesional y directo</SelectItem>
                                   <SelectItem value="amable">Amable y empático</SelectItem>
                                   <SelectItem value="persuasivo">Persuasivo y comercial</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-semibold text-muted-foreground">Estado</label>
                             <Select name="estado" defaultValue={agent?.estado === "Activo" ? "Activo" : "Borrador"}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="Activo">Activo</SelectItem>
                                   <SelectItem value="Pausado">Pausado</SelectItem>
                                   <SelectItem value="Borrador">Borrador</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Instrucciones</h3>
                       <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground">Rol del agente (System Prompt)</label>
                          <Textarea name="rol" className="h-24" placeholder="Eres un asistente de soporte experto en..." defaultValue={agent ? `Eres ${agent.nombre}. Tu objetivo es ${agent.objetivo}.` : ""} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground">Mensaje de bienvenida</label>
                          <Textarea name="bienvenida" className="h-16" placeholder="¡Hola! Soy Nebula..." defaultValue="¡Hola! ¿En qué te puedo ayudar hoy?" />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Canales conectados</h3>
                       <div className="grid grid-cols-2 gap-4">
                          {["WhatsApp", "Instagram", "Web Chat"].map(c => (
                             <Card key={c} className="shadow-none">
                                <CardContent className="p-4 flex items-center justify-between">
                                   <span className="text-sm font-medium">{c}</span>
                                   <Switch name={`canal_${c}`} defaultChecked={agent?.canales.includes(c)} value="on" />
                                </CardContent>
                             </Card>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Bases de conocimiento</h3>
                       <div className="grid grid-cols-1 gap-3">
                          {MOCK_KNOWLEDGE_BASES.map(kb => (
                             <Card key={kb.id} className="shadow-none">
                                <CardContent className="p-4 flex items-center gap-3">
                                   <Checkbox name={`kb_${kb.id}`} defaultChecked={agent?.fuentesConocimiento.includes(kb.id)} value="on" />
                                   <div className="space-y-0.5">
                                      <div className="text-sm font-medium">{kb.nombre}</div>
                                      <div className="text-xs text-muted-foreground line-clamp-1">{kb.descripción}</div>
                                   </div>
                                </CardContent>
                             </Card>
                          ))}
                       </div>
                    </div>

                 </form>
              </div>

              <div className="bg-muted/10 border-l flex flex-col items-center justify-center p-8">
                 <div className="w-full max-w-md bg-background border shadow-xl rounded-xl flex flex-col h-[600px] overflow-hidden">
                    <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
                       <div className="font-medium flex items-center gap-2"><i className="ri-robot-2-line"></i> Tester Live: {agent?.nombre || "Agente sin guardar"}</div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                       {testMessages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-xl">
                             <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                <i className="ri-flask-line text-2xl text-muted-foreground"></i>
                             </div>
                             <h4 className="font-medium text-foreground mb-1">Entorno de pruebas</h4>
                             <p className="text-sm text-muted-foreground">Escribe un mensaje para probar cómo reaccionaría el agente con esta configuración.</p>
                          </div>
                       ) : (
                          testMessages.map((msg, idx) => (
                             <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`text-sm py-2 px-3 rounded-lg max-w-[85%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none'}`}>
                                   {msg.text}
                                   {msg.sender === 'ai' && (
                                     <div className="mt-2 text-[10px] text-muted-foreground pt-2 border-t border-border/50">
                                        <div className="flex items-center gap-1"><i className="ri-shield-check-line"></i> Confianza: 92%</div>
                                        <div className="flex items-center gap-1"><i className="ri-book-read-line"></i> Fuentes: 2 usadas</div>
                                     </div>
                                   )}
                                </div>
                             </div>
                          ))
                       )}
                    </div>
                    <div className="p-3 border-t bg-background">
                       <form onSubmit={handleTest} className="flex items-center gap-2" noValidate>
                          <Input name="testMsg" placeholder="Enviar mensaje de prueba..." autoFocus={isTesting} className="flex-1" />
                          <Button type="submit" size="icon"><i className="ri-send-plane-fill"></i></Button>
                       </form>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agentes</h1>
          <p className="text-sm text-muted-foreground mt-1">Configura agentes, prueba comportamientos y monitorea la actividad.</p>
        </div>
        <Button className="shadow-sm" onClick={() => { setActiveAgentId(null); setMode("edit"); setIsTesting(false); setTestMessages([]); }}>
          <i className="ri-robot-2-line mr-2"></i> Nuevo agente
        </Button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map(a => (
            <Card key={a.id} className="flex flex-col transition-shadow hover:shadow-md border">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className={a.estado === 'Activo' ? 'text-foreground bg-muted border-transparent' : 'text-muted-foreground bg-muted border-transparent'}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${a.estado === 'Activo' ? 'bg-foreground' : 'bg-muted-foreground'}`}></div>
                    {a.estado}
                  </Badge>
                  <Switch 
                     checked={a.estado === "Activo"}
                     onCheckedChange={() => toggleAgent(a.id, a.estado)}
                  />
                </div>
                <CardTitle className="text-lg">{a.nombre}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1 min-h-[40px]">{a.descripción}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-0 pb-6">
                <div className="space-y-4">
                  <div>
                     <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Canales</div>
                     <div className="flex flex-wrap gap-1.5">
                       {a.canales.map(c => (
                         <Badge key={c} variant="secondary" className="font-normal bg-muted">
                           <i className={`${c === 'WhatsApp' ? 'ri-whatsapp-line' : c === 'Instagram' ? 'ri-instagram-line' : 'ri-chat-smile-3-line'} mr-1 text-muted-foreground`}></i> {c}
                         </Badge>
                       ))}
                     </div>
                  </div>
                  <div>
                     <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Métricas</div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                           <span className="text-2xl font-semibold tracking-tight">{a.tasaResolucion}%</span>
                           <span className="text-xs text-muted-foreground">Tasa resolución</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-2xl font-semibold tracking-tight">{a.conversacionesGestionadas}</span>
                           <span className="text-xs text-muted-foreground">Chats</span>
                        </div>
                     </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                   <Button variant="outline" className="w-full shadow-sm bg-background" onClick={() => { setActiveAgentId(a.id); setMode("edit"); setIsTesting(false); setTestMessages([]); }}>Configurar</Button>
                   <Button variant="secondary" className="w-full shadow-sm" onClick={() => { setActiveAgentId(a.id); setMode("edit"); setIsTesting(true); setTestMessages([]); }}>Probar</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
