// Contactos (20)
export const MOCK_CONTACTS = [
  ...Array(20).fill(0).map((_, i) => ({
    id: `${i+1}`,
    nombre: ['Ana', 'Carlos', 'Sofía', 'Diego', 'Valentina', 'Juan', 'Lucía', 'Mateo', 'María', 'Gabriel'][i % 10],
    apellido: ['Martínez', 'Ruiz', 'López', 'Herrera', 'Torres', 'Pérez', 'García', 'Rodríguez', 'Sánchez', 'Romero'][i % 10],
    nombreCompleto: `${['Ana', 'Carlos', 'Sofía', 'Diego', 'Valentina', 'Juan', 'Lucía', 'Mateo', 'María', 'Gabriel'][i % 10]} ${['Martínez', 'Ruiz', 'López', 'Herrera', 'Torres', 'Pérez', 'García', 'Rodríguez', 'Sánchez', 'Romero'][i % 10]}`,
    email: `contacto${i+1}@ejemplo.com`,
    telefono: `+52 55 1234 ${5000 + i}`,
    empresa: ['Acme Corp', 'TechFlow', 'Boutique SJ', 'Atlas Finance', 'Bright Labs', 'Nova Retail', 'Delta Health'][i % 7],
    canalPrincipal: ['WhatsApp', 'Instagram', 'Web Chat'][i % 3],
    estado: ['Nuevo', 'Abierto', 'Pendiente', 'Calificado', 'Cliente', 'Perdido', 'Archivado'][i % 7],
    etapa: ['Lead', 'MQL', 'SQL', 'Cliente', 'Retención'][i % 5],
    propietario: i % 4 === 0 ? null : ['Laura Gómez', 'Pedro Pascal', 'Sara Connor', 'John Doe'][(i % 4) - 1],
    ciudad: ['Ciudad de México', 'Madrid', 'Bogotá', 'Buenos Aires', 'Santiago'][i % 5],
    pais: ['México', 'España', 'Colombia', 'Argentina', 'Chile'][i % 5],
    idioma: "es",
    etiquetas: [['Alta Prioridad', 'SaaS'], ['Demo'], ['VIP', 'Soporte'], ['Urgente'], [], ['Eventos'], ['Q3']][i % 7],
    fechaCreacion: new Date(Date.now() - 86400000 * (i * 2 + 1)).toISOString(),
    ultimaActividad: new Date(Date.now() - 3600000 * i).toISOString(),
    totalConversaciones: (i % 5) + 1,
    aiStatus: ['Gestionado por IA', 'Necesita humano', 'Tomado por humano', 'Sin IA'][i % 4],
    intencionDetectada: ['Precios', 'Soporte', 'Demo', 'Producto', 'Queja', 'Seguimiento', 'Onboarding'][i % 7],
    prioridad: ['Baja', 'Media', 'Alta'][i % 3]
  }))
];

// Conversaciones (15)
export const MOCK_CONVERSATIONS = [
  ...Array(15).fill(0).map((_, i) => ({
    id: `c-${i+1}`,
    contactoId: `${(i % 20) + 1}`,
    contactoName: MOCK_CONTACTS[i % 20]?.nombreCompleto || 'Ana Martínez',
    canal: ['WhatsApp', 'Instagram', 'Web Chat'][i % 3],
    estado: ['Abierta', 'Pendiente', 'Resuelta', 'Spam', 'Abierta'][i % 5],
    asignadoA: i % 3 === 0 ? null : ['Laura Gómez', 'Pedro Pascal', 'Sara Connor'][(i % 3) - 1],
    ownerType: ['ai', 'human', 'unassigned'][i % 3],
    requiereHumano: i % 4 === 0,
    ultimoMensaje: [
      "¿Cuáles son los planes de precios para equipos pequeños?",
      "No entiendo la respuesta, quiero hablar con alguien.",
      "Gracias, eso resuelve mi duda.",
      "Necesito ayuda con la configuración de mi cuenta.",
      "¿Pueden hacer una demo el viernes?",
      "Tengo un problema con el pago.",
      "¿Hay integración con Hubspot?",
      "La aplicación está fallando.",
      "Mensaje de spam automático.",
      "Quiero cancelar mi suscripción."
    ][i % 10],
    ultimaActividad: new Date(Date.now() - 100000 * i * i).toISOString(),
    fechaCreacion: new Date(Date.now() - 200000 * i * i - 86400000).toISOString(),
    etiquetas: [['Precios'], ['Demo', 'Queja'], ['Soporte'], ['Facturación'], []][i % 5],
    prioridad: ['Alta', 'Media', 'Baja'][i % 3],
    intencion: ['Precios', 'Demo', 'Soporte', 'Onboarding', 'Queja'][i % 5],
    resumenIA: "Resumen generado por IA sobre la conversación actual indicando el estado del usuario.",
    agenteAsignado: ['support', 'sales', 'onboarding'][i % 3],
    confidence: ['Alta (95%)', 'Media (70%)', 'Baja (35%)'][i % 3],
    handoffReason: (i % 4 === 0) ? "Frustración detectada" : null
  }))
];

// Mensajes (por conversación)
export const MOCK_MESSAGES: Record<string, any[]> = {};
MOCK_CONVERSATIONS.forEach(conv => {
    MOCK_MESSAGES[conv.id] = [
        { id: `m-${conv.id}-1`, sender: "customer", body: "Hola, necesito más información.", timestamp: new Date(Date.now() - 150000).toISOString(), status: "read" },
        { id: `m-${conv.id}-2`, sender: "ai", body: "¡Hola! Con gusto te ayudo. ¿Sobre qué tema te gustaría saber más?", timestamp: new Date(Date.now() - 145000).toISOString(), status: "sent", sourcesUsed: ["Centro de Ayuda"] },
        (() => {
            if (conv.requiereHumano) {
                return { id: `m-${conv.id}-3`, sender: "customer", body: "Quiero hablar con una persona.", timestamp: new Date(Date.now() - 100000).toISOString(), status: "read" };
            } else if (conv.ownerType === "human") {
                return { id: `m-${conv.id}-3`, sender: "human", body: "Hola, soy de soporte humano y te asistiré.", timestamp: new Date(Date.now() - 100000).toISOString(), status: "sent" };
            } else {
                return { id: `m-${conv.id}-3`, sender: "customer", body: conv.ultimoMensaje, timestamp: new Date(Date.now() - 100000).toISOString(), status: "read" };
            }
        })(),
        { id: `m-${conv.id}-4`, sender: "system", body: conv.requiereHumano ? "El usuario solicitó traspaso a humano." : (conv.ownerType === "human" ? "Tomado por humano." : "Conversación en curso con IA."), timestamp: new Date(Date.now() - 95000).toISOString() },
        { id: `m-${conv.id}-5`, sender: "internal", body: "Nota interna: Revisar el requerimiento comercial.", timestamp: new Date(Date.now() - 50000).toISOString(), isInternalNote: true }
    ];
});

// Agentes (3)
export const MOCK_AGENTS = [
  {
    id: "support",
    nombre: "Agente de Soporte",
    descripción: "Resuelve dudas técnicas y ayuda a los usuarios con problemas comunes.",
    estado: "Activo",
    objetivo: "Resolver el mayor número de tickets de soporte técnico",
    tono: "Amable y profesional",
    canales: ["WhatsApp", "Web Chat", "Instagram"],
    fuentesConocimiento: ["kb-1", "kb-4"],
    conversacionesGestionadas: 2450,
    tasaResolucion: 85,
    tasaTraspasoHumano: 15,
    ultimaActualizacion: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "sales",
    nombre: "Agente de Ventas",
    descripción: "Califica leads, explica planes y agenda demos.",
    estado: "Activo",
    objetivo: "Conseguir MQLs calificados y agendar demostraciones de producto.",
    tono: "Persuasivo y directo",
    canales: ["WhatsApp", "Web Chat"],
    fuentesConocimiento: ["kb-2"],
    conversacionesGestionadas: 1200,
    tasaResolucion: 60,
    tasaTraspasoHumano: 40,
    ultimaActualizacion: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "onboarding",
    nombre: "Agente de Onboarding",
    descripción: "Acompaña a los nuevos clientes en sus primeros pasos.",
    estado: "Pausado",
    objetivo: "Completar checklist de setup de nuevos clientes.",
    tono: "Paciente y didáctico",
    canales: ["Web Chat"],
    fuentesConocimiento: ["kb-3"],
    conversacionesGestionadas: 150,
    tasaResolucion: 90,
    tasaTraspasoHumano: 10,
    ultimaActualizacion: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

// Knowledge Bases (4)
export const MOCK_KNOWLEDGE_BASES = [
  {
    id: "kb-1",
    nombre: "Centro de ayuda",
    descripción: "Respuestas de soporte, preguntas frecuentes y documentación de producto.",
    estado: "Lista",
    numeroFuentes: 4,
    agentesEnUso: ["support"],
    cobertura: "Alta",
    ultimaActualizacion: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "kb-2",
    nombre: "Ventas y precios",
    descripción: "Información comercial, planes, objeciones frecuentes y criterios de calificación.",
    estado: "Lista",
    numeroFuentes: 3,
    agentesEnUso: ["sales"],
    cobertura: "Media",
    ultimaActualizacion: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "kb-3",
    nombre: "Onboarding de clientes",
    descripción: "Guías para nuevos clientes, configuración inicial y buenas prácticas.",
    estado: "Requiere atención",
    numeroFuentes: 2,
    agentesEnUso: ["onboarding"],
    cobertura: "Baja",
    ultimaActualizacion: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "kb-4",
    nombre: "Políticas internas",
    descripción: "Reglas operativas, tiempos de respuesta, escalaciones y límites de atención.",
    estado: "Procesando",
    numeroFuentes: 3,
    agentesEnUso: ["support"],
    cobertura: "Alta",
    ultimaActualizacion: new Date(Date.now() - 3600000).toISOString()
  }
];

// Fuentes (12)
export const MOCK_SOURCES = [
  { id: "s-1", kbId: "kb-1", nombre: "Guía de producto V2.pdf", tipo: "Archivo", estado: "Lista", usadaPor: 1, ultimaSincronizacion: new Date().toISOString(), creadaPor: "Laura Gómez", tamaño: "2.4 MB", fragmentos: 345, descripcion: "Manual PDF de producto." },
  { id: "s-2", kbId: "kb-1", nombre: "Centro de Ayuda Público", tipo: "URL", estado: "Lista", usadaPor: 1, ultimaSincronizacion: new Date(Date.now() - 86400000).toISOString(), creadaPor: "Admin", tamaño: "-", fragmentos: 1500, descripcion: "Scraping del centro de ayuda web." },
  { id: "s-3", kbId: "kb-1", nombre: "Políticas de respuesta.txt", tipo: "Archivo", estado: "Fallida", usadaPor: 0, ultimaSincronizacion: new Date(Date.now() - 86400000).toISOString(), creadaPor: "Laura Gómez", tamaño: "15 KB", fragmentos: 0, descripcion: "Error al procesar el archivo de texto." },
  { id: "s-4", kbId: "kb-1", nombre: "Respuestas directas", tipo: "Texto", estado: "Lista", usadaPor: 1, ultimaSincronizacion: new Date().toISOString(), creadaPor: "Admin", tamaño: "-", fragmentos: 25, descripcion: "Bloques de texto pegado con respuestas rápidas." },
  
  { id: "s-5", kbId: "kb-2", nombre: "Página de Precios", tipo: "URL", estado: "Lista", usadaPor: 1, ultimaSincronizacion: new Date(Date.now() - 3600000).toISOString(), creadaPor: "Ventas", tamaño: "-", fragmentos: 45, descripcion: "Landing page de planes." },
  { id: "s-6", kbId: "kb-2", objeciones: true, nombre: "Objeciones comerciales", tipo: "Notion", estado: "Lista", usadaPor: 1, ultimaSincronizacion: new Date().toISOString(), creadaPor: "Ventas", tamaño: "-", fragmentos: 120, descripcion: "Doc interno de Notion de equipo de ventas." },
  { id: "s-7", kbId: "kb-2", nombre: "Calculadora ROI", tipo: "Google Drive", estado: "Desactualizada", usadaPor: 1, ultimaSincronizacion: new Date(Date.now() - 86400000 * 15).toISOString(), creadaPor: "Ventas", tamaño: "1 MB", fragmentos: 10, descripcion: "Sheet de Drive." },
  
  { id: "s-8", kbId: "kb-3", nombre: "Checklist Config inicial", tipo: "Notion", estado: "Lista", usadaPor: 1, ultimaSincronizacion: new Date().toISOString(), creadaPor: "Onboarding", tamaño: "-", fragmentos: 60, descripcion: "Página de Notion con pasos iniciales." },
  { id: "s-9", kbId: "kb-3", nombre: "Onboarding Video Transcripts", tipo: "Texto", estado: "Lista", usadaPor: 1, ultimaSincronizacion: new Date(Date.now() - 86400000).toISOString(), creadaPor: "Onboarding", tamaño: "-", fragmentos: 200, descripcion: "Transcripciones de videos tutoriales." },
  
  { id: "s-10", kbId: "kb-4", nombre: "Reglas de escalación", tipo: "Google Drive", estado: "Lista", usadaPor: 1, ultimaSincronizacion: new Date().toISOString(), creadaPor: "Admin", tamaño: "-", fragmentos: 30, descripcion: "Documento sobre cuándo derivar a humano." },
  { id: "s-11", kbId: "kb-4", nombre: "SLA y Tiempos", tipo: "Texto", estado: "Lista", usadaPor: 0, ultimaSincronizacion: new Date().toISOString(), creadaPor: "Admin", tamaño: "-", fragmentos: 15, descripcion: "Tiempos esperados de respuesta." },
  { id: "s-12", kbId: "kb-4", nombre: "Guía de tono desactualizada", tipo: "Archivo", estado: "Fallida", usadaPor: 0, ultimaSincronizacion: new Date(Date.now() - 86400000 * 30).toISOString(), creadaPor: "Marketing", tamaño: "5 MB", fragmentos: 0, descripcion: "Archivo corrupto." },
];

export const MOCK_CHANNELS = [
  { id: "ch-1", nombre: "WhatsApp", estado: "Conectado", conversacionesHoy: 142, agenteAsignado: "sales", ultimaSincronizacion: new Date().toISOString(), plataforma: "WhatsApp Business API", numConectado: "+1 234 567 890" },
  { id: "ch-2", nombre: "Instagram", estado: "Conectado", conversacionesHoy: 89, agenteAsignado: "support", ultimaSincronizacion: new Date().toISOString(), cuentaConectada: "@acme_corp" },
  { id: "ch-3", nombre: "Web Chat", estado: "Conectado", conversacionesHoy: 215, agenteAsignado: "support", ultimaSincronizacion: new Date().toISOString(), dominio: "acme.com" }
];

export const MOCK_TEAM = [
  { id: "u-1", nombre: "Laura Gómez", email: "laura@ejemplo.com", rol: "Admin", estado: "Activo", ultimaActividad: new Date().toISOString(), conversaciones: 12 },
  { id: "u-2", nombre: "Pedro Pascal", email: "pedro@ejemplo.com", rol: "Agent", estado: "Activo", ultimaActividad: new Date(Date.now() - 3600000).toISOString(), conversaciones: 8 },
  { id: "u-3", nombre: "Sara Connor", email: "sara@ejemplo.com", rol: "Manager", estado: "Activo", ultimaActividad: new Date(Date.now() - 7200000).toISOString(), conversaciones: 0 },
  { id: "u-4", nombre: "John Doe", email: "john@ejemplo.com", rol: "Agent", estado: "Ausente", ultimaActividad: new Date(Date.now() - 86400000).toISOString(), conversaciones: 0 },
  { id: "u-5", nombre: "Ana Smith", email: "ana.smith@ejemplo.com", rol: "Agent", estado: "Activo", ultimaActividad: new Date().toISOString(), conversaciones: 15 },
  { id: "u-6", nombre: "Carlos Lee", email: "carlos@ejemplo.com", rol: "Viewer", estado: "Invitado", ultimaActividad: "-", conversaciones: 0 },
  { id: "u-7", nombre: "María Ruiz", email: "maria@ejemplo.com", rol: "Agent", estado: "Activo", ultimaActividad: new Date(Date.now() - 500000).toISOString(), conversaciones: 5 },
  { id: "u-8", nombre: "David Kim", email: "david@ejemplo.com", rol: "Agent", estado: "Inactivo", ultimaActividad: new Date(Date.now() - 86400000 * 10).toISOString(), conversaciones: 0 }
];

export const MOCK_ACTIVITY_EVENTS = [
  ...Array(20).fill(0).map((_, i) => ({
    id: `evt-${i+1}`,
    evento: ['Agente respondió conversación', 'Agente solicitó traspaso humano', 'Fuente consultada', 'Baja confianza detectada', 'Conversación resuelta por IA', 'Humano tomó control'][i % 6],
    agente: ['Agente de Soporte', 'Agente de Ventas', 'Agente de Onboarding'][i % 3],
    canal: ['WhatsApp', 'Instagram', 'Web Chat'][i % 3],
    contacto: MOCK_CONTACTS[i%20].nombreCompleto,
    fuenteUsada: i % 2 === 0 ? MOCK_SOURCES[i%12].nombre : '-',
    estado: i % 5 === 0 ? "Revisión necesaria" : "Registrado",
    hora: new Date(Date.now() - 3600000 * i).toISOString(),
    detallesCarga: "Datos capturados sobre el evento."
  }))
];

export const MOCK_HANDOFF_RULES = [
  { id: "r-1", nombre: "Usuario pide hablar con una persona", descripción: "Detecta intención explícita de hablar con humano.", canales: ["Todos"], agentes: ["Todos"], estado: "Activo", ultimaActivacion: new Date().toISOString(), prioridad: "Alta" },
  { id: "r-2", nombre: "La IA tiene baja confianza", descripción: "Confianza de IA por debajo del umbral configurado.", canales: ["Todos"], agentes: ["Todos"], estado: "Activo", ultimaActivacion: new Date(Date.now() - 3600000).toISOString(), prioridad: "Alta" },
  { id: "r-3", nombre: "El usuario expresa frustración", descripción: "Análisis de sentimiento detecta enojo o frustración.", canales: ["WhatsApp", "Instagram"], agentes: ["Agente de Soporte"], estado: "Activo", ultimaActivacion: new Date(Date.now() - 86400000).toISOString(), prioridad: "Media" },
  { id: "r-4", nombre: "El usuario solicita descuento o excepción", descripción: "Usuario menciona descuentos, rebajas, precios especiales.", canales: ["Web Chat"], agentes: ["Agente de Ventas"], estado: "Activo", ultimaActivacion: new Date(Date.now() - 86400000*2).toISOString(), prioridad: "Media" },
  { id: "r-5", nombre: "Fuera de la base de conocimiento", descripción: "Preguntas sin información disponible en KB activa.", canales: ["Todos"], agentes: ["Todos"], estado: "Activo", ultimaActivacion: new Date().toISOString(), prioridad: "Alta" },
  { id: "r-6", nombre: "Usuario comparte información sensible", descripción: "Detecta tarjetas, contraseñas, SSN.", canales: ["Web Chat"], agentes: ["Todos"], estado: "Activo", ultimaActivacion: new Date(Date.now() - 3600000*5).toISOString(), prioridad: "Alta" },
  { id: "r-7", nombre: "Conversación lleva más de 3 intentos", descripción: "Loops detectados en la misma intención.", canales: ["Todos"], agentes: ["Agente de Soporte"], estado: "Activo", ultimaActivacion: new Date(Date.now() - 86400000).toISOString(), prioridad: "Media" },
  { id: "r-8", nombre: "Usuario reporta un error crítico", descripción: "Menciona caída del sistema, error 500.", canales: ["Todos"], agentes: ["Agente de Soporte"], estado: "Inactivo", ultimaActivacion: "-", prioridad: "Alta" },
  { id: "r-9", nombre: "Contacto tiene prioridad alta", descripción: "El usuario tiene tag VIP.", canales: ["Todos"], agentes: ["Todos"], estado: "Activo", ultimaActivacion: new Date().toISOString(), prioridad: "Alta" },
  { id: "r-10", nombre: "Intención detectada es queja", descripción: "El usuario reporta insatisfacción con el servicio.", canales: ["Todos"], agentes: ["Todos"], estado: "Inactivo", ultimaActivacion: "-", prioridad: "Baja" }
];

export const MOCK_ROUTING_RULES = [
  { id: "rr-1", condicion: "WhatsApp + Precios", destino: "Agente de Ventas", prioridad: "Media", estado: "Activo" },
  { id: "rr-2", condicion: "Web Chat + Soporte", destino: "Agente de Soporte", prioridad: "Alta", estado: "Activo" },
  { id: "rr-3", condicion: "Instagram + Demo", destino: "Agente de Ventas", prioridad: "Media", estado: "Activo" },
  { id: "rr-4", condicion: "Intención: Onboarding", destino: "Agente de Onboarding", prioridad: "Baja", estado: "Inactivo" },
  { id: "rr-5", condicion: "Alta Prioridad", destino: "Laura Gómez", prioridad: "Alta", estado: "Activo" },
  { id: "rr-6", condicion: "Baja Confianza IA", destino: "Cola Humana", prioridad: "Alta", estado: "Activo" }
];

export const MOCK_CHANNEL_METRICS = {
  conversacionesHoy: 446,
  nuevasConversaciones: 32,
  tiempoPrimeraRespuesta: "1m 12s",
  gestionadasIA: "84%",
  traspasosHumano: "16%",
  tasaResolucion: "92%"
};
