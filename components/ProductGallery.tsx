"use client";

import React, { useState, useRef } from "react";
import { X, Star, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ProductGalleryProps {
  postId: string;
  images: Array<{
    id?: string;
    imageUrl?: string;
    publicId?: string;
    order?: number;
    isCover?: boolean;
  }>;
  onImagesChange: (updatedPost: {
    id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    publicId: string | null;
    price: number | null;
    compareAtPrice: number | null;
    isDigital: boolean;
    createdAt: string;
    updatedAt: string;
    categoryId: string;
    subcategoryId: string | null;
    productTypeId: string | null;
    images: Array<{
      id: string;
      imageUrl: string;
      publicId: string;
      order: number;
      isCover: boolean;
    }>;
  }) => void;
  disabled?: boolean;
  maxImages?: number;
}

export default function ProductGallery({
  postId,
  images,
  onImagesChange,
  disabled = false,
  maxImages = 10,
}: ProductGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [settingCover, setSettingCover] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    if (disabled || images.length >= maxImages) return;

    setUploading(true);
    const formData = new FormData();

    // Add all files
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(`/api/posts/${postId}/images/add`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload images");
      }

      const updatedPost = await response.json();
      onImagesChange(updatedPost);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (disabled || deleting) return;

    if (!confirm("Are you sure you want to delete this image?")) return;

    setDeleting(imageId);
    try {
      const response = await fetch(`/api/posts/${postId}/images?imageId=${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete image");
      }

      const updatedPost = await response.json();
      onImagesChange(updatedPost);
    } catch (error) {
      console.error("Delete error:", error);
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleSetCover = async (imageId: string) => {
    if (disabled || settingCover) return;

    setSettingCover(imageId);
    try {
      const response = await fetch(`/api/posts/${postId}/images`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId,
          action: "setCover",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to set cover image");
      }

      const updatedPost = await response.json();
      onImagesChange(updatedPost);
    } catch (error) {
      console.error("Set cover error:", error);
      alert(error instanceof Error ? error.message : "Failed to set cover");
    } finally {
      setSettingCover(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const sortedImages = [...images].sort((a, b) => (a.order || 0) - (b.order || 0));
  const coverImage = sortedImages.find(img => img.isCover);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!disabled && images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            disabled={uploading}
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">
            {uploading ? "Uploading..." : "Drop images here or click to upload"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {maxImages - images.length} slots remaining
          </p>
        </div>
      )}

      {/* Images Grid */}
      {sortedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedImages.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors"
            >
              {/* Image */}
              <Image
                src={image.imageUrl || ''}
                alt={`Product image ${(image.order || 0) + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {/* Cover Badge */}
              {image.isCover && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Cover
                </div>
              )}

              {/* Action Buttons */}
              {!disabled && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteImage(image.id || '')}
                      disabled={deleting === image.id}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete image"
                    >
                      {deleting === image.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>

                    {/* Set Cover Button */}
                    {!image.isCover && (
                      <button
                        onClick={() => handleSetCover(image.id || '')}
                        disabled={settingCover === image.id}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Set as cover"
                      >
                        {settingCover === image.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add More Button */}
          {!disabled && images.length < maxImages && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-gray-600"
            >
              <ImageIcon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Add Image</span>
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {sortedImages.length === 0 && !disabled && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium mb-2">No images yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Add images to showcase your product
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Image
          </button>
        </div>
      )}

      {/* Cover Image Info */}
      {coverImage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">
              Cover image: Image {(coverImage?.order || 0) + 1}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
