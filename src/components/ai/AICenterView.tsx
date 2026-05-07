import React from "react";
import { AgentsView } from "./AgentsView";
import { PlaygroundView } from "./PlaygroundView";
import { KnowledgeBasesManager } from "./KnowledgeBasesManager";
import { ActivityView } from "./ActivityView";
import { HandoffRulesView } from "./HandoffRulesView";
import { AISettingsView } from "./AISettingsView";

export function AICenterView({ secondaryTab }: { secondaryTab: string }) {
  if (secondaryTab === "Playground") return <PlaygroundView />;
  if (secondaryTab === "Base de conocimiento") return <KnowledgeBasesManager />;
  if (secondaryTab === "Actividad") return <ActivityView />;
  if (secondaryTab === "Reglas de traspaso") return <HandoffRulesView />;
  if (secondaryTab === "Configuración IA") return <AISettingsView />;

  return <AgentsView />;
}
