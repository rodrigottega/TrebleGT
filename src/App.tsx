import * as React from "react"
import { Toaster } from "./components/ui/toaster"
import { IconSidebar } from "./components/layout/IconSidebar"
import { SecondarySidebar } from "./components/layout/SecondarySidebar"
import { InboxView } from "./components/inbox/InboxView"
import { ContactsView } from "./components/contacts/ContactsView"
import { AICenterView } from "./components/ai/AICenterView"
import { ChannelsView } from "./components/channels/ChannelsView"
import { SettingsView } from "./components/settings/SettingsView"

export type MainSection = "inbox" | "channels" | "contacts" | "ai" | "settings";

export default function App() {
  const [activeSection, setActiveSection] = React.useState<MainSection>("inbox")
  const [activeSecondaryTab, setActiveSecondaryTab] = React.useState<string>("Tu bandeja")

  // Reset secondary tab when section changes
  React.useEffect(() => {
    switch (activeSection) {
      case "inbox": setActiveSecondaryTab("Tu bandeja"); break;
      case "channels": setActiveSecondaryTab("Métricas"); break;
      case "contacts": setActiveSecondaryTab("Todos los contactos"); break;
      case "ai": setActiveSecondaryTab("Agentes"); break;
      case "settings": setActiveSecondaryTab("Mi Perfil"); break;
    }
  }, [activeSection])

  React.useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      setActiveSection("inbox");
      // Optionally we could pass the ID to InboxView if needed, currently we just navigate.
    };
    window.addEventListener("navigate-inbox" as any, handleNavigate);
    return () => window.removeEventListener("navigate-inbox" as any, handleNavigate);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <IconSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <SecondarySidebar 
        section={activeSection} 
        activeTab={activeSecondaryTab} 
        setActiveTab={setActiveSecondaryTab} 
      />
      <main className="flex-1 flex flex-col min-w-0 border-l border-border bg-background">
        {activeSection === "inbox" && <InboxView secondaryTab={activeSecondaryTab} />}
        {activeSection === "channels" && <ChannelsView secondaryTab={activeSecondaryTab} />}
        {activeSection === "contacts" && <ContactsView secondaryTab={activeSecondaryTab} />}
        {activeSection === "ai" && <AICenterView secondaryTab={activeSecondaryTab} />}
        {activeSection === "settings" && <SettingsView secondaryTab={activeSecondaryTab} />}
      </main>
      <Toaster />
    </div>
  );
}

