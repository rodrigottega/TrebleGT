import { MainSection } from "@/App";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { id: MainSection; icon: string; label: string }[] = [
  { id: "inbox", icon: "ri-inbox-line", label: "Inbox" },
  { id: "channels", icon: "ri-chat-1-line", label: "Canales" },
  { id: "contacts", icon: "ri-contacts-book-2-line", label: "Contactos" },
  { id: "ai", icon: "ri-robot-2-line", label: "AI Center" },
];

export function IconSidebar({ activeSection, setActiveSection }: { activeSection: MainSection, setActiveSection: (s: MainSection) => void }) {
  return (
    <div className="flex w-16 flex-col items-center justify-between border-r bg-muted/30 py-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold tracking-tighter shadow-sm">
          ciarem.ai
        </div>
        <div className="flex flex-col items-center space-y-2 w-full px-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                activeSection === item.id 
                  ? "bg-accent text-accent-foreground shadow-sm ring-1 ring-border" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <i className={cn(item.icon, "text-xl")}></i>
              <div className="absolute left-14 hidden rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block z-50 whitespace-nowrap">
                {item.label}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2 w-full px-2">
        <button
            onClick={() => setActiveSection("settings")}
            className={cn(
              "group relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
              activeSection === "settings" 
                ? "bg-accent text-accent-foreground shadow-sm ring-1 ring-border" 
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <i className="ri-settings-3-line text-xl"></i>
            <div className="absolute left-14 hidden rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block z-50 whitespace-nowrap">
              Configuración
            </div>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-border text-muted-foreground mt-2 overflow-hidden border">
             <i className="ri-user-line"></i>
          </button>
      </div>
    </div>
  );
}
