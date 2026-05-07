import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function DashboardView() {
  const metrics = [
    { label: "Conversaciones Hoy", value: "243", change: "+12%", trend: "up", icon: "ri-chat-3-line" },
    { label: "Gestionadas por IA", value: "182", change: "+14%", trend: "up", icon: "ri-robot-2-line", meta: "75% del total" },
    { label: "Resueltas", value: "210", change: "+5%", trend: "up", icon: "ri-check-double-line" },
    { label: "Traspasos a humano", value: "48", change: "-2%", trend: "down", icon: "ri-user-shared-line", meta: "20% del total" },
    { label: "Tiempo 1ra respuesta", value: "12s", change: "-10%", trend: "down", icon: "ri-timer-flash-line", meta: "Principalmente IA" },
    { label: "Tiempo resolución", value: "4m", change: "-1m", trend: "down", icon: "ri-time-line" }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Resumen de impacto y rendimiento general de la plataforma.</p>
        </div>
        <div className="flex items-center gap-2">
           <select className="h-9 px-3 border border-input rounded-md text-sm bg-background">
             <option>Últimos 7 días</option>
             <option>Hoy</option>
             <option>Últimos 30 días</option>
           </select>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
           {metrics.map((m, i) => (
             <Card key={i} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{m.label}</CardTitle>
                   <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                      <i className={m.icon}></i>
                   </div>
                </CardHeader>
                <CardContent>
                   <div className="flex items-baseline justify-between">
                     <div className="text-3xl font-bold tracking-tight">{m.value}</div>
                     <div className={`text-xs font-semibold px-2 py-1 flex items-center gap-1 rounded bg-muted/50 text-foreground`}>
                        <i className={`ri-arrow-${m.trend}-line`}></i> {m.change}
                     </div>
                   </div>
                   {m.meta && <p className="text-xs text-muted-foreground mt-2">{m.meta}</p>}
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card className="shadow-sm">
              <CardHeader>
                 <CardTitle>Conversaciones por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-sm"><span className="text-muted-foreground flex items-center gap-1.5"><i className="ri-whatsapp-line text-foreground"></i> WhatsApp</span><span className="font-medium text-foreground">142 (58%)</span></div>
                       <div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full bg-foreground rounded-full" style={{width: '58%'}}></div></div>
                    </div>
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-sm"><span className="text-muted-foreground flex items-center gap-1.5"><i className="ri-chat-smile-3-line text-foreground"></i> Web Chat</span><span className="font-medium text-foreground">89 (37%)</span></div>
                       <div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full bg-foreground rounded-full" style={{width: '37%'}}></div></div>
                    </div>
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-sm"><span className="text-muted-foreground flex items-center gap-1.5"><i className="ri-instagram-line text-foreground"></i> Instagram</span><span className="font-medium text-foreground">12 (5%)</span></div>
                       <div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full bg-foreground rounded-full" style={{width: '5%'}}></div></div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="shadow-sm">
              <CardHeader>
                 <CardTitle>Intenciones Principales</CardTitle>
                 <CardDescription>Detectadas por IA en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-0 text-sm">
                   {[
                     {intent: "Soporte Técnico / Errores", count: 86},
                     {intent: "Precios y Facturación", count: 64},
                     {intent: "Agendar Demo", count: 42},
                     {intent: "Preguntas de Producto", count: 35},
                     {intent: "Cancelaciones", count: 16},
                   ].map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center py-2.5 border-b last:border-0">
                        <span className="text-muted-foreground">{item.intent}</span>
                        <Badge variant="secondary" className="font-medium bg-muted text-foreground px-2 h-6">{item.count}</Badge>
                     </div>
                   ))}
                </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
