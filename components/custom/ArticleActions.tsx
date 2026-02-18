"use client";

import { Button } from "@/components/ui/button";
import { Share2, Heart, Bookmark } from "lucide-react";

export function ArticleActions() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleLike = () => {
    // TODO: Implement like functionality
    alert('Like functionality coming soon!');
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    alert('Save functionality coming soon!');
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={handleLike}>
        <Heart className="h-4 w-4 mr-2" />
        Like
      </Button>
      <Button variant="outline" size="sm" onClick={handleSave}>
        <Bookmark className="h-4 w-4 mr-2" />
        Save
      </Button>
    </div>
  );
}
