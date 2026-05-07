import React, { useState } from "react";
import { ConversationList } from "./ConversationList";
import { ConversationThread } from "./ConversationThread";
import { ContactContextPanel } from "./ContactContextPanel";
import { MOCK_CONVERSATIONS, MOCK_CONTACTS } from "@/data/mockData";

export function InboxView({ secondaryTab }: { secondaryTab: string }) {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversations[0]?.id || null);

  React.useEffect(() => {
    const handleNavigation = (e: CustomEvent) => {
      if (e.detail && typeof e.detail === 'string') {
        setSelectedConvId(e.detail);
      }
    };
    window.addEventListener("navigate-inbox" as any, handleNavigation);
    return () => window.removeEventListener("navigate-inbox" as any, handleNavigation);
  }, []);

  const selectedConv = conversations.find((c) => c.id === selectedConvId);
  const selectedContact = selectedConv 
    ? MOCK_CONTACTS.find((c) => c.id === selectedConv.contactoId) 
    : null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <ConversationList
        conversations={conversations}
        selectedConvId={selectedConvId}
        onSelectConv={setSelectedConvId}
        secondaryTab={secondaryTab}
      />
      {selectedConv && selectedContact ? (
        <>
          <ConversationThread 
            conversation={selectedConv} 
            contact={selectedContact}
            setConversations={setConversations}
          />
          <ContactContextPanel 
            conversation={selectedConv} 
            contact={selectedContact} 
          />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          Selecciona una conversación para comenzar
        </div>
      )}
    </div>
  );
}
