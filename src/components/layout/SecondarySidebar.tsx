import { MainSection } from "@/App";
import { cn } from "@/lib/utils";

const SECONDARY_MENUS: Record<MainSection, { title: string, groups: { label?: string, items: string[] }[] }> = {
  inbox: {
    title: "Inbox",
    groups: [
      { items: ["Tu bandeja", "Todas", "Sin asignar", "Gestionadas por IA", "Necesitan humano", "Pendientes", "Resueltas", "Spam"] },
      { label: "Agentes", items: ["Agente de soporte", "Agente de ventas", "Agente de onboarding"] }
    ]
  },
  contacts: {
    title: "Contactos",
    groups: [
      { items: ["Todos los contactos", "Leads nuevos", "Calificados", "Clientes", "Sin propietario", "Archivados"] },
      { label: "Filtros rápidos", items: ["WhatsApp", "Instagram", "Web Chat", "Necesitan humano", "Gestionados por IA"] }
    ]
  },
  ai: {
    title: "AI Center",
    groups: [
      { items: ["Agentes", "Base de conocimiento", "Playground", "Actividad", "Reglas de traspaso", "Configuración IA"] }
    ]
  },
  channels: {
    title: "Canales",
    groups: [
      { items: ["Métricas", "WhatsApp", "Instagram", "Web Chat", "Asignación automática", "Estado de conexión"] }
    ]
  },
  settings: {
    title: "Configuración",
    groups: [
      { items: ["Mi Perfil", "Equipo", "Facturación", "Integraciones", "Notificaciones"] }
    ]
  }
};

export function SecondarySidebar({ section, activeTab, setActiveTab }: { section: MainSection, activeTab: string, setActiveTab: (t: string) => void }) {
  const menu = SECONDARY_MENUS[section];

  return (
    <div className="flex w-64 flex-col border-r bg-muted/10">
      <div className="flex h-14 items-center px-4 font-semibold tracking-tight border-b border-transparent">
        {menu.title}
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {menu.groups.map((group, idx) => (
          <div key={idx} className="mb-4">
            {group.label && (
              <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.label}
              </div>
            )}
            <div className="flex flex-col space-y-0.5">
              {group.items.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                    activeTab === item
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <span className="truncate">{item}</span>
                  {activeTab === item && (section === 'inbox' && ["Tu bandeja", "Todas"].includes(item)) && (
                    <span className="text-xs font-medium text-muted-foreground">12</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
