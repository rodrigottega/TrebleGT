import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_KNOWLEDGE_BASES, MOCK_SOURCES } from "@/data/mockData";
import { toast } from "@/components/ui/toaster";
import { Textarea } from "@/components/ui/textarea";

export function KnowledgeBasesManager() {
  const [bases, setBases] = useState(MOCK_KNOWLEDGE_BASES);
  const [sources, setSources] = useState(MOCK_SOURCES);
  const [selectedBase, setSelectedBase] = useState<any>(null);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [isSourceDetailOpen, setIsSourceDetailOpen] = useState(false);

  const openSourceDetail = (source: any) => {
    setSelectedSource(source);
    setIsSourceDetailOpen(true);
  };

  const [isAddBaseOpen, setIsAddBaseOpen] = useState(false);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [askQuery, setAskQuery] = useState("");
  const [askResult, setAskResult] = useState<any>(null);

  const handleAsk = () => {
    if (!askQuery.trim()) return;
    setIsAdding(true);
    setTimeout(() => {
      setAskResult({
        answer: "Esta es una respuesta simulada basada en el conocimiento indexado de esta base. Los precios incluyen soporte 24/7.",
        sources: ["Página de Precios", "Guía Comercial"],
        confidence: "Alta"
      });
      setIsAdding(false);
    }, 1500);
  };

  const simulateAddSource = (name: string, type: string) => {
    setIsAdding(true);
    setTimeout(() => {
      const newSource = {
        id: `s-${Date.now()}`,
        kbId: selectedBase.id,
        nombre: name,
        tipo: type,
        estado: "Procesando",
        usadaPor: 0,
        ultimaSincronizacion: new Date().toISOString(),
        creadaPor: "Usuario actual",
        tamaño: type === "Archivo" ? "1.2 MB" : "-",
        fragmentos: 0,
        descripcion: "Adicionado recientemente"
      };
      setSources([newSource, ...sources]);
      setIsAdding(false);
      setIsAddSourceOpen(false);
      toast({ title: "Fuente agregada y procesando" });
      
      setTimeout(() => {
        setSources(prev => prev.map(s => 
          s.id === newSource.id ? { ...s, estado: "Lista", fragmentos: 156 } : s
        ));
        toast({ title: "Fuente procesada con éxito" });
      }, 2500);

    }, 800);
  };

  const addBase = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const nombre = fd.get("nombre") as string;
    const desc = fd.get("desc") as string;
    if(!nombre.trim()) {
        toast({ title: "Falta el nombre" });
        return;
    }
    const newBase = {
      id: `kb-${Date.now()}`,
      nombre,
      descripción: desc,
      estado: "Lista",
      numeroFuentes: 0,
      agentesEnUso: [],
      cobertura: "Baja",
      ultimaActualizacion: new Date().toISOString()
    };
    setBases([newBase, ...bases]);
    toast({ title: "Base creada exitosamente" });
    setIsAddBaseOpen(false);
  };

  if (selectedBase) {
    const baseSources = sources.filter(s => s.kbId === selectedBase.id);

    return (
      <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
        <div className="flex items-center justify-between border-b px-8 py-6 sticky top-0 bg-background z-10 shrink-0">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => { setSelectedBase(null); setSelectedSource(null); }}>
                <i className="ri-arrow-left-line"></i>
             </Button>
             <div>
               <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                  {selectedBase.nombre}
                  <Badge variant={selectedBase.estado === "Lista" ? "outline" : "secondary"} className="shadow-none font-normal">
                     {selectedBase.estado}
                  </Badge>
               </h1>
               <p className="text-sm text-muted-foreground mt-1">{selectedBase.descripción}</p>
             </div>
          </div>
          <Button onClick={() => setIsAddSourceOpen(true)} className="shadow-sm">
            <i className="ri-add-line mr-2"></i> Agregar fuente
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 h-full flex flex-col">
              <div className="rounded-xl border bg-background shadow-sm overflow-hidden flex-1">
                 <Table>
                   <TableHeader className="bg-muted/50">
                      <TableRow>
                         <TableHead className="pl-6">Nombre</TableHead>
                         <TableHead>Estado</TableHead>
                         <TableHead>Tipo</TableHead>
                         <TableHead>Fragmentos</TableHead>
                         <TableHead className="text-right pr-6">Acción</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {baseSources.map(s => (
                         <TableRow 
                            key={s.id} 
                            className={`group cursor-pointer ${selectedSource?.id === s.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                            onClick={() => openSourceDetail(s)}
                         >
                            <TableCell className="font-medium pl-6">
                               <div className="text-foreground text-sm">{s.nombre}</div>
                               <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[150px]">{s.descripcion}</div>
                            </TableCell>
                            <TableCell>
                               <Badge variant="outline" className="shadow-none font-medium h-5 py-0 px-2 text-[10px]">
                                  {s.estado === "Procesando" && <i className="ri-loader-4-line animate-spin mr-1"></i>}
                                  {s.estado}
                               </Badge>
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center text-sm text-muted-foreground">
                                  <i className="ri-file-line mr-2"></i> {s.tipo}
                               </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                               {s.fragmentos}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                               <Button type="button" variant="ghost" size="sm" onClick={(event) => {
                                  event.stopPropagation();
                                  openSourceDetail(s);
                               }}>Ver detalle</Button>
                            </TableCell>
                         </TableRow>
                      ))}
                      {baseSources.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No hay fuentes en esta base.</TableCell>
                         </TableRow>
                      )}
                   </TableBody>
                 </Table>
               </div>
            </div>

            <div className="space-y-6">
               <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="font-semibold mb-2 leading-none tracking-tight">Preguntar a la base</h3>
                 <p className="text-xs text-muted-foreground mb-4">Simula la forma en la que un agente IA extrae información.</p>
                 <Textarea 
                    value={askQuery}
                    onChange={(e) => setAskQuery(e.target.value)}
                    className="min-h-[80px] bg-background mb-3 text-sm focus-visible:ring-1" 
                    placeholder="Ej. ¿Cuáles son las políticas de devolución?" 
                 />
                 <Button onClick={handleAsk} disabled={isAdding || !askQuery.trim()} className="w-full shadow-sm" size="sm">
                    {isAdding ? <><i className="ri-loader-4-line animate-spin mr-2"></i> Buscando...</> : <><i className="ri-search-eye-line mr-2"></i> Consultar</>}
                 </Button>

                 {askResult && (
                    <div className="mt-6 space-y-4 pt-6 border-t animate-in fade-in slide-in-from-bottom-2">
                       <div>
                          <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Respuesta generada</p>
                          <p className="text-sm">{askResult.answer}</p>
                       </div>
                       <div>
                          <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Fuentes consultadas</p>
                          <div className="flex flex-wrap gap-1">
                             {askResult.sources.map((src: string) => (
                                <Badge key={src} variant="secondary" className="font-normal text-[10px]"><i className="ri-file-text-line mr-1"></i> {src}</Badge>
                             ))}
                          </div>
                          <div className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium"><i className="ri-shield-check-line"></i> Cobertura: {askResult.confidence}</div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>

        <Dialog open={isAddSourceOpen} onOpenChange={setIsAddSourceOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agregar fuente de conocimiento</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="file" className="mt-4">
               <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto gap-4">
                  <TabsTrigger value="file" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2">Archivo</TabsTrigger>
                  <TabsTrigger value="url" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2">URL</TabsTrigger>
                  <TabsTrigger value="text" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2">Texto</TabsTrigger>
                  <TabsTrigger value="notion" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2">Notion</TabsTrigger>
                  <TabsTrigger value="drive" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2">Drive</TabsTrigger>
               </TabsList>
               
               <TabsContent value="file" className="pt-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center bg-muted/20">
                     <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <i className="ri-file-upload-line text-2xl text-primary"></i>
                     </div>
                     <p className="text-sm font-medium">Arrastra un PDF, CSV o TXT aquí</p>
                     <p className="text-xs text-muted-foreground mt-1 mb-6">o haz clic para seleccionar (Máx 50MB)</p>
                     <Button variant="outline" onClick={() => simulateAddSource("Documento_Subido.pdf", "Archivo")} disabled={isAdding}>
                        {isAdding ? <><i className="ri-loader-4-line animate-spin mr-2"></i> Subiendo...</> : "Seleccionar archivo"}
                     </Button>
                  </div>
               </TabsContent>

               <TabsContent value="url" className="pt-6 space-y-4">
                  <div className="space-y-2">
                     <Label className="text-xs">URL Pública</Label>
                     <Input placeholder="https://ejemplo.com/faq" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-xs">Nombre opcional</Label>
                     <Input placeholder="Ej. FAQs Públicas" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-xs">Frecuencia de sincronización</Label>
                     <Select defaultValue="manual">
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="manual">Manual</SelectItem>
                           <SelectItem value="daily">Diaria</SelectItem>
                           <SelectItem value="weekly">Semanal</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <Button onClick={() => simulateAddSource("Página escaneada", "URL")} disabled={isAdding} className="w-full">
                     {isAdding ? "Extrayendo..." : "Escanear URL"}
                  </Button>
               </TabsContent>

               <TabsContent value="text" className="pt-6 space-y-4">
                  <div className="space-y-2">
                     <Label className="text-xs">Nombre de referencia</Label>
                     <Input placeholder="Ej. Respuestas de soporte" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-xs">Contenido</Label>
                     <Textarea className="min-h-[120px]" placeholder="Pega texto directamente aquí..." />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-xs">Descripción opcional</Label>
                     <Input placeholder="..." />
                  </div>
                  <Button onClick={() => simulateAddSource("Texto pegado", "Texto")} disabled={isAdding} className="w-full">
                     {isAdding ? "Guardando..." : "Guardar texto"}
                  </Button>
               </TabsContent>

               <TabsContent value="notion" className="pt-6">
                  <div className="flex flex-col items-center text-center pt-4">
                     <i className="ri-notion-fill text-4xl mb-4 text-foreground/80"></i>
                     <p className="text-sm font-medium mb-1">Conecta tu workspace de Notion</p>
                     <p className="text-xs text-muted-foreground mb-6 max-w-[280px]">Sincroniza paginas y bases de datos enteras automáticamente cuando cambian.</p>
                     <Button onClick={() => simulateAddSource("Página de Notion", "Notion")} disabled={isAdding} className="w-full">
                        {isAdding ? "Conectando..." : "Conectar Notion"}
                     </Button>
                  </div>
               </TabsContent>

               <TabsContent value="drive" className="pt-6">
                  <div className="flex flex-col items-center text-center pt-4">
                     <i className="ri-google-drive-fill text-4xl mb-4 text-foreground/80"></i>
                     <p className="text-sm font-medium mb-1">Conecta Google Drive</p>
                     <p className="text-xs text-muted-foreground mb-6 max-w-[280px]">Importa documentos y hojas de cálculo para mantener tus agentes al día.</p>
                     <Button onClick={() => simulateAddSource("Documento de Drive", "Google Drive")} disabled={isAdding} className="w-full">
                        {isAdding ? "Conectando..." : "Conectar Google Drive"}
                     </Button>
                  </div>
               </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        <Sheet open={isSourceDetailOpen} onOpenChange={setIsSourceDetailOpen}>
          <SheetContent side="right" className="w-[400px] sm:max-w-[480px] overflow-y-auto">
            {selectedSource && (
              <>
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                     <Badge variant="outline" className="font-normal relative pl-4 shadow-sm">
                        <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${selectedSource.estado === 'Procesando' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                        {selectedSource.estado}
                     </Badge>
                     <div className="text-xs font-medium text-muted-foreground"><i className="ri-file-text-line mr-1"></i> {selectedSource.tipo}</div>
                  </div>
                  <SheetTitle className="text-xl">{selectedSource.nombre}</SheetTitle>
                  <SheetDescription>{selectedSource.descripcion}</SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                   <div>
                      <h4 className="text-sm font-semibold mb-3">Información general</h4>
                      <div className="space-y-3">
                         <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground"><span className="col-span-1">Creada por</span><span className="col-span-2 text-foreground font-medium">{selectedSource.creadaPor || 'Sistema'}</span></div>
                         <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground"><span className="col-span-1">Última sinc.</span><span className="col-span-2 text-foreground">{new Date(selectedSource.ultimaSincronizacion || Date.now()).toLocaleDateString()}</span></div>
                         <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground"><span className="col-span-1">Agentes</span><span className="col-span-2 text-foreground">{selectedSource.usadaPor || 0} conectados</span></div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-xl border border-transparent">
                         <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Fragmentos</div>
                         <div className="font-semibold text-xl">{selectedSource.fragmentos}</div>
                      </div>
                      <div className="bg-muted p-4 rounded-xl border border-transparent">
                         <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Tamaño</div>
                         <div className="font-semibold text-xl">{selectedSource.tamaño}</div>
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm font-semibold mb-3">Extractos detectados</h4>
                      <div className="space-y-3">
                         <div className="bg-muted/50 p-4 rounded-lg text-sm border shadow-sm text-foreground">
                            <p className="line-clamp-3 text-muted-foreground italic">"Para devoluciones fuera de plazo, el cliente debe contactar explícitamente a soporte para autorización excepcional..."</p>
                         </div>
                         <div className="bg-muted/50 p-4 rounded-lg text-sm border shadow-sm text-foreground">
                           <p className="line-clamp-3 text-muted-foreground italic">"Los equipos de hardware incluyen garantía de 1 año. Las baterías solo cuentan con 6 meses por degradación natural."</p>
                         </div>
                      </div>
                   </div>

                   <div className="pt-4 space-y-3">
                      <Button 
                         variant="outline" 
                         className="w-full shadow-sm" 
                         disabled={selectedSource.estado === "Procesando"}
                         onClick={() => {
                            toast({ title: "Reprocesando fuente..." });
                            setSelectedSource({...selectedSource, estado: "Procesando"});
                            setSources(prev => prev.map(s => s.id === selectedSource.id ? { ...s, estado: "Procesando" } : s));
                            setTimeout(() => {
                               setSelectedSource(curr => curr?.id === selectedSource.id ? {...curr, estado: "Lista"} : curr);
                               setSources(prev => prev.map(s => s.id === selectedSource.id ? { ...s, estado: "Lista" } : s));
                               toast({ title: "Fuente reprocesada" });
                            }, 1200);
                         }}
                      >
                         <i className={selectedSource.estado === "Procesando" ? "ri-loader-4-line animate-spin mr-2" : "ri-refresh-line mr-2"}></i> Reprocesar fuente
                      </Button>
                      <Button 
                         variant="destructive" 
                         className="w-full shadow-sm" 
                         onClick={() => {
                            if(window.confirm("¿Estás seguro de que deseas eliminar esta fuente?")) {
                               setSources(prev => prev.filter(s => s.id !== selectedSource.id));
                               setIsSourceDetailOpen(false);
                               toast({ title: "Fuente eliminada" });
                            }
                         }}
                      >
                         <i className="ri-delete-bin-line mr-2"></i> Eliminar fuente
                      </Button>
                   </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Base de conocimiento</h1>
          <p className="text-sm text-muted-foreground mt-1">Organiza el conocimiento que usan tus agentes para responder con contexto.</p>
        </div>
        <Button onClick={() => setIsAddBaseOpen(true)} className="shadow-sm">
          <i className="ri-folder-add-line mr-2"></i> Nueva base
        </Button>
      </div>

      <div className="p-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bases.map(base => (
               <Card key={base.id} className="cursor-pointer hover:border-primary/50 transition-colors shadow-sm" onClick={() => setSelectedBase(base)}>
                  <CardHeader className="pb-4">
                     <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-foreground">
                           <i className="ri-book-3-line text-xl"></i>
                        </div>
                        <Badge variant={base.estado === "Lista" ? "outline" : "secondary"} className="shadow-none font-medium text-xs">{base.estado}</Badge>
                     </div>
                     <CardTitle className="text-lg">{base.nombre}</CardTitle>
                     <CardDescription className="line-clamp-2 mt-1 min-h-[40px]">{base.descripción}</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-center text-sm text-muted-foreground">
                             <span>Fuentes de información</span>
                             <span className="font-medium text-foreground">{base.numeroFuentes}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm text-muted-foreground">
                             <span>Agentes conectados</span>
                             <span className="font-medium text-foreground">{base.agentesEnUso.length}</span>
                         </div>
                     </div>
                     <div className="text-sm text-muted-foreground pt-4 border-t mt-4">
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedBase(base); }} className="w-full">Abrir</Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
      
      <Dialog open={isAddBaseOpen} onOpenChange={setIsAddBaseOpen}>
         <DialogContent>
            <form onSubmit={addBase} noValidate>
               <DialogHeader>
                  <DialogTitle>Crear nueva base de conocimiento</DialogTitle>
               </DialogHeader>
               <div className="space-y-4 py-4">
                  <div className="space-y-2">
                     <Label>Nombre de la base</Label>
                     <Input name="nombre" placeholder="Ej. Políticas de reembolso" />
                  </div>
                  <div className="space-y-2">
                     <Label>Descripción</Label>
                     <Textarea name="desc" placeholder="Para qué sirve y qué agentes deberían usarla..." />
                  </div>
               </div>
               <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddBaseOpen(false)}>Cancelar</Button>
                  <Button type="submit">Crear base</Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
    </div>
  );
}
