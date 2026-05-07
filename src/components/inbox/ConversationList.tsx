import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

function getChannelIcon(canal: string) {
  switch (canal) {
    case "WhatsApp": return "ri-whatsapp-line";
    case "Instagram": return "ri-instagram-line";
    case "Web Chat": return "ri-chat-smile-3-line";
    default: return "ri-message-3-line";
  }
}

export function ConversationList({ conversations, selectedConvId, onSelectConv, secondaryTab }: any) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c: any) => {
    const matchesSearch = c.contactoName.toLowerCase().includes(search.toLowerCase());
    let matchesTab = true;
    switch(secondaryTab) {
      case "Tu bandeja": matchesTab = c.asignadoA === "Laura Gómez"; break; // Simulated current user
      case "Todas": matchesTab = true; break;
      case "Sin asignar": matchesTab = c.asignadoA === null; break;
      case "Gestionadas por IA": matchesTab = c.ownerType === "ai"; break;
      case "Necesitan humano": matchesTab = c.requiereHumano; break;
      case "Pendientes": matchesTab = c.estado === "Pendiente"; break;
      case "Resueltas": matchesTab = c.estado === "Resuelta"; break;
      case "Spam": matchesTab = c.estado === "Spam"; break;
      case "Agente de soporte": matchesTab = c.agenteAsignado === "support"; break;
      case "Agente de ventas": matchesTab = c.agenteAsignado === "sales"; break;
      case "Agente de onboarding": matchesTab = c.agenteAsignado === "onboarding"; break;
    }
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex w-80 flex-col border-r bg-background">
      <div className="flex h-14 items-center px-4 border-b">
        <h2 className="font-semibold">{secondaryTab}</h2>
      </div>
      <div className="p-3 border-b">
        <div className="relative">
          <i className="ri-search-line absolute left-2.5 top-2 text-muted-foreground"></i>
          <Input 
            placeholder="Buscar conversaciones..." 
            className="pl-8 bg-muted/50 border-input h-8 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
           <Badge variant="secondary" className="whitespace-nowrap cursor-pointer rounded-full px-3 transition-colors hover:bg-secondary/80">Todos</Badge>
           <Badge variant="outline" className="whitespace-nowrap cursor-pointer rounded-full px-3 text-muted-foreground transition-colors hover:bg-secondary/50">Recientes</Badge>
           <Badge variant="outline" className="whitespace-nowrap cursor-pointer rounded-full px-3 text-muted-foreground transition-colors hover:bg-secondary/50">No leídos</Badge>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {filtered.map((c: any) => (
            <button
              key={c.id}
              onClick={() => onSelectConv(c.id)}
              className={cn(
                "flex flex-col border-b p-4 text-left transition-colors hover:bg-accent/50",
                selectedConvId === c.id ? "bg-accent" : "bg-transparent"
              )}
            >
              <div className="flex items-start justify-between w-full mb-1">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-medium truncate text-sm text-foreground">{c.contactoName}</span>
                  <i className={cn(getChannelIcon(c.canal), "text-muted-foreground text-xs")}></i>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                  {formatDistanceToNow(new Date(c.ultimaActividad), { addSuffix: true, locale: es })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 w-full mb-2 leading-tight">
                {c.ultimoMensaje}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-auto">
                <Badge variant={c.estado === "Resuelta" ? "outline" : "default"} className={cn("text-[10px] px-1.5 py-0 font-medium h-4", c.estado === 'Resuelta' ? 'text-muted-foreground' : 'bg-primary/10 text-primary hover:bg-primary/20')}>
                  {c.estado}
                </Badge>
                {c.ownerType === "ai" && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium h-4 bg-muted text-muted-foreground">
                    <i className="ri-robot-2-fill mr-1"></i> IA
                  </Badge>
                )}
                {c.requiereHumano && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-medium h-4 border-transparent">
                    <i className="ri-error-warning-fill mr-1"></i> Requiere humano
                  </Badge>
                )}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No hay conversaciones
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
