import { MessageCircle, Video } from "lucide-react";
import { buildWhatsAppChatLink, buildVideoConsultLink } from "@/lib/brand";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href={buildVideoConsultLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Book video consultation on WhatsApp"
        className="group flex items-center gap-2 bg-primary text-primary-foreground pl-4 pr-5 py-3 rounded-full shadow-elegant hover:shadow-gold transition-smooth hover:scale-105"
      >
        <Video size={20} />
        <span className="text-sm font-medium hidden sm:inline">Video Consult</span>
      </a>
      <a
        href={buildWhatsAppChatLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-elegant hover:opacity-90 transition-smooth hover:scale-105"
      >
        <MessageCircle size={22} />
        <span className="text-sm font-medium hidden sm:inline">Chat with us</span>
      </a>
    </div>
  );
}
