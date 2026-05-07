import fs from 'fs';

let content = fs.readFileSync('src/components/ai/KnowledgeBasesManager.tsx', 'utf-8');

// 1. Add state variable
if (!content.includes('const [isSourceDetailOpen, setIsSourceDetailOpen] = useState(false);')) {
  content = content.replace(
    'const [selectedSource, setSelectedSource] = useState<any>(null);',
    'const [selectedSource, setSelectedSource] = useState<any>(null);\n  const [isSourceDetailOpen, setIsSourceDetailOpen] = useState(false);\n\n  const openSourceDetail = (source: any) => {\n    setSelectedSource(source);\n    setIsSourceDetailOpen(true);\n  };'
  );
}

// 2. Modify table header
content = content.replace(
  '<TableHead>Fragmentos</TableHead>',
  '<TableHead>Fragmentos</TableHead>\n                         <TableHead className="text-right pr-6">Acción</TableHead>'
);

// 3. Modify table row
content = content.replace(
  /onClick=\{\(\) => setSelectedSource\(s\)\}/g,
  'onClick={() => openSourceDetail(s)}'
);

// 4. Modify table body cell for fragmentos to append action button
content = content.replace(
  /<TableCell className="text-muted-foreground text-sm">\s*\{s\.fragmentos\}\s*<\/TableCell>/g,
  `<TableCell className="text-muted-foreground text-sm">\n                               {s.fragmentos}\n                            </TableCell>\n                            <TableCell className="text-right pr-6">\n                               <Button type="button" variant="ghost" size="sm" onClick={(event) => {\n                                  event.stopPropagation();\n                                  openSourceDetail(s);\n                               }}>Ver detalle</Button>\n                            </TableCell>`
);

content = content.replace(
  '<TableCell colSpan={4}',
  '<TableCell colSpan={5}'
);

// 5. Add sheet at the end of the selectedBase block
const sheetBlock = `
        <Sheet open={isSourceDetailOpen} onOpenChange={setIsSourceDetailOpen}>
          <SheetContent side="right" className="w-[400px] sm:max-w-[480px] overflow-y-auto">
            {selectedSource && (
              <>
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                     <Badge variant="outline" className="font-normal relative pl-4 shadow-sm">
                        <div className={\`absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full \${selectedSource.estado === 'Procesando' ? 'bg-yellow-500' : 'bg-green-500'}\`}></div>
                        {selectedSource.estado}
                     </Badge>
                     <div className="text-xs font-medium text-muted-foreground"><i className="ri-file-text-line mr-1"></i> {selectedSource.tipo}</div>
                  </div>
                  <SheetTitle className="text-xl">{selectedSource.nombre}</SheetTitle>
                  <SheetDescription>{selectedSource.descripcion}</SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
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
                         <div className="bg-muted/50 p-3 rounded-lg text-sm border shadow-sm text-foreground">
                            <p className="line-clamp-3 text-muted-foreground italic">"Para devoluciones fuera de plazo, el cliente debe contactar explícitamente a soporte para autorización excepcional..."</p>
                         </div>
                         <div className="bg-muted/50 p-3 rounded-lg text-sm border shadow-sm text-foreground">
                           <p className="line-clamp-3 text-muted-foreground italic">"Los equipos de hardware incluyen garantía de 1 año. Las baterías solo cuentan con 6 meses por degradación natural."</p>
                         </div>
                      </div>
                   </div>

                   <div className="pt-4 space-y-3">
                      <Button 
                         variant="outline" 
                         className="w-full shadow-sm" 
                         onClick={() => {
                            toast({ title: "Reprocesando fuente..." });
                            const oldState = selectedSource.estado;
                            setSelectedSource({...selectedSource, estado: "Procesando"});
                            setIsSourceDetailOpen(true); // ensure open
                         }}
                      >
                         <i className="ri-refresh-line mr-2"></i> Reprocesar fuente
                      </Button>
                      <Button 
                         variant="destructive" 
                         className="w-full shadow-sm" 
                         onClick={() => {
                            if(window.confirm("¿Estás seguro de que deseas eliminar esta fuente?")) {
                               setIsSourceDetailOpen(false);
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
`;

content = content.replace(
  '</Dialog>\n      </div>\n    );\n  }',
  '</Dialog>\n' + sheetBlock + '\n      </div>\n    );\n  }'
);

// We should also replace the setSources calls in the timeouts above but wait... I didn't add global setSources to the fake patch. I'll just keep the original buttons without mutating the actual data table. Wait, the user specifically said:
// Reprocesar fuente: 1. Mostrar loading en el botón (cambiar a Procesando?). 2. Cambiar estado a Procesando. 3. 1.2s cambiar estado a Lista.
// Let's modify the buttons to do the state update:

content = content.replace(
  'const oldState = selectedSource.estado;',
  \`const oldState = selectedSource.estado;
                            setSources(prev => prev.map(s => s.id === selectedSource.id ? { ...s, estado: "Procesando" } : s));
                            setTimeout(() => {
                               setSelectedSource({...selectedSource, estado: "Lista"});
                               setSources(prev => prev.map(s => s.id === selectedSource.id ? { ...s, estado: "Lista" } : s));
                               toast({ title: "Fuente reprocesada" });
                            }, 1200);\`
);

content = content.replace(
  'setIsSourceDetailOpen(false);',
  \`setSources(prev => prev.filter(s => s.id !== selectedSource.id));
                               setIsSourceDetailOpen(false);
                               toast({ title: "Fuente eliminada" });\`
);


fs.writeFileSync('src/components/ai/KnowledgeBasesManager.tsx', content);
