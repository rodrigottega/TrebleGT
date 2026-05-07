import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";

export function SettingsView({ secondaryTab }: { secondaryTab: string }) {
  const save = () => {
    toast({ title: "Ajustes guardados" });
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6 shrink-0 bg-background/95 sticky top-0 z-10 backdrop-blur">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{secondaryTab}</h1>
        </div>
        <Button onClick={save} className="shadow-sm">Guardar cambios</Button>
      </div>

      <div className="p-8 max-w-4xl space-y-8">
         {secondaryTab === "Mi Perfil" && (
           <Card className="shadow-sm">
              <CardHeader>
                 <CardTitle>Perfil Personal</CardTitle>
                 <CardDescription>Actualiza tu información y foto de perfil.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed relative group cursor-pointer overflow-hidden">
                       <span className="text-primary font-medium text-xl">MV</span>
                       <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                          <i className="ri-camera-add-line text-white text-xl"></i>
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <h3 className="font-medium text-sm">Avatar del perfil</h3>
                       <p className="text-xs text-muted-foreground max-w-[200px]">Sube un archivo JPG, GIF o PNG. Max 5MB.</p>
                       <Button variant="outline" size="sm" className="mt-2">Cambiar avatar</Button>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label>Nombre completo</Label>
                       <Input defaultValue="María Vargas" />
                    </div>
                    <div className="space-y-2">
                       <Label>Correo electrónico</Label>
                       <Input defaultValue="maria@ciarem.ai" readOnly className="bg-muted/50 cursor-not-allowed" />
                    </div>
                 </div>
              </CardContent>
           </Card>
         )}

         {secondaryTab === "Equipo" && (
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <p className="text-sm text-muted-foreground">Gestiona los miembros de tu espacio de trabajo y sus permisos.</p>
                 <Dialog>
                    <DialogTrigger asChild>
                       <Button><i className="ri-user-add-line mr-2"></i> Invitar miembro</Button>
                    </DialogTrigger>
                    <DialogContent>
                       <DialogHeader>
                          <DialogTitle>Invitar al equipo</DialogTitle>
                       </DialogHeader>
                       <div className="space-y-4 py-4">
                          <div className="space-y-2">
                             <Label>Correo electrónico</Label>
                             <Input placeholder="nombre@empresa.com" />
                          </div>
                          <div className="space-y-2">
                             <Label>Rol del usuario</Label>
                             <Select defaultValue="agent">
                                <SelectTrigger>
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="admin">Administrador</SelectItem>
                                   <SelectItem value="manager">Mánager de soporte</SelectItem>
                                   <SelectItem value="agent">Agente (Solo resuelve casos)</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                       </div>
                       <DialogFooter>
                          <Button>Enviar invitación</Button>
                       </DialogFooter>
                    </DialogContent>
                 </Dialog>
              </div>

              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                 <Table>
                    <TableHeader className="bg-muted/50">
                       <TableRow>
                          <TableHead className="pl-6">Usuario</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead className="text-right pr-6">Acciones</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       <TableRow>
                          <TableCell className="pl-6 font-medium">
                             <div>María Vargas</div>
                             <div className="text-xs text-muted-foreground">maria@ciarem.ai</div>
                          </TableCell>
                          <TableCell><Badge variant="outline">Activo</Badge></TableCell>
                          <TableCell className="text-muted-foreground text-sm">Administrador (Tú)</TableCell>
                          <TableCell className="text-right pr-6"><Button variant="ghost" size="icon" disabled><i className="ri-more-2-fill"></i></Button></TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="pl-6 font-medium">
                             <div>Carlos Rivera</div>
                             <div className="text-xs text-muted-foreground">carlos@ciarem.ai</div>
                          </TableCell>
                          <TableCell><Badge variant="outline">Activo</Badge></TableCell>
                          <TableCell className="text-muted-foreground text-sm">Mánager</TableCell>
                          <TableCell className="text-right pr-6"><Button variant="ghost" size="icon"><i className="ri-more-2-fill"></i></Button></TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="pl-6 font-medium">
                             <div>sofia@ciarem.ai</div>
                             <div className="text-xs text-muted-foreground">Invitación enviada hace 2 días</div>
                          </TableCell>
                          <TableCell><Badge variant="secondary" className="font-normal">Pendiente</Badge></TableCell>
                          <TableCell className="text-muted-foreground text-sm">Agente</TableCell>
                          <TableCell className="text-right pr-6"><Button variant="ghost" size="icon"><i className="ri-more-2-fill"></i></Button></TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
              </div>
           </div>
         )}

         {secondaryTab === "Facturación" && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm border-primary/20 bg-primary/5">
                 <CardHeader>
                    <CardTitle className="text-lg">Plan Actual</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-end gap-2 mb-6">
                       <span className="text-4xl font-bold tracking-tight">Pro</span>
                       <span className="text-muted-foreground pb-1">/ $29 mo</span>
                    </div>
                    <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
                       <li className="flex items-center gap-2"><i className="ri-check-line text-primary"></i> 3 Agentes de Equipo</li>
                       <li className="flex items-center gap-2"><i className="ri-check-line text-primary"></i> Canales ilimitados</li>
                       <li className="flex items-center gap-2"><i className="ri-check-line text-primary"></i> Reportes avanzados</li>
                    </ul>
                    <Button className="w-full">Actualizar plan</Button>
                 </CardContent>
              </Card>

              <Card className="shadow-sm">
                 <CardHeader>
                    <CardTitle className="text-lg">Consumo IA</CardTitle>
                    <CardDescription>Uso de créditos en el ciclo actual</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="flex flex-col justify-center h-full space-y-6">
                       <div>
                          <div className="flex justify-between items-end mb-2">
                             <div className="font-medium">Mensajes GPT-4o</div>
                             <div className="text-sm text-muted-foreground">4,200 / 10,000</div>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-primary w-[42%]"></div>
                          </div>
                       </div>
                       <div>
                          <div className="flex justify-between items-end mb-2">
                             <div className="font-medium">Procesamiento KB</div>
                             <div className="text-sm text-muted-foreground">1.5GB / 5GB</div>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-amber-500 w-[30%]"></div>
                          </div>
                       </div>
                       <Button variant="outline" className="mt-auto">Comprar créditos extra</Button>
                    </div>
                 </CardContent>
              </Card>
           </div>
         )}

         {secondaryTab === "Integraciones" && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                 {name: "Zendesk", desc: "Sincroniza tickets y contactos bidireccionalmente.", icon: "ri-headphone-line", color: "text-emerald-600", active: true},
                 {name: "HubSpot", desc: "Registra conversaciones como notas en el CRM.", icon: "ri-orange-line", color: "text-orange-500", active: false},
                 {name: "Salesforce", desc: "Crea casos desde intenciones catalogadas por IA.", icon: "ri-cloud-line", color: "text-blue-500", active: false},
                 {name: "Slack", desc: "Recibe notificaciones de reglas de traspaso.", icon: "ri-slack-line", color: "text-purple-600", active: true},
                 {name: "Shopify", desc: "Los agentes IA leen el estatus de pedidos.", icon: "ri-shopping-bag-3-line", color: "text-green-500", active: false},
                 {name: "Stripe", desc: "Permite cobros directos dentro del chat.", icon: "ri-bank-card-line", color: "text-indigo-500", active: false},
              ].map(int => (
                 <Card key={int.name} className="shadow-sm border hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-4">
                       <div className="flex items-start justify-between">
                          <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-xl">
                             <i className={`${int.icon} ${int.color} text-xl`}></i>
                          </div>
                          <Switch defaultChecked={int.active} />
                       </div>
                    </CardHeader>
                    <CardContent>
                       <CardTitle className="text-base mb-1">{int.name}</CardTitle>
                       <CardDescription className="text-xs line-clamp-2">{int.desc}</CardDescription>
                       {int.active && (
                          <div className="mt-4"><Button variant="outline" size="sm" className="w-full text-xs">Configurar Mapeo</Button></div>
                       )}
                    </CardContent>
                 </Card>
              ))}
           </div>
         )}

         {secondaryTab === "Notificaciones" && (
           <Card className="shadow-sm">
              <CardHeader>
                 <CardTitle>Preferencias de Notificaciones</CardTitle>
                 <CardDescription>Controla cuándo y cómo recibes alertas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
                    <div>
                       <div className="font-medium text-sm">Nuevas conversaciones asignadas</div>
                       <div className="text-xs text-muted-foreground mt-0.5">Te avisa cuando un humano o la IA te asigna una carga de trabajo.</div>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
                    <div>
                       <div className="font-medium text-sm">Regla de traspaso activada</div>
                       <div className="text-xs text-muted-foreground mt-0.5">Notificar inmediatamente si un cliente solicita hablar con un humano.</div>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
                    <div>
                       <div className="font-medium text-sm">Errores de Knowledge Base</div>
                       <div className="text-xs text-muted-foreground mt-0.5">Alertas si una fuente falla al sincronizar (Notion, Drive o URLs).</div>
                    </div>
                    <Switch defaultChecked />
                 </div>
              </CardContent>
           </Card>
         )}
      </div>
    </div>
  );
}
