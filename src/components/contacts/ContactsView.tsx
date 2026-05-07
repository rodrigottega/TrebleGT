import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_CONTACTS, MOCK_CONVERSATIONS } from "@/data/mockData";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export function ContactsView({ secondaryTab }: { secondaryTab: string }) {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const filtered = contacts.filter(c => {
    const s = search.toLowerCase();
    const matchesSearch = c.nombreCompleto.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.telefono.includes(s) || (c.empresa || "").toLowerCase().includes(s);
    let matchesTab = true;
    switch (secondaryTab) {
      case "Leads nuevos": matchesTab = c.etapa === "Lead"; break;
      case "Calificados": matchesTab = c.etapa === "MQL" || c.etapa === "SQL" || c.estado === "Calificado"; break;
      case "Clientes": matchesTab = c.etapa === "Cliente" || c.estado === "Cliente"; break;
      case "Sin propietario": matchesTab = c.propietario === null || c.propietario === "Sin asignar"; break;
      case "Archivados": matchesTab = c.estado === "Archivado"; break;
      case "WhatsApp": matchesTab = c.canalPrincipal === "WhatsApp"; break;
      case "Instagram": matchesTab = c.canalPrincipal === "Instagram"; break;
      case "Web Chat": matchesTab = c.canalPrincipal === "Web Chat"; break;
      case "Necesitan humano": matchesTab = c.aiStatus === "Necesita humano"; break;
      case "Gestionados por IA": matchesTab = c.aiStatus === "Gestionado por IA"; break;
    }
    return matchesSearch && matchesTab;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const newContact = {
      id: `c-${Date.now()}`,
      nombre: fd.get("nombre") as string,
      apellido: fd.get("apellido") as string,
      nombreCompleto: `${fd.get("nombre")} ${fd.get("apellido")}`,
      email: fd.get("email") as string,
      telefono: fd.get("telefono") as string,
      canalPrincipal: fd.get("canal") as string,
      estado: fd.get("estado") as string,
      etapa: "Lead",
      propietario: fd.get("propietario") as string,
      empresa: fd.get("empresa") as string,
      etiquetas: [],
      ultimaActividad: new Date().toISOString(),
      fechaCreacion: new Date().toISOString(),
      ciudad: "-",
      pais: "-",
      idioma: "es",
      totalConversaciones: 0,
      aiStatus: "Sin IA",
      intencionDetectada: "-",
      prioridad: "Media"
    };
    setContacts([newContact, ...contacts]);
    setIsCreateOpen(false);
    toast({ title: "Contacto creado" });
  };

  const contactConversations = selectedContact ? MOCK_CONVERSATIONS.filter(c => c.contactoId === selectedContact.id) : [];

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contactos</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona personas, propiedades CRM y actividad omnicanal.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shadow-sm">
          <i className="ri-user-add-line mr-2"></i> Nuevo contacto
        </Button>
      </div>

      <div className="p-8 flex-1 flex flex-col min-h-0 bg-muted/10">
        <div className="flex items-center justify-between mb-4">
           <div className="relative w-80">
             <i className="ri-search-line absolute left-3 top-2.5 text-muted-foreground text-sm"></i>
             <Input 
               placeholder="Buscar contactos..." 
               className="pl-9 bg-background shadow-sm border-border h-9"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <div className="flex gap-2">
             <Popover>
               <PopoverTrigger asChild>
                 <Button variant="outline" size="sm" className="bg-background shadow-sm h-9">
                   <i className="ri-filter-3-line mr-2"></i> Filtros
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-64" align="end">
                 <div className="space-y-4">
                   <h4 className="font-medium text-sm">Filtros de Contactos</h4>
                   <div className="space-y-2">
                     <Label className="text-xs">Propiedad</Label>
                     <Select defaultValue="canal">
                       <SelectTrigger><SelectValue/></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="canal">Canal Principal</SelectItem>
                         <SelectItem value="estado">Estado</SelectItem>
                         <SelectItem value="etapa">Etapa</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <Button size="sm" className="w-full">Aplicar</Button>
                 </div>
               </PopoverContent>
             </Popover>
           </div>
        </div>

        <div className="rounded-xl border bg-background shadow-sm overflow-hidden flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm shadow-border/50">
                <TableRow>
                  <TableHead className="w-[220px] pl-6 font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">Empresa</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Teléfono</TableHead>
                  <TableHead className="font-semibold">Canal</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Etapa</TableHead>
                  <TableHead className="font-semibold">Propietario</TableHead>
                  <TableHead className="text-right pr-6 font-semibold">Última act.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="group cursor-pointer hover:bg-muted/50" onClick={() => setSelectedContact(c)}>
                    <TableCell className="font-medium pl-6">
                      <div className="flex items-center gap-2">
                         <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/10 text-primary text-[10px]">{c.nombre[0]}{c.apellido[0]}</AvatarFallback></Avatar>
                         <div className="truncate">{c.nombreCompleto}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-[120px]">{c.empresa}</TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-[150px]">{c.email}</TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-[120px]">{c.telefono}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <i className={cn(
                          "mr-1.5",
                          c.canalPrincipal === "WhatsApp" ? "ri-whatsapp-line" :
                          c.canalPrincipal === "Instagram" ? "ri-instagram-line" : "ri-chat-smile-3-line"
                        )}></i>
                        {c.canalPrincipal}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium bg-muted/50 shadow-none text-xs">
                        {c.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{c.etapa}</TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-[100px]">{c.propietario || "Sin asignar"}</TableCell>
                    <TableCell className="text-right pr-6 text-muted-foreground text-sm">
                       {new Date(c.ultimaActividad).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                        No se encontraron contactos.
                     </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Nuevo Contacto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-xs">Nombre</Label>
                  <Input id="nombre" name="nombre" required placeholder="Juan" className="h-8 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido" className="text-xs">Apellido</Label>
                  <Input id="apellido" name="apellido" required placeholder="Pérez" className="h-8 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa" className="text-xs">Empresa</Label>
                <Input id="empresa" name="empresa" placeholder="Acme Corp" className="h-8 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="ejemplo@acme.com" className="h-8 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-xs">Teléfono</Label>
                <Input id="telefono" name="telefono" required placeholder="+52 55 1234 5678" className="h-8 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="canal" className="text-xs">Canal</Label>
                  <Select name="canal" defaultValue="WhatsApp">
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Web Chat">Web Chat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propietario" className="text-xs">Propietario</Label>
                  <Select name="propietario" defaultValue="Laura Gómez">
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Laura Gómez">Laura Gómez</SelectItem>
                       <SelectItem value="Pedro Pascal">Pedro Pascal</SelectItem>
                       <SelectItem value="Sin asignar">Sin asignar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} size="sm">Cancelar</Button>
              <Button type="submit" size="sm">Crear contacto</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={!!selectedContact} onOpenChange={(val) => { if (!val) setSelectedContact(null) }}>
        <SheetContent className="w-[400px] sm:w-[500px] flex flex-col p-0 border-l">
           {selectedContact && (
              <>
                <div className="p-6 border-b bg-muted/10">
                   <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12 border shadow-sm">
                         <AvatarFallback className="bg-primary/5 text-primary text-lg font-medium">{selectedContact.nombre[0]}{selectedContact.apellido[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                         <SheetTitle className="text-xl">{selectedContact.nombreCompleto}</SheetTitle>
                         <div className="text-muted-foreground text-sm mt-0.5 flex items-center gap-3">
                            <span><i className="ri-building-line mr-1"></i> {selectedContact.empresa}</span>
                            <span><i className="ri-message-3-line mr-1"></i> {selectedContact.canalPrincipal}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <Button size="sm" className="h-8"><i className="ri-chat-3-line mr-1.5"></i> Enviar mensaje</Button>
                      <Button size="sm" variant="outline" className="h-8"><i className="ri-edit-line mr-1.5"></i> Editar</Button>
                   </div>
                </div>

                <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0">
                  <div className="px-6 border-b">
                    <TabsList className="bg-transparent h-12 p-0 w-full justify-start space-x-6">
                      <TabsTrigger value="info" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12 font-medium">Información</TabsTrigger>
                      <TabsTrigger value="conv" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12 font-medium">Conversaciones</TabsTrigger>
                      <TabsTrigger value="prop" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12 font-medium">Propiedades</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="flex-1 min-h-0 overflow-hidden relative">
                    <TabsContent value="info" className="h-full p-0 m-0">
                      <ScrollArea className="h-full">
                        <div className="p-6 space-y-6">
                           <div>
                              <h4 className="text-sm font-semibold mb-3">Datos de contacto</h4>
                              <div className="space-y-3">
                                 <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground"><span className="col-span-1">Email</span><span className="col-span-2 text-foreground font-medium">{selectedContact.email}</span></div>
                                 <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground"><span className="col-span-1">Teléfono</span><span className="col-span-2 text-foreground font-medium">{selectedContact.telefono}</span></div>
                                 <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground"><span className="col-span-1">Ubicación</span><span className="col-span-2 text-foreground">{selectedContact.ciudad}, {selectedContact.pais}</span></div>
                                 <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground"><span className="col-span-1">Creación</span><span className="col-span-2 text-foreground">{new Date(selectedContact.fechaCreacion).toLocaleDateString()}</span></div>
                              </div>
                           </div>
                           <Separator />
                           <div>
                              <h4 className="text-sm font-semibold mb-3">Actividad reciente</h4>
                              <div className="space-y-4 relative border-l ml-2 pl-4">
                                 <div className="relative before:absolute before:-left-[21px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-border">
                                    <p className="text-sm font-medium">Conversación resuelta</p>
                                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                                 </div>
                                 <div className="relative before:absolute before:-left-[21px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-border">
                                    <p className="text-sm font-medium">Asignado a {selectedContact.propietario || 'humano'}</p>
                                    <p className="text-xs text-muted-foreground">Ayer</p>
                                 </div>
                                 <div className="relative before:absolute before:-left-[21px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-border">
                                    <p className="text-sm font-medium">Contacto creado</p>
                                    <p className="text-xs text-muted-foreground">{new Date(selectedContact.fechaCreacion).toLocaleDateString()}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="conv" className="p-0 m-0 w-full h-full flex flex-col bg-background">
                       {selectedConversation ? (
                          <div className="flex flex-col h-full bg-muted/10 w-full">
                             <div className="p-4 border-b flex items-center justify-between bg-background shrink-0">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedConversation(null)} className="h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground">
                                   <i className="ri-arrow-left-line mr-1"></i> Volver a la lista
                                </Button>
                                <Button variant="secondary" size="sm" className="h-8" onClick={() => {
                                   window.dispatchEvent(new CustomEvent('navigate-inbox', { detail: selectedConversation.id }));
                                   setSelectedContact(null);
                                   setSelectedConversation(null);
                                }}>
                                   Abrir en Inbox
                                </Button>
                             </div>
                             <div className="p-4 border-b bg-background shrink-0 space-y-3">
                                <div className="flex items-center justify-between">
                                   <Badge variant={selectedConversation.estado === 'Resuelta' ? 'outline' : 'secondary'} className="shadow-none text-xs">{selectedConversation.estado}</Badge>
                                   <div className="text-xs text-muted-foreground">{new Date(selectedConversation.ultimaActividad).toLocaleString()}</div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                   <span className="flex items-center gap-1.5"><i className={selectedConversation.canal === 'WhatsApp' ? 'ri-whatsapp-line' : 'ri-instagram-line'}></i> {selectedConversation.canal}</span>
                                   <span className="flex items-center gap-1.5"><i className="ri-robot-2-line"></i> {selectedConversation.agenteAtencion || 'Agente'}</span>
                                </div>
                             </div>
                             <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
                                {/* Fake messages for demo */}
                                <div className="flex justify-end">
                                   <div className="bg-primary text-primary-foreground text-sm py-2 px-3 rounded-xl rounded-tr-sm max-w-[85%]">{selectedConversation.ultimoMensaje}</div>
                                </div>
                                <div className="flex justify-start">
                                   <div className="bg-background border text-foreground text-sm py-2 px-3 rounded-xl rounded-tl-sm max-w-[85%]">
                                      Hola, gracias por escribirnos. En un momento un especialista revisará tu consulta.
                                   </div>
                                </div>
                                {selectedConversation.estado === 'Necesita revisión' && (
                                   <div className="flex justify-center">
                                      <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs py-1.5 px-3 rounded font-medium border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-1.5">
                                         <i className="ri-error-warning-line"></i> La IA detectó una solicitud compleja y requirió asistencia humana.
                                      </div>
                                   </div>
                                )}
                                <div className="flex justify-center">
                                   <div className="bg-muted text-muted-foreground text-xs py-1.5 px-3 rounded flex items-center justify-center gap-1.5 mt-2">
                                      <i className="ri-lock-line"></i> Nota interna: Revisar historial de compras antes de responder.
                                   </div>
                                </div>
                             </div>
                          </div>
                       ) : (
                          <div className="divide-y relative h-full flex-1 overflow-y-auto">
                             {contactConversations.length > 0 ? contactConversations.map(c => (
                                <div key={c.id} onClick={() => setSelectedConversation(c)} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors group">
                                   <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2">
                                         <Badge variant={c.estado === 'Resuelta' ? 'outline' : 'secondary'} className="shadow-none font-medium px-2 py-0 h-5 text-[10px]">{c.estado}</Badge>
                                         {c.estado === "Necesita revisión" ? <Badge variant="destructive" className="shadow-none font-medium px-2 py-0 h-5 text-[10px]">Esperando humano</Badge> : <Badge variant="outline" className="shadow-none font-medium px-2 py-0 h-5 text-[10px] bg-primary/5 text-primary border-primary/20">Gestionado por IA</Badge>}
                                      </div>
                                      <span className="text-[10px] text-muted-foreground">{new Date(c.ultimaActividad).toLocaleDateString()}</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                                      <i className={cn("text-sm", c.canal === "WhatsApp" ? "ri-whatsapp-line" : "ri-instagram-line")}></i>
                                      <span>Resp. {c.agenteAtencion || 'Agente'}</span>
                                   </div>
                                   <p className="text-sm line-clamp-2">{c.ultimoMensaje}</p>
                                   <p className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"><i className="ri-eye-line"></i> Ver detalles</p>
                                </div>
                             )) : (
                                <div className="p-8 text-center text-muted-foreground text-sm">No hay conversaciones registradas.</div>
                             )}
                          </div>
                       )}
                    </TabsContent>

                    <TabsContent value="prop" className="p-0 m-0 h-full">
                       <ScrollArea className="h-full">
                         <div className="p-6 space-y-6">
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <Label className="text-xs text-muted-foreground uppercase">Estado</Label>
                                 <Select defaultValue={selectedContact.estado}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="Nuevo">Nuevo</SelectItem>
                                       <SelectItem value="Abierto">Abierto</SelectItem>
                                       <SelectItem value="Cliente">Cliente</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs text-muted-foreground uppercase">Etapa</Label>
                                 <Select defaultValue={selectedContact.etapa}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="Lead">Lead</SelectItem>
                                       <SelectItem value="MQL">MQL</SelectItem>
                                       <SelectItem value="SQL">SQL</SelectItem>
                                       <SelectItem value="Cliente">Cliente</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs text-muted-foreground uppercase">Propietario</Label>
                                 <Select defaultValue={selectedContact.propietario || "unassigned"}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="unassigned">Sin asignar</SelectItem>
                                       <SelectItem value="Laura Gómez">Laura Gómez</SelectItem>
                                       <SelectItem value="Pedro Pascal">Pedro Pascal</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-xs text-muted-foreground uppercase">Prioridad</Label>
                                 <Select defaultValue={selectedContact.prioridad}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="Alta">Alta</SelectItem>
                                       <SelectItem value="Media">Media</SelectItem>
                                       <SelectItem value="Baja">Baja</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="space-y-2 pt-2">
                                 <Label className="text-xs text-muted-foreground uppercase">Etiquetas</Label>
                                 <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedContact.etiquetas.length > 0 ? selectedContact.etiquetas.map((t: string) => (
                                       <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
                                    )) : <span className="text-sm text-muted-foreground">Sin etiquetas</span>}
                                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs rounded-full border-dashed"><i className="ri-add-line mr-1"></i> Agregar</Button>
                                 </div>
                              </div>
                           </div>
                         </div>
                       </ScrollArea>
                    </TabsContent>
                  </div>
                </Tabs>
              </>
           )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
