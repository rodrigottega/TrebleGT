import fs from 'fs';
let content = fs.readFileSync('src/components/ai/AgentsView.tsx', 'utf-8');

// Button
content = content.replace(
  '<Button type="submit" form="agent-form">Guardar agente</Button>',
  '<Button type="submit" form="agent-form">{activeAgentId ? "Guardar cambios" : "Crear agente"}</Button>'
);

// Tester name
content = content.replace(
  'Tester Live: {agent?.nombre || "Nuevo Agente"}',
  'Tester Live: {agent?.nombre || "Agente sin guardar"}'
);

// Objetivo text area
content = content.replace(
  '<div className="grid grid-cols-2 gap-4">',
  `<div className="space-y-2">\n                           <label className="text-xs font-semibold text-muted-foreground">Objetivo principal</label>\n                           <Textarea name="objetivo" defaultValue={agent?.objetivo} placeholder="Ej. Resolver dudas técnicas recurrentes con precisión" className="h-16" />\n                        </div>\n                        <div className="grid grid-cols-2 gap-4">`
);

// Switch names
content = content.replace(
  '<Switch defaultChecked={agent?.canales.includes(c)} />',
  '<Switch name={`canal_${c}`} defaultChecked={agent?.canales.includes(c)} value="on" />'
);

// Checkbox names
content = content.replace(
  '<Checkbox defaultChecked={agent?.fuentesConocimiento.includes(kb.id)} />',
  '<Checkbox name={`kb_${kb.id}`} defaultChecked={agent?.fuentesConocimiento.includes(kb.id)} value="on" />'
);

// name="tono", name="estado"
content = content.replace(
  '<Select defaultValue={agent ? "amable" : "profesional"}>',
  '<Select name="tono" defaultValue={agent ? "amable" : "profesional"}>'
);
content = content.replace(
  '<Select defaultValue={agent?.estado === "Activo" ? "activo" : "borrador"}>',
  '<Select name="estado" defaultValue={agent?.estado === "Activo" ? "Activo" : "Borrador"}>'
);

// name="rol" and "bienvenida"
content = content.replace(
  '<Textarea className="h-24" placeholder="Eres un asistente de soporte experto en..." defaultValue={agent ? `Eres ${agent.nombre}. Tu objetivo es ${agent.objetivo}.` : ""} />',
  '<Textarea name="rol" className="h-24" placeholder="Eres un asistente de soporte experto en..." defaultValue={agent ? `Eres ${agent.nombre}. Tu objetivo es ${agent.objetivo}.` : ""} />'
);
content = content.replace(
  '<Textarea className="h-16" placeholder="¡Hola! Soy Nebula..." defaultValue="¡Hola! ¿En qué te puedo ayudar hoy?" />',
  '<Textarea name="bienvenida" className="h-16" placeholder="¡Hola! Soy Nebula..." defaultValue="¡Hola! ¿En qué te puedo ayudar hoy?" />'
);

fs.writeFileSync('src/components/ai/AgentsView.tsx', content);
