import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/toaster";
import { MOCK_MESSAGES } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function ConversationThread({ conversation, contact, setConversations }: any) {
  const [messages, setMessages] = useState<any[]>(MOCK_MESSAGES[conversation.id] || []);
  const [composerText, setComposerText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(MOCK_MESSAGES[conversation.id] || []);
  }, [conversation.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (isInternal = false) => {
    if (!composerText.trim()) return;
    const newMessage = {
      id: `m-${Date.now()}`,
      sender: isInternal ? "internal" : "human",
      body: composerText,
      timestamp: new Date().toISOString(),
      status: "sent",
      isInternalNote: isInternal
    };
    setMessages([...messages, newMessage]);
    setComposerText("");
    toast({ title: isInternal ? "Nota guardada" : "Mensaje enviado" });
    
    // Update conversation last message fake
    setConversations((prev: any) => prev.map((c: any) => 
      c.id === conversation.id ? { ...c, ultimoMensaje: composerText, ultimaActividad: new Date().toISOString() } : c
    ));
  };

  const handleSuggestAI = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setComposerText("Claro, puedo ayudarte con eso. Para darte una mejor respuesta, ¿podrías compartirme un poco más de contexto?");
      setIsAiLoading(false);
    }, 1000);
  };

  const handleTakeover = () => {
    setConversations((prev: any) => prev.map((c: any) => 
      c.id === conversation.id ? { ...c, ownerType: "human", requiereHumano: false } : c
    ));
    setMessages([...messages, {
      id: `m-sys-${Date.now()}`,
      sender: "system",
      body: "Tomaste la conversación de la IA.",
      timestamp: new Date().toISOString()
    }]);
    toast({ title: "Control tomado" });
  };

  const handleResolve = () => {
    setConversations((prev: any) => prev.map((c: any) => 
      c.id === conversation.id ? { ...c, estado: "Resuelta" } : c
    ));
    toast({ title: "Conversación resuelta" });
  };

  return (
    <div className="flex flex-1 flex-col bg-background min-w-[400px]">
      <div className="flex h-14 items-center justify-between border-b px-6 shadow-sm z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{contact.nombre[0]}{contact.apellido[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold leading-none">{contact.nombreCompleto}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              <i className="ri-building-line mr-1"></i>
              {contact.empresa}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conversation.estado !== "Resuelta" && (
            <Button variant="outline" size="sm" onClick={handleResolve} className="h-8 shadow-sm">
              <i className="ri-check-line mr-1"></i> Resolver
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <i className="ri-more-2-line"></i>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-muted/10" ref={scrollRef}>
        <div className="flex flex-col gap-6 max-w-3xl mx-auto py-4">
          {messages.map((m: any, idx) => {
            if (m.sender === "system") {
              return (
                <div key={idx} className="flex justify-center my-2">
                   <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground font-medium">
                     {m.body}
                   </div>
                </div>
              )
            }
            const isCustomer = m.sender === "customer";
            const isInternal = m.isInternalNote || m.sender === "internal";
            const isAi = m.sender === "ai";

            return (
              <div key={idx} className={cn("flex gap-3", isCustomer ? "justify-start" : "justify-end")}>
                {isCustomer && (
                  <Avatar className="h-7 w-7 mt-1 shrink-0">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{contact.nombre[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "flex flex-col max-w-[75%]", 
                  isCustomer ? "items-start" : "items-end"
                )}>
                  <div className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                    isCustomer ? "bg-card border text-card-foreground rounded-tl-sm" : 
                    isInternal ? "bg-muted border border-border text-foreground rounded-tr-sm" :
                    isAi ? "bg-primary text-primary-foreground rounded-tr-sm" :
                    "bg-primary text-primary-foreground rounded-tr-sm" 
                  )}>
                    {m.body}
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!isCustomer && (
                       <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                         {isAi ? <><i className="ri-robot-2-line"></i> IA</> : isInternal ? <><i className="ri-lock-line"></i> Nota</> : <><i className="ri-user-line"></i> Humano</>}
                       </span>
                    )}
                  </div>
                  {isAi && m.sourcesUsed && (
                    <div className="mt-1 flex items-center gap-1 opacity-70">
                      <i className="ri-file-text-line text-[10px] text-muted-foreground"></i>
                      <span className="text-[10px] text-muted-foreground font-medium">Basado en: {m.sourcesUsed.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t bg-background p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl mx-auto">
          {conversation.ownerType === "ai" && conversation.estado !== "Resuelta" && (
            <div className="mb-3 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <i className="ri-robot-2-fill text-primary"></i>
                <span className="font-medium">IA gestionando esta conversación</span>
              </div>
              <Button size="sm" variant="secondary" onClick={handleTakeover} className="h-7 text-xs shadow-sm bg-background">
                Tomar el control
              </Button>
            </div>
          )}

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring focus-within:border-border transition-all">
            <Tabs defaultValue="reply">
              <div className="flex items-center justify-between border-b px-2 py-1 bg-muted/20">
                <TabsList className="bg-transparent h-8 p-0 space-x-1">
                  <TabsTrigger value="reply" className="data-[state=active]:bg-background data-[state=active]:shadow-sm h-7 text-xs px-3">
                    <i className="ri-reply-line mr-1.5"></i> Responder
                  </TabsTrigger>
                  <TabsTrigger value="note" className="data-[state=active]:bg-muted data-[state=active]:text-foreground border border-transparent data-[state=active]:border-border h-7 text-xs px-3">
                    <i className="ri-sticky-note-line mr-1.5"></i> Nota interna
                  </TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm" onClick={handleSuggestAI} disabled={isAiLoading} className="h-7 text-xs text-muted-foreground hover:text-foreground">
                  {isAiLoading ? <i className="ri-loader-4-line animate-spin mr-1.5"></i> : <i className="ri-magic-line mr-1.5"></i>}
                  Sugerir con IA
                </Button>
              </div>
              <TabsContent value="reply" className="m-0 p-0 border-none outline-none">
                <Textarea 
                  placeholder={`Responder a ${contact.nombre}...`}
                  className="min-h-[80px] border-0 focus-visible:ring-0 resize-none shadow-none text-sm p-3 bg-transparent"
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onKeyDown={(e) => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend(false); }}}
                  disabled={conversation.estado === "Resuelta"}
                />
                <div className="flex items-center justify-between p-2 pt-0">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><i className="ri-attachment-2"></i></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><i className="ri-emoji-sticker-line"></i></Button>
                  </div>
                  <Button size="sm" onClick={() => handleSend(false)} disabled={!composerText.trim() || conversation.estado === "Resuelta"} className="h-8 shadow-sm">
                    Enviar <i className="ri-send-plane-fill ml-1.5"></i>
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="note" className="m-0 p-0 border-none outline-none bg-amber-50/30">
                <Textarea 
                  placeholder="Escribe una nota interna (el cliente no la verá)..."
                  className="min-h-[80px] border-0 focus-visible:ring-0 resize-none shadow-none text-sm p-3 bg-transparent placeholder:text-muted-foreground text-foreground"
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onKeyDown={(e) => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend(true); }}}
                />
                <div className="flex items-center justify-end p-2 pt-0">
                  <Button size="sm" variant="secondary" onClick={() => handleSend(true)} disabled={!composerText.trim()} className="h-8 bg-muted text-foreground hover:bg-muted/80 border-transparent shadow-sm">
                    Guardar nota
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
