"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  level: number;
  path: string;
  parentId: string | null;
  children: Category[];
  _count?: {
    posts: number;
  };
}

interface NestedCategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onCreateChild: (parentId: string) => void;
  level?: number;
}

export function NestedCategoryList({ 
  categories, 
  onEdit, 
  onDelete, 
  onCreateChild,
  level = 0 
}: NestedCategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategory = (category: Category) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const indent = level * 24;

    return (
      <div key={category.id} className="w-full">
        <div 
          className="flex items-center gap-2 p-3 border-b border-gray-100 hover:bg-blue-50/40 transition-colors group"
          style={{ paddingLeft: `${indent + 12}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpand(category.id)}
              className="p-1 h-6 w-6"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          )}
          
          {/* Category Name with Level Indicator */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">
                {category.name}
              </span>
              {level > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Level {level}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {category.path}
            </div>
          </div>

          {/* Posts Count */}
          <div className="text-sm text-gray-600 min-w-[80px] text-center">
            {category._count?.posts || 0} posts
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCreateChild(category.id)}
              className="p-2 h-8 w-8 hover:bg-blue-100"
              title="Create child category"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              className="p-2 h-8 w-8 hover:bg-blue-100"
              title="Edit category"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category.id)}
              className="p-2 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="bg-gray-50/30">
            <NestedCategoryList
              categories={category.children}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreateChild={onCreateChild}
              level={level + 1}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {categories.map(renderCategory)}
    </div>
  );
}
