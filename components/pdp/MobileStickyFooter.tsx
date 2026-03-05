"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Product {
  id: string;
  title: string;
}

interface MobileStickyFooterProps {
  product: Product;
  onPurchase: () => void;
  isPurchasing?: boolean;
}

export function MobileStickyFooter({ onPurchase, isPurchasing = false }: MobileStickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40 lg:hidden">
      <Button
        onClick={onPurchase}
        disabled={isPurchasing}
        size="lg"
        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-4 rounded-xl font-medium text-base transition-all duration-200 border-0"
      >
        {isPurchasing ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Download className="w-5 h-5 mr-2" />
        )}
        {isPurchasing ? 'Processing...' : 'Buy Now'}
      </Button>
    </div>
  );
}
