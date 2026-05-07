import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";

export function PlaygroundView() {
  const [testing, setTesting] = useState(false);
  const [messages, setMessages] = useState<{id: string, sender: "user"|"ai"|"system", text: string, metadata?: any}[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  
  // Selections
  const [agent, setAgent] = useState("Soporte Técnico");
  const [channel, setChannel] = useState("WhatsApp");
  const [scenario, setScenario] = useState("Pregunta de precios");
  const [customerProfile, setCustomerProfile] = useState("Cliente curioso");
  const [crmContext, setCrmContext] = useState("Lead nuevo");
  const [knowledgeBase, setKnowledgeBase] = useState("Ventas y precios");
  const [expectedResult, setExpectedResult] = useState("La IA debería responder");
  
  // Right panel state
  const [evaluation, setEvaluation] = useState<any>(null);

  // Scenarios mapping to messages
  const loadScenario = () => {
     let initialMessage = "Hola.";
     if (scenario === "Pregunta de precios") initialMessage = "Hola, ¿qué plan recomiendan para un equipo de 5 personas?";
     if (scenario === "Solicitud de humano") initialMessage = "No quiero seguir hablando con un bot. Quiero que me atienda una persona.";
     if (scenario === "Queja o frustración") initialMessage = "Ya expliqué esto varias veces y nadie me da una respuesta clara.";
     if (scenario === "Pregunta fuera de conocimiento") initialMessage = "¿Pueden hacer una integración personalizada con un sistema interno que no aparece en su documentación?";
     if (scenario === "Onboarding") initialMessage = "Acabamos de contratar la plataforma y no sabemos por dónde empezar.";
     
     const newMessages: {id: string, sender: "user"|"ai"|"system", text: string}[] = [{ id: Date.now().toString(), sender: "user", text: initialMessage }];
     setMessages(newMessages);
     setEvaluation(null);
     
     generateAIResponse(newMessages);
     
     toast({ title: "Escenario cargado y evaluado" })
  };

  const restart = () => {
     setMessages([]);
     setEvaluation(null);
  }

  const sendMessageUser = (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: inputMsg }]);
    setInputMsg("");
    setEvaluation(null);
  };

  const generateAIResponse = (currentMessages = messages) => {
    if (currentMessages.length === 0) return;
    setTesting(true);

    setTimeout(() => {
      setTesting(false);
      
      let responseText = "Entiendo. ¿Me podrías dar un poco más de contexto?";
      let isHandoff = false;
      let decidedIntent = "Soporte";
      let confidence = 0.85;

      if (scenario === "Pregunta de precios") {
         responseText = "Para un equipo de 5 personas, normalmente recomendaría el plan Profesional porque permite centralizar conversaciones, usar automatización con IA y mantener visibilidad del historial del cliente. Si quieres, también puedo ayudarte a comparar ese plan contra una opción más básica.";
         decidedIntent = "Precios";
      } else if (scenario === "Solicitud de humano") {
         responseText = "Claro, te voy a pasar con una persona del equipo para que pueda ayudarte directamente.";
         isHandoff = true;
         decidedIntent = "Soporte";
         confidence = 0.95;
      } else if (scenario === "Queja o frustración") {
         responseText = "Lamento la frustración. Para evitar hacerte repetir la información, voy a pasar esta conversación a una persona del equipo con el contexto de lo que ya compartiste.";
         isHandoff = true;
         decidedIntent = "Queja";
         confidence = 0.90;
      } else if (scenario === "Pregunta fuera de conocimiento") {
         responseText = "No tengo suficiente información confirmada sobre esa integración específica. Puedo recopilar un poco más de contexto y pasar el caso al equipo para revisarlo correctamente.";
         isHandoff = true;
         decidedIntent = "Fuera de conocimiento";
         confidence = 0.40;
      } else if (scenario === "Onboarding") {
         responseText = "¡Bienvenidos! Para empezar, les sugiero conectar su primer canal desde la sección Canales. Aquí tienen el link al paso a paso.";
         decidedIntent = "Onboarding";
      }

      setMessages(prev => [...prev, { 
         id: Date.now().toString(),
         sender: "ai", 
         text: responseText
      }]);

      setEvaluation({
         decision: isHandoff && scenario === "Pregunta fuera de conocimiento" ? "Pedir más información o traspasar a humano" : isHandoff ? "Traspasar a humano" : "Responder",
         confidence: (confidence * 100).toFixed(0) + "%",
         confidenceLevel: confidence > 0.8 ? "Alta" : confidence > 0.6 ? "Media" : "Baja",
         intent: decidedIntent,
         sources: isHandoff ? [] : [knowledgeBase, "Objeciones comerciales", "FAQ comercial"],
         rules: isHandoff && scenario === "Solicitud de humano" ? ["Usuario pidió humano"] : isHandoff && scenario === "Queja o frustración" ? ["Frustración detectada"] : isHandoff && scenario === "Pregunta fuera de conocimiento" ? ["Fuera de conocimiento"] : ["Ninguna"],
         actions: [
            isHandoff ? false : true, // consultó kb
            true, // actualizó intención
            isHandoff // solicitó traspaso o marco como humano
         ],
         matchExpected: (isHandoff && expectedResult === "La IA debería traspasar a humano") || (!isHandoff && expectedResult.includes("responder")) ? "Cumple" : "No cumple"
      });
    }, 1000);
  };

  const forceHandoff = () => {
     setMessages(prev => [...prev, { id: Date.now().toString(), sender: "system", text: "La simulación marcó esta conversación como Necesita humano." }]);
     setEvaluation({ 
         ...(evaluation || { decision: "", confidence: "", confidenceLevel: "", intent: "", sources: [], rules: [], actions: [], matchExpected: "" }), 
         decision: "Traspasar a humano", 
         rules: ["Traspaso forzado manualmente"] 
     });
  };
  
  const addContextNote = () => {
     const note = prompt("Escribe una nota de contexto:");
     if (note) {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "system", text: `Nota: ${note}` }]);
     }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b px-8 py-5 shrink-0 bg-background z-10 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Simulador de agentes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Prueba escenarios reales combinando agente, canal, cliente, contexto CRM, conocimiento y reglas antes de activar cambios.</p>
        </div>
        <p className="text-xs text-muted-foreground max-w-[250px] sm:text-right hidden xl:block">
           Usa el simulador para validar escenarios completos. Para ajustes rápidos de un agente específico, usa el tester dentro de su configuración.
        </p>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr_320px] bg-muted/10 items-stretch">
         
         {/* LEFT COLUMN: Setup */}
         <div className="border-r bg-background flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b bg-muted/20 shrink-0">
               <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Configuración de prueba</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
               <div className="space-y-2">
                  <Label className="text-xs">Agente</Label>
                  <Select value={agent} onValueChange={setAgent}>
                     <SelectTrigger><SelectValue/></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Agente de Soporte">Agente de Soporte</SelectItem>
                        <SelectItem value="Agente de Ventas">Agente de Ventas</SelectItem>
                        <SelectItem value="Agente de Onboarding">Agente de Onboarding</SelectItem>
                     </SelectContent>
                  </Select>
                  <div className="text-[10px] text-muted-foreground mt-1">Estado: Activo • 2 canales • 1 base de datos</div>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs">Canal</Label>
                  <Select value={channel} onValueChange={setChannel}>
                     <SelectTrigger><SelectValue/></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Web Chat">Web Chat</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs">Escenario</Label>
                  <Select value={scenario} onValueChange={setScenario}>
                     <SelectTrigger><SelectValue/></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Pregunta de precios">Pregunta de precios</SelectItem>
                        <SelectItem value="Solicitud de demo">Solicitud de demo</SelectItem>
                        <SelectItem value="Queja o frustración">Queja o frustración</SelectItem>
                        <SelectItem value="Pregunta fuera de conocimiento">Pregunta fuera de conocimiento</SelectItem>
                        <SelectItem value="Solicitud de humano">Solicitud de humano</SelectItem>
                        <SelectItem value="Onboarding">Onboarding</SelectItem>
                        <SelectItem value="Problema técnico">Problema técnico</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs">Perfil del cliente</Label>
                  <Select value={customerProfile} onValueChange={setCustomerProfile}>
                     <SelectTrigger><SelectValue/></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Cliente curioso">Cliente curioso</SelectItem>
                        <SelectItem value="Cliente molesto">Cliente molesto</SelectItem>
                        <SelectItem value="Cliente listo para comprar">Cliente listo para comprar</SelectItem>
                        <SelectItem value="Cliente confundido">Cliente confundido</SelectItem>
                        <SelectItem value="Cliente que pide humano">Cliente que pide humano</SelectItem>
                     </SelectContent>
                  </Select>
                  <div className="bg-primary/5 p-2 rounded border border-primary/10 text-xs text-muted-foreground mt-2">
                     {customerProfile === "Cliente molesto" && "El usuario no entiende una respuesta previa y muestra frustración."}
                     {customerProfile === "Cliente curioso" && "Hace preguntas exploratorias buscando información general."}
                     {customerProfile === "Cliente listo para comprar" && "Quiere concretar una acción o tiene dudas finales."}
                     {customerProfile === "Cliente que pide humano" && "Se niega a interactuar con bots, requiere atención directa."}
                     {customerProfile === "Cliente confundido" && "Duda de cómo usar la plataforma o dónde encontrar algo."}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs">Contexto CRM</Label>
                  <Select value={crmContext} onValueChange={setCrmContext}>
                     <SelectTrigger><SelectValue/></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Lead nuevo">Lead nuevo</SelectItem>
                        <SelectItem value="Cliente activo">Cliente activo</SelectItem>
                        <SelectItem value="Cliente de alta prioridad">Cliente de alta prioridad</SelectItem>
                        <SelectItem value="Contacto sin propietario">Contacto sin propietario</SelectItem>
                     </SelectContent>
                  </Select>
                  <div className="text-[10px] text-muted-foreground mt-1 font-mono bg-muted p-2 rounded">
                     <div>Nombre: Juan Pérez</div>
                     <div>Empresa: Tech Corp</div>
                     <div>Etapa: {crmContext === "Lead nuevo" ? "Prospección" : "Fidelizado"}</div>
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs">Base de conocimiento</Label>
                  <Select value={knowledgeBase} onValueChange={setKnowledgeBase}>
                     <SelectTrigger><SelectValue/></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Centro de ayuda">Centro de ayuda</SelectItem>
                        <SelectItem value="Ventas y precios">Ventas y precios</SelectItem>
                        <SelectItem value="Onboarding de clientes">Onboarding de clientes</SelectItem>
                        <SelectItem value="Políticas internas">Políticas internas</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs">Resultado esperado</Label>
                  <Select value={expectedResult} onValueChange={setExpectedResult}>
                     <SelectTrigger><SelectValue/></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="La IA debería responder">La IA debería responder</SelectItem>
                        <SelectItem value="La IA debería pedir más información">La IA debería pedir más información</SelectItem>
                        <SelectItem value="La IA debería traspasar a humano">La IA debería traspasar a humano</SelectItem>
                        <SelectItem value="La IA debería consultar la base de conocimiento">La IA debería consultar la base de conocimiento</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="p-4 border-t bg-background shrink-0 flex gap-2">
               <Button onClick={restart} variant="outline" className="flex-1">Reiniciar</Button>
               <Button onClick={loadScenario} className="flex-1">Cargar y simular</Button>
            </div>
         </div>

         {/* CENTER COLUMN: Chat Simulation */}
         <div className="flex flex-col h-full bg-background border-r relative shadow-inner">
            <div className="bg-primary px-6 py-3 text-primary-foreground flex justify-between items-center shadow-sm shrink-0 border-b z-10">
               <div>
                  <div className="font-medium flex items-center gap-2"><i className="ri-robot-2-line"></i> {agent}</div>
                  <div className="text-primary-foreground/70 text-[10px] uppercase tracking-widest mt-0.5">{channel} • {scenario}</div>
               </div>
               <Badge variant="secondary" className="bg-primary-foreground text-primary font-bold shadow-none">Simulación</Badge>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
               {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                     <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <i className="ri-test-tube-line text-3xl opacity-50"></i>
                     </div>
                     <h4 className="text-lg font-medium text-foreground mb-1">Carga un escenario</h4>
                     <p className="text-sm max-w-sm">Pulsa "Cargar y simular" o escribe un mensaje inicial para iniciar la simulación.</p>
                  </div>
               ) : (
                  messages.map((msg) => (
                     <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                        {msg.sender === 'system' ? (
                           <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs py-1.5 px-3 rounded font-medium border border-amber-200 dark:border-amber-800">
                             {msg.text}
                           </div>
                        ) : (
                           <div className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                              <span className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider px-1">{msg.sender === 'user' ? 'Cliente' : 'Agente IA'}</span>
                              <div className={`text-sm py-2.5 px-4 rounded-xl shadow-sm leading-relaxed ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                                 {msg.text}
                              </div>
                           </div>
                        )}
                     </div>
                  ))
               )}
               {testing && (
                  <div className="flex justify-start">
                     <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                        <i className="ri-loader-4-line animate-spin"></i> El agente está analizando el escenario...
                     </div>
                  </div>
               )}
            </div>

            <div className="p-4 border-t bg-muted/30 shrink-0 space-y-3">
               <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={() => generateAIResponse(messages)} size="sm" variant="secondary" className="text-xs" disabled={testing || messages.length === 0 || messages[messages.length-1].sender === 'ai'}>
                     <i className="ri-magic-line mr-1 text-primary"></i> Generar nueva respuesta
                  </Button>
                  <Button onClick={forceHandoff} size="sm" variant="outline" className="text-xs" disabled={messages.length===0}>Forzar traspaso</Button>
                  <Button onClick={addContextNote} size="sm" variant="outline" className="text-xs" disabled={messages.length===0}>Agregar nota</Button>
               </div>
               <form onSubmit={sendMessageUser} className="flex items-center gap-2" noValidate>
                  <Input 
                     value={inputMsg} 
                     onChange={(e) => setInputMsg(e.target.value)} 
                     placeholder="Escribe como cliente..." 
                     className="flex-1 shadow-sm bg-background border-muted-foreground/30" 
                  />
                  <Button type="submit" size="icon" className="shrink-0" disabled={testing || !inputMsg.trim()}><i className="ri-send-plane-fill"></i></Button>
               </form>
            </div>
         </div>

         {/* RIGHT COLUMN: Evaluation */}
         <div className="bg-background flex flex-col h-full overflow-hidden xl:flex hidden">
            <div className="p-5 border-b bg-muted/20 shrink-0">
               <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Evaluación y Decisiones</h3>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto space-y-6">
               {!evaluation ? (
                  <div className="text-center text-sm text-muted-foreground py-8">
                     Ejecuta una respuesta de la IA para ver intención, confianza, fuentes, reglas y acciones.
                  </div>
               ) : (
                  <>
                     <div className="space-y-4">
                        <div>
                           <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Decisión de la IA</div>
                           <div className={`px-3 py-2 rounded font-medium border text-sm ${evaluation.decision === 'Traspasar a humano' ? 'bg-amber-100 border-amber-200 text-amber-800' : 'bg-green-100 border-green-200 text-green-800'}`}>
                              <i className={`${evaluation.decision === 'Traspasar a humano' ? 'ri-user-shared-line' : 'ri-reply-line'} mr-2`}></i>
                              {evaluation.decision}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t pt-4">
                           <div>
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Confianza</div>
                              <div className="font-mono text-lg font-semibold">{evaluation.confidence}</div>
                              <Badge variant="outline" className="shadow-none text-[10px] mt-1">{evaluation.confidenceLevel}</Badge>
                           </div>
                           <div>
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Intención detectada</div>
                              <div className="font-medium text-sm truncate">{evaluation.intent}</div>
                           </div>
                        </div>

                        <div className="border-t pt-4">
                           <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fuentes Consultadas</div>
                           {evaluation.sources.length === 0 ? (
                              <div className="text-xs text-muted-foreground">Ninguna</div>
                           ) : (
                              <ul className="space-y-1">
                                 {evaluation.sources.map((s: string) => (
                                    <li key={s} className="text-xs flex items-center gap-2"><i className="ri-file-text-line text-primary"></i> {s}</li>
                                 ))}
                              </ul>
                           )}
                        </div>

                        <div className="border-t pt-4">
                           <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Reglas Activadas</div>
                           <ul className="space-y-1">
                              {evaluation.rules.map((r: string) => (
                                 <li key={r} className="text-xs flex items-center gap-2">
                                    <i className={`${r === 'Ninguna' ? 'ri-check-line text-muted-foreground' : 'ri-alert-line text-amber-500'}`}></i> {r}
                                 </li>
                              ))}
                           </ul>
                        </div>

                        <div className="border-t pt-4">
                           <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Acciones Ejecutadas</div>
                           <div className="space-y-2">
                              {evaluation.actions[0] && <div className="text-sm flex items-center gap-2"><i className="ri-checkbox-circle-fill text-green-500"></i> Consultó base de conocimiento</div>}
                              {evaluation.actions[1] && <div className="text-sm flex items-center gap-2"><i className="ri-checkbox-circle-fill text-green-500"></i> Actualizó intención del contacto</div>}
                              {evaluation.actions[2] && <div className="text-sm flex items-center gap-2"><i className="ri-user-shared-fill text-amber-500"></i> Solicitó traspaso a humano</div>}
                              {!evaluation.actions[2] && <div className="text-sm flex items-center gap-2"><i className="ri-checkbox-circle-fill text-green-500"></i> Preparó respuesta final</div>}
                           </div>
                        </div>

                        <div className="border-t pt-4">
                           <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Comparación con resultado esperado</div>
                           <div className="flex items-start gap-2">
                              {evaluation.matchExpected === "Cumple" ? (
                                 <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5"><i className="ri-check-line"></i></div>
                              ) : (
                                 <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5"><i className="ri-close-line"></i></div>
                              )}
                              <div className="text-xs text-muted-foreground">La IA respondió usando la base de conocimiento seleccionada y mantuvo la conversación dentro del flujo esperado.</div>
                           </div>
                        </div>
                     </div>
                  </>
               )}
            </div>

            <div className="p-4 border-t bg-background shrink-0 grid grid-cols-2 gap-2">
               <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "Resultado aprobado" })} disabled={!evaluation}>Aprobar resultado</Button>
               <Button size="sm" variant="outline" className="text-xs" onClick={() => prompt("Describe el problema:") && toast({ title: "Problema reportado" })} disabled={!evaluation}>Marcar problema</Button>
               <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "Respuesta copiada" })} disabled={!evaluation}>Copiar respuesta</Button>
               <Button size="sm" variant="secondary" className="text-xs" onClick={() => toast({ title: "Caso guardado exitosamente" })} disabled={!evaluation}>Guardar como caso</Button>
               <div className="col-span-2 mt-2">
                  <Button size="sm" variant="default" className="w-full text-xs" onClick={() => toast({ title: "Abriendo configuración del agente" })}><i className="ri-settings-4-line mr-2"></i> Enviar a configuración del agente</Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
