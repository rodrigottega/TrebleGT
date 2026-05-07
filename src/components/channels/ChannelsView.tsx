import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { MOCK_CHANNEL_METRICS, MOCK_CHANNELS, MOCK_CONVERSATIONS, MOCK_ROUTING_RULES } from "@/data/mockData";

export function ChannelsView({ secondaryTab }: { secondaryTab: string }) {

  if (secondaryTab === "Métricas") return <MetricsView />;
  if (secondaryTab === "WhatsApp") return <WhatsAppView />;
  if (secondaryTab === "Instagram") return <InstagramView />;
  if (secondaryTab === "Web Chat") return <WebChatView />;
  if (secondaryTab === "Asignación automática") return <AutoAssignView />;
  if (secondaryTab === "Estado de conexión") return <ConnectionStatusView />;

  return <MetricsView />;
}

function MetricsView() {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Métricas de canales</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitorea conversaciones, tiempos de respuesta y desempeño por canal.</p>
        </div>
      </div>
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Conversaciones hoy", value: MOCK_CHANNEL_METRICS.conversacionesHoy, icon: "ri-message-3-line" },
            { label: "Nuevas conversaciones", value: MOCK_CHANNEL_METRICS.nuevasConversaciones, icon: "ri-user-add-line" },
            { label: "Primera respuesta", value: MOCK_CHANNEL_METRICS.tiempoPrimeraRespuesta, icon: "ri-timer-line" },
            { label: "Gestionadas por IA", value: MOCK_CHANNEL_METRICS.gestionadasIA, icon: "ri-robot-2-line" },
            { label: "Traspasos a humano", value: MOCK_CHANNEL_METRICS.traspasosHumano, icon: "ri-user-shared-line" },
            { label: "Tasa de resolución", value: MOCK_CHANNEL_METRICS.tasaResolucion, icon: "ri-check-double-line" },
          ].map((stat, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-4 flex flex-col items-start gap-2">
                <i className={`${stat.icon} text-muted-foreground text-lg mb-1`}></i>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 shadow-sm">
              <CardHeader>
                 <CardTitle>Rendimiento por canal</CardTitle>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                       <TableRow>
                          <TableHead>Canal</TableHead>
                          <TableHead>Conversaciones</TableHead>
                          <TableHead>Gestionadas por IA</TableHead>
                          <TableHead>Traspasos</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       <TableRow>
                          <TableCell className="font-medium"><i className="ri-whatsapp-line text-green-600 mr-2"></i> WhatsApp</TableCell>
                          <TableCell>210</TableCell>
                          <TableCell>89%</TableCell>
                          <TableCell>23</TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="font-medium"><i className="ri-instagram-line text-pink-600 mr-2"></i> Instagram</TableCell>
                          <TableCell>145</TableCell>
                          <TableCell>95%</TableCell>
                          <TableCell>7</TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="font-medium"><i className="ri-chat-smile-3-line text-blue-600 mr-2"></i> Web Chat</TableCell>
                          <TableCell>91</TableCell>
                          <TableCell>70%</TableCell>
                          <TableCell>27</TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>

           <Card className="shadow-sm">
              <CardHeader>
                 <CardTitle>Intenciones principales</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {[
                       { name: "Soporte Técnico", val: 45 },
                       { name: "Precios y Planes", val: 30 },
                       { name: "Agendar Demo", val: 15 },
                       { name: "Quejas", val: 10 }
                    ].map(item => (
                       <div key={item.name} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                             <span className="font-medium">{item.name}</span>
                             <span className="text-muted-foreground">{item.val}%</span>
                          </div>
                          <Progress value={item.val} className="h-2" />
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}

function WhatsAppView() {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
             <i className="ri-whatsapp-fill text-[#25D366]"></i> WhatsApp Business
             <Badge variant="outline" className="ml-2 font-normal">Conectado</Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Administra tu número, agente asignado y desempeño de conversaciones en WhatsApp.</p>
        </div>
      </div>
      <div className="p-8 space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm border-primary/20 bg-primary/5">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Número conectado</div>
                  <div className="text-xl font-semibold mb-2">+52 55 1234 5678</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><i className="ri-verified-badge-fill text-primary"></i> Perfil Verificado</div>
               </CardContent>
            </Card>
            <Card className="shadow-sm">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Conversaciones hoy</div>
                  <div className="text-xl font-semibold mb-2">210</div>
                  <div className="text-xs text-green-600 flex items-center gap-1"><i className="ri-arrow-up-line"></i> +12% vs ayer</div>
               </CardContent>
            </Card>
            <Card className="shadow-sm">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">IA en WhatsApp</div>
                  <div className="text-xl font-semibold mb-2 truncate">Agente de Ventas</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">Auto-respuesta y traspaso activos</div>
               </CardContent>
            </Card>
            <Card className="shadow-sm">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Salud del canal</div>
                  <div className="text-xl font-semibold text-green-600 mb-2">100%</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">Webhook activo, 0 errores críticos</div>
               </CardContent>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 shadow-sm h-fit">
               <CardHeader>
                  <CardTitle>Configuración</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agente asignado</label>
                     <Select defaultValue="sales">
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="sales">Agente de Ventas</SelectItem>
                           <SelectItem value="support">Agente de Soporte</SelectItem>
                           <SelectItem value="onboarding">Agente de Onboarding</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <div className="text-sm font-medium">Auto-respuesta IA</div>
                        <div className="text-xs text-muted-foreground">La IA responde automáticamente</div>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <div className="text-sm font-medium">Traspaso a humano</div>
                        <div className="text-xs text-muted-foreground">Permitir derivar a equipo</div>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <Button className="w-full" onClick={() => toast({ title: "Configuración guardada" })}>Guardar cambios</Button>
               </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-sm">
               <CardHeader>
                  <CardTitle>Conversaciones recientes (WhatsApp)</CardTitle>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Contacto</TableHead>
                           <TableHead>Estado</TableHead>
                           <TableHead>Último mensaje</TableHead>
                           <TableHead></TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {MOCK_CONVERSATIONS.filter(c => c.canal === 'WhatsApp').slice(0, 5).map(c => (
                           <TableRow key={c.id}>
                              <TableCell className="font-medium">{c.contactoName}</TableCell>
                              <TableCell><Badge variant="outline" className="shadow-none font-normal text-xs">{c.estado}</Badge></TableCell>
                              <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">{c.ultimoMensaje}</TableCell>
                              <TableCell className="text-right"><Button variant="ghost" size="sm">Ver Inbox</Button></TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}

function InstagramView() {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
             <i className="ri-instagram-fill text-pink-600"></i> Instagram Direct
             <Badge variant="outline" className="ml-2 font-normal">Conectado</Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona mensajes de Instagram, automatización IA y actividad reciente.</p>
        </div>
      </div>
      <div className="p-8 space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm border-primary/20 bg-primary/5">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Cuenta conectada</div>
                  <div className="text-xl font-semibold mb-2">@nebula_support</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><i className="ri-check-line text-primary"></i> Permisos correctos</div>
               </CardContent>
            </Card>
            <Card className="shadow-sm">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Conversaciones hoy</div>
                  <div className="text-xl font-semibold mb-2">145</div>
               </CardContent>
            </Card>
            <Card className="shadow-sm">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">IA en Instagram</div>
                  <div className="text-xl font-semibold mb-2 truncate">Agente de Soporte</div>
               </CardContent>
            </Card>
            <Card className="shadow-sm">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Salud del canal</div>
                  <div className="text-xl font-semibold text-green-600 mb-2">100%</div>
               </CardContent>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 shadow-sm h-fit">
               <CardHeader>
                  <CardTitle>Configuración</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agente asignado</label>
                     <Select defaultValue="support">
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="sales">Agente de Ventas</SelectItem>
                           <SelectItem value="support">Agente de Soporte</SelectItem>
                           <SelectItem value="onboarding">Agente de Onboarding</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <div className="text-sm font-medium">Auto-respuesta IA</div>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <div className="text-sm font-medium">Responder solo cuentas nuevas</div>
                     </div>
                     <Switch />
                  </div>
                  <Button className="w-full" onClick={() => toast({ title: "Configuración guardada" })}>Guardar cambios</Button>
               </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-sm">
               <CardHeader>
                  <CardTitle>Conversaciones recientes (Instagram)</CardTitle>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Contacto</TableHead>
                           <TableHead>Estado</TableHead>
                           <TableHead>Último mensaje</TableHead>
                           <TableHead></TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {MOCK_CONVERSATIONS.filter(c => c.canal === 'Instagram').slice(0, 5).map(c => (
                           <TableRow key={c.id}>
                              <TableCell className="font-medium">{c.contactoName}</TableCell>
                              <TableCell><Badge variant="outline" className="shadow-none font-normal text-xs">{c.estado}</Badge></TableCell>
                              <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">{c.ultimoMensaje}</TableCell>
                              <TableCell className="text-right"><Button variant="ghost" size="sm">Ver Inbox</Button></TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}

function WebChatView() {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
             <i className="ri-chat-smile-3-fill text-blue-500"></i> Web Chat
             <Badge variant="outline" className="ml-2 font-normal">Conectado</Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Configura el widget embebido para tu sitio web.</p>
        </div>
      </div>
      <div className="p-8 space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm border-primary/20 bg-primary/5">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Widget activo</div>
                  <div className="text-xl font-semibold mb-2 truncate">Nebula Assistant</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">demo.nebula.ai</div>
               </CardContent>
            </Card>
            <Card className="shadow-sm">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Conversaciones hoy</div>
                  <div className="text-xl font-semibold mb-2">91</div>
               </CardContent>
            </Card>
            <Card className="shadow-sm">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">IA en Web Chat</div>
                  <div className="text-xl font-semibold mb-2 truncate">Agente de Soporte</div>
               </CardContent>
            </Card>
            <Card className="shadow-sm bg-muted/20">
               <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Instalación</div>
                  <div className="text-md font-medium text-foreground mb-2"><Button onClick={() => toast({ title: "Script copiado" })} variant="outline" size="sm" className="h-8"><i className="ri-file-copy-line mr-2"></i> Copiar script</Button></div>
               </CardContent>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 shadow-sm h-fit">
               <CardHeader>
                  <CardTitle>Configuración del widget</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre del widget</label>
                     <Input defaultValue="Nebula Assistant" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mensaje de bienvenida</label>
                     <Input defaultValue="Hola, ¿en qué podemos ayudarte?" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Posición</label>
                     <Select defaultValue="derecha">
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="derecha">Derecha</SelectItem>
                           <SelectItem value="izquierda">Izquierda</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agente asignado</label>
                     <Select defaultValue="support">
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="sales">Agente de Ventas</SelectItem>
                           <SelectItem value="support">Agente de Soporte</SelectItem>
                           <SelectItem value="onboarding">Agente de Onboarding</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <Button className="w-full" onClick={() => toast({ title: "Configuración guardada" })}>Guardar cambios</Button>
               </CardContent>
            </Card>
            
            <div className="lg:col-span-2 space-y-8">
               <Card className="shadow-sm overflow-hidden flex flex-col items-center justify-center p-12 bg-muted/20 border-dashed">
                  <div className="w-[320px] rounded-xl shadow-xl bg-background border flex flex-col overflow-hidden">
                     <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
                        <div className="font-medium">Nebula Assistant</div>
                        <i className="ri-close-line text-xl opacity-80"></i>
                     </div>
                     <div className="flex-1 p-4 bg-muted/10 space-y-4">
                        <div className="flex justify-start">
                           <div className="bg-muted text-foreground text-sm py-2 px-3 rounded-lg rounded-tl-none inline-block">
                              Hola, ¿en qué podemos ayudarte?
                           </div>
                        </div>
                        <div className="flex justify-end">
                           <div className="bg-primary text-primary-foreground text-sm py-2 px-3 rounded-lg rounded-tr-none inline-block">
                              Necesito ayuda con mi pago
                           </div>
                        </div>
                        <div className="flex justify-start">
                           <div className="bg-muted text-foreground text-sm py-2 px-3 rounded-lg rounded-tl-none inline-block">
                              Claro, con gusto reviso el estado de tu pago.
                           </div>
                        </div>
                     </div>
                     <div className="p-3 border-t bg-background flex items-center gap-2 text-muted-foreground">
                        <i className="ri-add-line text-lg"></i>
                        <span className="text-sm">Escribe un mensaje...</span>
                     </div>
                  </div>
               </Card>

               <Card className="shadow-sm">
                  <CardHeader>
                     <CardTitle>Conversaciones recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Contacto</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Último mensaje</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {MOCK_CONVERSATIONS.filter(c => c.canal === 'Web Chat').slice(0, 5).map(c => (
                              <TableRow key={c.id}>
                                 <TableCell className="font-medium">{c.contactoName}</TableCell>
                                 <TableCell><Badge variant="outline" className="shadow-none font-normal text-xs">{c.estado}</Badge></TableCell>
                                 <TableCell className="max-w-[300px] truncate text-muted-foreground text-sm">{c.ultimoMensaje}</TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
    </div>
  )
}

const INITIAL_RULES = [
  { id: "1", nombre: "WhatsApp + Precios", condicion: "Nueva conversación de WhatsApp con intención Precios", destino: "Agente de ventas", prioridad: "Media", estado: "Activo" },
  { id: "2", nombre: "Web Chat + Soporte", condicion: "Nueva conversación de Web Chat con intención Soporte", destino: "Agente de soporte", prioridad: "Alta", estado: "Activo" },
  { id: "3", nombre: "Instagram + Demo", condicion: "Nueva conversación de Instagram con intención Demo", destino: "Agente de ventas", prioridad: "Media", estado: "Activo" },
  { id: "4", nombre: "Onboarding", condicion: "La intención detectada es Onboarding", destino: "Agente de onboarding", prioridad: "Baja", estado: "Activo" },
  { id: "5", nombre: "Alta prioridad", condicion: "El contacto tiene prioridad Alta", destino: "Laura Gómez", prioridad: "Alta", estado: "Activo" },
  { id: "6", nombre: "Baja confianza IA", condicion: "La conversación fue marcada como Necesita humano por baja confianza IA", destino: "Cola humana", prioridad: "Alta", estado: "Activo" },
  { id: "7", nombre: "Usuario pidió humano", condicion: "La conversación fue marcada como Necesita humano porque el usuario pidió hablar con una persona", destino: "Equipo de soporte", prioridad: "Alta", estado: "Activo" },
  { id: "8", nombre: "Sin propietario", condicion: "La conversación lleva más de 5 minutos sin propietario", destino: "Cola humana", prioridad: "Media", estado: "Activo" }
];

function AutoAssignView() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const openNew = () => {
     setEditingRuleId(null);
     setIsSheetOpen(true);
  };

  const openEdit = (id: string) => {
     setEditingRuleId(id);
     setIsSheetOpen(true);
  };

  const deleteRule = (id: string) => {
     if(confirm("¿Seguro que deseas eliminar esta regla?")) {
        setRules(rules.filter(r => r.id !== id));
        setIsSheetOpen(false);
        toast({ title: "Regla eliminada" });
     }
  };

  const handleSave = (e: React.FormEvent) => {
     e.preventDefault();
     const fd = new FormData(e.target as HTMLFormElement);
     
     const tipoEvento = fd.get("tipo_evento") as string;
     const canal = fd.get("canal") as string;
     const intencion = fd.get("intencion") as string;
     const motivo = fd.get("motivo") as string;
     const newName = (fd.get("nombre") as string) || "Nueva regla";
     
     let generatedCondition = "Nueva regla";
     if (tipoEvento === "nueva") {
        generatedCondition = `Nueva conversación de ${canal === 'Cualquier canal' ? 'Cualquier canal' : canal} con intención ${intencion === 'Cualquier intención' ? 'Cualquiera' : intencion}`;
     } else if (tipoEvento === "necesita_humano") {
        generatedCondition = `Conversación marcada como Necesita humano porque ${motivo === 'No aplica' ? 'se pidió traspaso' : motivo}`;
     } else if (tipoEvento === "sin_propietario") {
        generatedCondition = `La conversación lleva tiempo sin propietario`;
     }

     const ruleData = {
        nombre: newName,
        condicion: generatedCondition,
        destino: fd.get("destino") as string,
        prioridad: fd.get("prioridad") as string,
        estado: (fd.get("estado") as string) === "Activo" ? "Activo" : "Inactivo"
     };

     if (editingRuleId) {
        setRules(rules.map(r => r.id === editingRuleId ? { ...r, ...ruleData } : r));
        toast({ title: "Regla actualizada" });
     } else {
        setRules([...rules, { id: `rr-${Date.now()}`, ...ruleData }]);
        toast({ title: "Regla creada" });
     }
     setIsSheetOpen(false);
  };

  const currentEditData = editingRuleId ? rules.find(r => r.id === editingRuleId) : null;

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <div className="flex items-center justify-between border-b px-8 py-5 shrink-0 bg-background z-10">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Asignación automática</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Define quién recibe una conversación según canal, intención, prioridad o motivo de traspaso.</p>
        </div>
        <Button onClick={openNew} className="shadow-sm">Nueva regla</Button>
      </div>

      <div className="bg-primary/5 px-8 py-3 flex items-start gap-2 border-b shrink-0">
        <i className="ri-information-fill text-primary mt-0.5"></i>
        <p className="text-sm text-muted-foreground">Esta sección no decide cuándo la IA debe escalar. Solo define a quién se asigna la conversación cuando entra, queda sin propietario o necesita intervención humana. Las reglas se aplican después de recibir una conversación o después de que una regla de traspaso humano marque la conversación como Necesita humano.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8">
         <Card className="shadow-sm">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="pl-6 w-[200px]">Regla</TableHead>
                     <TableHead>Se activa cuando</TableHead>
                     <TableHead>Destino</TableHead>
                     <TableHead>Prioridad</TableHead>
                     <TableHead>Estado</TableHead>
                     <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {rules.map(rule => (
                     <TableRow key={rule.id}>
                        <TableCell className="pl-6 font-medium truncate">{rule.nombre}</TableCell>
                        <TableCell className="text-muted-foreground text-xs leading-relaxed max-w-[300px]">{rule.condicion}</TableCell>
                        <TableCell className="text-foreground text-sm font-medium">{rule.destino}</TableCell>
                        <TableCell>
                           <Badge variant={rule.prioridad === "Alta" ? "destructive" : rule.prioridad === "Media" ? "default" : "secondary"} className="shadow-none text-[10px] font-bold uppercase">{rule.prioridad}</Badge>
                        </TableCell>
                        <TableCell>
                           <Switch checked={rule.estado === "Activo"} onCheckedChange={(val) => {
                              setRules(rules.map(r => r.id === rule.id ? { ...r, estado: val ? "Activo" : "Inactivo" } : r));
                           }} />
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <Button variant="ghost" size="sm" onClick={() => openEdit(rule.id)}>Editar</Button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Card>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
         <SheetContent side="right" className="w-[450px] sm:max-w-none p-0 flex flex-col">
            <form onSubmit={handleSave} noValidate className="flex flex-col h-full">
               <div className="p-6 border-b shrink-0">
                  <SheetHeader>
                     <SheetTitle>{editingRuleId ? "Editar regla de asignación" : "Nueva regla de asignación"}</SheetTitle>
                     <SheetDescription>Ajusta cuándo se activa esta regla y a quién se asigna la conversación.</SheetDescription>
                  </SheetHeader>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase">Nombre de la regla</label>
                     <Input name="nombre" defaultValue={currentEditData?.nombre || ""} placeholder="Ej. WhatsApp + Precios" required />
                  </div>

                  <div className="space-y-4">
                     <div className="text-sm font-semibold border-b pb-2">Condición de activación</div>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-xs font-semibold text-muted-foreground uppercase">Tipo de evento</label>
                           <Select name="tipo_evento" defaultValue={editingRuleId ? "nueva" : "nueva"}>
                              <SelectTrigger><SelectValue/></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="nueva">Nueva conversación</SelectItem>
                                 <SelectItem value="sin_propietario">Conversación sin propietario</SelectItem>
                                 <SelectItem value="necesita_humano">Conversación marcada como Necesita humano</SelectItem>
                                 <SelectItem value="reabierta">Conversación reabierta</SelectItem>
                                 <SelectItem value="prioridad">Contacto de alta prioridad</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-xs font-semibold text-muted-foreground uppercase">Canal</label>
                              <Select name="canal" defaultValue="Cualquier canal">
                                 <SelectTrigger><SelectValue/></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="Cualquier canal">Cualquier canal</SelectItem>
                                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                    <SelectItem value="Instagram">Instagram</SelectItem>
                                    <SelectItem value="Web Chat">Web Chat</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-semibold text-muted-foreground uppercase">Intención</label>
                              <Select name="intencion" defaultValue="Cualquier intención">
                                 <SelectTrigger><SelectValue/></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="Cualquier intención">Cualquier intención</SelectItem>
                                    <SelectItem value="Precios">Precios</SelectItem>
                                    <SelectItem value="Soporte">Soporte</SelectItem>
                                    <SelectItem value="Demo">Demo</SelectItem>
                                    <SelectItem value="Producto">Producto</SelectItem>
                                    <SelectItem value="Queja">Queja</SelectItem>
                                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                                    <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-semibold text-muted-foreground uppercase">Motivo de traspaso (Si aplica)</label>
                           <Select name="motivo" defaultValue="No aplica">
                              <SelectTrigger><SelectValue/></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="No aplica">No aplica</SelectItem>
                                 <SelectItem value="Usuario pidió humano">Usuario pidió humano</SelectItem>
                                 <SelectItem value="Baja confianza IA">Baja confianza IA</SelectItem>
                                 <SelectItem value="Frustración detectada">Frustración detectada</SelectItem>
                                 <SelectItem value="Fuera de conocimiento">Fuera de conocimiento</SelectItem>
                                 <SelectItem value="Información sensible">Información sensible</SelectItem>
                                 <SelectItem value="Excepción comercial">Excepción comercial</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="text-sm font-semibold border-b pb-2">Destino y detalles</div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-semibold text-muted-foreground uppercase">Destino</label>
                           <Select name="destino" defaultValue={currentEditData?.destino || "Cola humana"}>
                              <SelectTrigger><SelectValue/></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="Agente de ventas">Agente de ventas</SelectItem>
                                 <SelectItem value="Agente de soporte">Agente de soporte</SelectItem>
                                 <SelectItem value="Agente de onboarding">Agente de onboarding</SelectItem>
                                 <SelectItem value="Laura Gómez">Laura Gómez</SelectItem>
                                 <SelectItem value="Pedro Pascal">Pedro Pascal</SelectItem>
                                 <SelectItem value="Cola humana">Cola humana</SelectItem>
                                 <SelectItem value="Equipo de soporte">Equipo de soporte</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-semibold text-muted-foreground uppercase">Prioridad</label>
                           <Select name="prioridad" defaultValue={currentEditData?.prioridad || "Media"}>
                              <SelectTrigger><SelectValue/></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="Baja">Baja</SelectItem>
                                 <SelectItem value="Media">Media</SelectItem>
                                 <SelectItem value="Alta">Alta</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                     <div className="space-y-2 pt-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Estado</label>
                        <Select name="estado" defaultValue={currentEditData?.estado || "Activo"}>
                           <SelectTrigger><SelectValue/></SelectTrigger>
                           <SelectContent>
                              <SelectItem value="Activo">Activo</SelectItem>
                              <SelectItem value="Inactivo">Inactivo</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </div>

               <div className="p-6 border-t bg-muted/20 shrink-0 flex items-center justify-between">
                  {editingRuleId ? (
                     <Button type="button" variant="destructive" onClick={() => deleteRule(editingRuleId)}>Eliminar regla</Button>
                  ) : (
                     <div /> // Spacer
                  )}
                  <div className="flex gap-2 text-right">
                     <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>Cancelar</Button>
                     <Button type="submit">Guardar cambios</Button>
                  </div>
               </div>
            </form>
         </SheetContent>
      </Sheet>
    </div>
  )
}

function ConnectionStatusView() {
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleSync = (id: string) => {
     setSyncing(id);
     setTimeout(() => {
        setSyncing(null);
        toast({ title: "Sincronización exitosa" });
     }, 1500);
  }

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estado de conexión</h1>
          <p className="text-sm text-muted-foreground mt-1">Revisa sincronización, permisos y salud técnica de cada canal.</p>
        </div>
      </div>
      <div className="p-8">
         <Card className="shadow-sm">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="pl-6">Canal</TableHead>
                     <TableHead>Estado</TableHead>
                     <TableHead>Última Sincronización</TableHead>
                     <TableHead>Webhook</TableHead>
                     <TableHead>Permisos</TableHead>
                     <TableHead className="text-right pr-6">Acción</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {MOCK_CHANNELS.map(c => (
                     <TableRow key={c.id}>
                        <TableCell className="pl-6 font-medium flex items-center gap-2">
                           <i className={
                              c.nombre === "WhatsApp" ? "ri-whatsapp-fill text-green-600" :
                              c.nombre === "Instagram" ? "ri-instagram-fill text-pink-600" : "ri-chat-smile-3-fill text-blue-500"
                           }></i> {c.nombre}
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline" className="shadow-none font-normal bg-muted">Conectado</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{new Date(c.ultimaSincronizacion).toLocaleTimeString()}</TableCell>
                        <TableCell className="text-green-600 text-sm"><i className="ri-check-line"></i> Activo</TableCell>
                        <TableCell className="text-green-600 text-sm"><i className="ri-check-line"></i> Correctos</TableCell>
                        <TableCell className="text-right pr-6">
                           <Button variant="outline" size="sm" onClick={() => handleSync(c.id)} disabled={syncing === c.id}>
                              {syncing === c.id ? <><i className="ri-loader-4-line animate-spin mr-2"></i> ...</> : "Reintentar"}
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Card>
      </div>
    </div>
  )
}

