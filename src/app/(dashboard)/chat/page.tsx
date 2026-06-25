import { ChatUI } from "@/components/chat/chat-ui";

export default function ChatPage() {
  return (
    <div data-accent="chat" className="h-full flex items-start justify-center pt-8">
      <div className="w-full max-w-2xl h-full flex flex-col">
        <ChatUI />
      </div>
    </div>
  );
}
