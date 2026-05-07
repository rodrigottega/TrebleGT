import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ContactContextPanel({ conversation, contact }: any) {
  return (
    <div className="flex w-80 flex-col border-l bg-background">
      <div className="h-14 border-b px-4 flex items-center shadow-sm z-10 bg-background/95">
        <h2 className="font-semibold text-sm">Detalles</h2>
      </div>
      
      <Tabs defaultValue="ai" className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-3 border-b pb-0">
          <TabsList className="grid w-full grid-cols-3 bg-transparent h-8 p-0 gap-1">
            <TabsTrigger value="ai" className="text-xs data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-md border-transparent data-[state=active]:border-border border">IA</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-md border-transparent data-[state=active]:border-border border">Info</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs data-[state=active]:bg-muted data-[state=active]:shadow-sm rounded-md border-transparent data-[state=active]:border-border border">Timeline</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="ai" className="m-0 space-y-5 outline-none">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resumen IA</h4>
              <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground/90 leading-relaxed">
                {conversation.resumenIA || "No hay resumen disponible."}
              </p>
            </div>
            
            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-muted-foreground">Intención</span>
                  <Badge variant="secondary" className="font-medium bg-primary/5 text-primary border-primary/20">{conversation.intención}</Badge>
               </div>
               <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-muted-foreground">Agente</span>
                  <span className="font-medium text-right text-foreground">{conversation.agenteAsignado}</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-muted-foreground">Confianza</span>
                  <span className="font-medium text-foreground flex items-center"><i className="ri-checkbox-circle-fill mr-1"></i> Alta (92%)</span>
               </div>
            </div>

            <div className="space-y-2 pt-2">
               <button className="w-full text-left text-xs font-medium text-primary hover:underline flex items-center justify-between p-2 rounded-md hover:bg-muted">
                 Ver registro de decisiones <i className="ri-arrow-right-s-line"></i>
               </button>
               <button className="w-full text-left text-xs font-medium text-primary hover:underline flex items-center justify-between p-2 rounded-md hover:bg-muted">
                 Probar este agente <i className="ri-external-link-line"></i>
               </button>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="m-0 space-y-5 outline-none">
            <div className="space-y-4">
               <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Sobre {contact.nombre}</h4>
                  <div className="space-y-2">
                     <div className="text-sm flex py-1">
                        <i className="ri-mail-line text-muted-foreground w-6"></i>
                        <span className="text-foreground font-medium truncate">{contact.email}</span>
                     </div>
                     <div className="text-sm flex py-1">
                        <i className="ri-phone-line text-muted-foreground w-6"></i>
                        <span className="text-foreground font-medium">{contact.telefono}</span>
                     </div>
                     <div className="text-sm flex py-1">
                        <i className="ri-building-line text-muted-foreground w-6"></i>
                        <span className="text-foreground">{contact.empresa}</span>
                     </div>
                     <div className="text-sm flex py-1">
                        <i className="ri-map-pin-line text-muted-foreground w-6"></i>
                        <span className="text-foreground">{contact.ciudad}, {contact.pais}</span>
                     </div>
                  </div>
               </div>
               
               <Separator />

               <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Propiedades CRM</h4>
                  <div className="space-y-3">
                     <div className="grid grid-cols-2 gap-2 text-sm items-center">
                        <span className="text-muted-foreground">Estado</span>
                        <Badge variant="outline" className="justify-center w-fit px-2 h-6">{contact.estado}</Badge>
                     </div>
                     <div className="grid grid-cols-2 gap-2 text-sm items-center">
                        <span className="text-muted-foreground">Etapa</span>
                        <span className="font-medium text-foreground">{contact.etapa}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-2 text-sm items-center">
                        <span className="text-muted-foreground">Propietario</span>
                        <div className="flex items-center gap-1.5 overflow-hidden">
                           <Avatar className="h-4 w-4 shrink-0"><AvatarFallback className="text-[8px] bg-muted">{contact.propietario ? contact.propietario[0] : '-'}</AvatarFallback></Avatar>
                           <span className="truncate font-medium text-foreground">{contact.propietario || 'Sin asignar'}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <Separator />

               <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Etiquetas</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.etiquetas.map((t: string) => (
                       <Badge key={t} variant="secondary" className="font-normal bg-muted text-muted-foreground hover:bg-muted/80">{t}</Badge>
                    ))}
                  </div>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="m-0 outline-none">
             <div className="relative border-l ml-3 space-y-6 pb-4">
                <div className="relative pl-5 before:absolute before:left-[-5px] before:top-1 before:h-2.5 before:w-2.5 before:rounded-full before:bg-border before:ring-4 before:ring-background">
                   <p className="text-xs font-medium text-foreground">Agente IA respondió</p>
                   <p className="text-[10px] text-muted-foreground mt-0.5">Hoy 10:45 AM</p>
                </div>
                <div className="relative pl-5 before:absolute before:left-[-5px] before:top-1 before:h-2.5 before:w-2.5 before:rounded-full before:bg-border before:ring-4 before:ring-background">
                   <p className="text-xs font-medium text-foreground">Conversación iniciada</p>
                   <p className="text-[10px] text-muted-foreground mt-0.5">Hoy 10:42 AM • Vía {conversation.canal}</p>
                </div>
                <div className="relative pl-5 before:absolute before:left-[-5px] before:top-1 before:h-2.5 before:w-2.5 before:rounded-full before:bg-border before:ring-4 before:ring-background">
                   <p className="text-xs font-medium text-foreground">Contacto creado</p>
                   <p className="text-[10px] text-muted-foreground mt-0.5">Hace 2 días</p>
                </div>
             </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
