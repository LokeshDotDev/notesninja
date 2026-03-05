"use client";
import { MessageCircle } from "lucide-react";

export function MobileWhatsAppChat() {
  const phoneNumber = "916378990158"; // Your WhatsApp number
  const defaultMessage = "Hi! I'm interested in your study materials.";

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="p-2 rounded-xl text-[rgb(28, 28, 30)] dark:text-white hover:bg-[rgb(248, 248, 248)] dark:hover:bg-neutral-800 transition-all duration-200"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 text-green-500" />
    </button>
  );
}
