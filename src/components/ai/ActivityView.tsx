import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_ACTIVITY_EVENTS } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function ActivityView() {
  const [events, setEvents] = useState(MOCK_ACTIVITY_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Actividad IA</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitorea decisiones, respuestas y traspasos realizados por tus agentes.</p>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col min-h-0 bg-muted/10">
         <div className="rounded-xl border bg-background shadow-sm overflow-hidden flex-1 flex flex-col">
            <ScrollArea className="flex-1">
               <Table>
                 <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm shadow-border/50">
                    <TableRow>
                       <TableHead className="pl-6">Evento</TableHead>
                       <TableHead>Agente</TableHead>
                       <TableHead>Canal</TableHead>
                       <TableHead>Contacto</TableHead>
                       <TableHead>Fuente usada</TableHead>
                       <TableHead>Estado</TableHead>
                       <TableHead className="text-right pr-6">Hora</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {events.map(ev => (
                       <TableRow key={ev.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedEvent(ev)}>
                          <TableCell className="pl-6 font-medium text-foreground">{ev.evento}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{ev.agente}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{ev.canal}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{ev.contacto}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                             {ev.fuenteUsada !== '-' ? <Badge variant="secondary" className="font-normal text-[10px]">{ev.fuenteUsada}</Badge> : '-'}
                          </TableCell>
                          <TableCell>
                             <Badge variant={ev.estado === "Registrado" ? "outline" : "secondary"} className="shadow-none text-[10px] font-medium">{ev.estado}</Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6 text-muted-foreground text-sm">
                             {new Date(ev.hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                       </TableRow>
                    ))}
                 </TableBody>
               </Table>
            </ScrollArea>
         </div>
      </div>

      <Sheet open={!!selectedEvent} onOpenChange={(val) => { if (!val) setSelectedEvent(null) }}>
         <SheetContent side="right" className="w-[500px] sm:max-w-none p-0 flex flex-col border-l">
            {selectedEvent && (
               <>
                  <div className="p-6 border-b bg-muted/10 shrink-0">
                     <SheetHeader className="mb-2">
                        <div className="flex items-start justify-between">
                           <div>
                              <SheetTitle className="text-lg">Detalle del evento</SheetTitle>
                              <p className="text-sm text-muted-foreground mt-0.5">{new Date(selectedEvent.hora).toLocaleString()}</p>
                           </div>
                           <Badge variant={selectedEvent.estado === "Registrado" ? "outline" : "secondary"} className="shadow-none">{selectedEvent.estado}</Badge>
                        </div>
                     </SheetHeader>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     
                     <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Resumen del evento</h4>
                        <p className="text-sm border-l-2 border-primary pl-3 py-1 bg-muted/30">
                           {selectedEvent.evento === 'Traspaso a humano' ? 'El agente solicitó traspaso humano porque detectó baja confianza en una pregunta comercial sensible.' : 'El agente respondió automáticamente utilizando información de la base de conocimiento sin requerir intervención humana.'}
                        </p>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider border-b pb-2">Contexto</h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                           <div>
                              <div className="text-muted-foreground mb-1 text-xs">Agente</div>
                              <div className="font-medium flex items-center gap-1.5"><i className="ri-robot-2-line text-muted-foreground"></i> {selectedEvent.agente}</div>
                           </div>
                           <div>
                              <div className="text-muted-foreground mb-1 text-xs">Canal</div>
                              <div className="font-medium flex items-center gap-1.5"><i className="ri-message-3-line text-muted-foreground"></i> {selectedEvent.canal}</div>
                           </div>
                           <div>
                              <div className="text-muted-foreground mb-1 text-xs">Contacto</div>
                              <div className="font-medium flex items-center gap-1.5"><i className="ri-user-3-line text-muted-foreground"></i> {selectedEvent.contacto}</div>
                           </div>
                           <div>
                              <div className="text-muted-foreground mb-1 text-xs">Conversación</div>
                              <div className="font-medium flex items-center gap-1.5 text-primary hover:underline cursor-pointer"><i className="ri-chat-3-line"></i> Conversación #{selectedEvent.id.substring(3)}</div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Mensaje del cliente</h4>
                        <div className="bg-muted text-foreground p-3 rounded-tr-xl rounded-b-xl text-sm w-[85%] border shadow-sm relative">
                           <span className="absolute -top-2.5 left-2 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">Cliente</span>
                           {selectedEvent.evento === 'Traspaso a humano' ? 'Necesito un descuento especial para mi equipo, pero no veo esa opción en sus planes. ¿Me pasan con un vendedor?' : '¿Tienen la versión en inglés disponible y qué costo adicional tiene?'}
                        </div>
                     </div>

                     <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Respuesta o decisión de la IA</h4>
                        <div className="bg-primary/10 text-foreground p-3 rounded-tl-xl rounded-b-xl text-sm w-[85%] ml-auto border border-primary/20 shadow-sm relative">
                           <span className="absolute -top-2.5 right-2 bg-background px-1 text-[10px] text-primary uppercase tracking-wider">Agente IA</span>
                           {selectedEvent.evento === 'Traspaso a humano' ? 'La IA decidió no responder directamente y solicitó traspaso a humano.' : 'Nuestra plataforma está disponible completamente en inglés sin ningún costo oculto o adicional. Puedes cambiar tu idioma entrando a Ajustes -> Idioma.'}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider border-b pb-2">Señales detectadas</h4>
                        <div className="flex flex-wrap gap-2">
                           <Badge variant="outline" className="text-xs font-normal"><i className="ri-focus-3-line mr-1 text-muted-foreground"></i> Intención: {selectedEvent.evento === 'Traspaso a humano' ? 'Precios' : 'Consulta Técnica'}</Badge>
                           <Badge variant="outline" className="text-xs font-normal"><i className="ri-dashboard-2-line mr-1 text-amber-500"></i> Confianza: {selectedEvent.evento === 'Traspaso a humano' ? 'Baja (42%)' : 'Alta (92%)'}</Badge>
                           <Badge variant="outline" className="text-xs font-normal"><i className="ri-emotion-normal-line mr-1 text-muted-foreground"></i> Sentimiento: Neutral</Badge>
                           {selectedEvent.evento === 'Traspaso a humano' && <Badge variant="outline" className="text-xs font-normal border-amber-200 bg-amber-50"><i className="ri-alert-line mr-1 text-amber-500"></i> Riesgo: Excepción comercial</Badge>}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider border-b pb-2">Reglas activadas</h4>
                        {selectedEvent.evento === 'Traspaso a humano' ? (
                           <ul className="space-y-2">
                              <li className="text-sm flex items-center gap-2"><i className="ri-alert-line text-amber-500"></i> Solicitud comercial sensible</li>
                              <li className="text-sm flex items-center gap-2"><i className="ri-alert-line text-amber-500"></i> Baja confianza IA</li>
                           </ul>
                        ) : (
                           <div className="text-sm text-muted-foreground italic flex items-center gap-2">
                              <i className="ri-check-line"></i> Ninguna regla limitante activada
                           </div>
                        )}
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider border-b pb-2">Acciones ejecutadas</h4>
                        <ul className="space-y-2">
                           {selectedEvent.evento === 'Traspaso a humano' ? (
                              <>
                                 <li className="text-sm flex items-center gap-2"><i className="ri-checkbox-circle-fill text-green-500"></i> Marcó la conversación como Necesita humano</li>
                                 <li className="text-sm flex items-center gap-2"><i className="ri-checkbox-circle-fill text-green-500"></i> Asignó la conversación a Cola humana</li>
                                 <li className="text-sm flex items-center gap-2"><i className="ri-checkbox-circle-fill text-green-500"></i> Registró decisión en actividad IA</li>
                              </>
                           ) : (
                              <>
                                 <li className="text-sm flex items-center gap-2"><i className="ri-checkbox-circle-fill text-green-500"></i> Consultó base de conocimiento</li>
                                 <li className="text-sm flex items-center gap-2"><i className="ri-checkbox-circle-fill text-green-500"></i> Respondió al cliente</li>
                                 <li className="text-sm flex items-center gap-2"><i className="ri-checkbox-circle-fill text-green-500"></i> Actualizó estado resolutivo</li>
                              </>
                           )}
                        </ul>
                     </div>

                     <div className="space-y-4 pb-4">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider border-b pb-2">Fuentes consultadas</h4>
                        {selectedEvent.fuenteUsada !== '-' ? (
                           <ul className="space-y-2">
                              <li className="text-sm flex items-center gap-2"><i className="ri-file-text-line text-primary"></i> {selectedEvent.fuenteUsada}</li>
                              {selectedEvent.evento !== 'Traspaso a humano' && <li className="text-sm flex items-center gap-2"><i className="ri-file-text-line text-primary"></i> SLA y tiempos</li>}
                           </ul>
                        ) : (
                           <div className="text-sm text-muted-foreground italic">
                              No se consultaron fuentes para este evento.
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="p-4 border-t bg-muted/20 shrink-0 flex items-center justify-between gap-2">
                     <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs"><i className="ri-chat-3-line mr-1"></i> Ver conversación</Button>
                        <Button size="sm" variant="outline" className="text-xs"><i className="ri-robot-2-line mr-1"></i> Ver agente</Button>
                     </div>
                     <Button size="sm" onClick={() => setSelectedEvent(null)} className="text-xs">Cerrar</Button>
                  </div>
               </>
            )}
         </SheetContent>
      </Sheet>
    </div>
  );
}
