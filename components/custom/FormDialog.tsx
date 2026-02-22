"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PremiumLoader } from "@/components/ui/premium-loader";
import {
  X,
  FileText,
  Image,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface FormDialogProps {
	type: "post" | "featured" | "category" | "subcategory" | "product-type";
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	triggerLabel?: string | null;
	initialData?: Record<string, unknown> & { 
		id?: string | number; 
		title?: string; 
		description?: string; 
		descripition?: string;
		categoryId?: string;
		subcategoryId?: string;
		productTypeId?: string;
		price?: number | string;
		compareAtPrice?: number | string;
		isDigital?: boolean;
		name?: string;
		slug?: string;
		parentId?: string;
		images?: Array<{
			publicId?: string;
			imageUrl?: string;
			isCover?: boolean;
		}>;
		digitalFiles?: Array<{
			publicId?: string;
			fileUrl?: string;
		}>;
	};
	onSubmit?: (data: FormData) => Promise<void>;
	onSave?: (data: { id?: string; formData: FormData }) => void;
	isLoading?: boolean;
	parentId?: string; // For creating child categories
}

interface Category {
  id: string;
  name: string;
  slug?: string;
  path?: string;
  children?: Category[];
}

interface ProductType {
  id: string;
  name: string;
}

type SlugStatus = "idle" | "checking" | "available" | "taken" | "error";

// Utility to generate a slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function FormDialog({
  type,
  open: controlledOpen,
  onOpenChange,
  triggerLabel,
  initialData,
  onSave,
  isLoading = false,
  parentId,
}: FormDialogProps) {
	console.log("FormDialog received parentId:", parentId, "for type:", type);
	const [open, setOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [productTypes, setProductTypes] = useState<ProductType[]>([]);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		categoryId: "",
		subcategoryId: "",
		productTypeId: "",
		price: "",
		compareAtPrice: "",
		isDigital: false,
		name: "",
		slug: "",
	});
	const [files, setFiles] = useState<(File | { url: string; name: string; publicId: string; isExisting: boolean })[]>([]);
	const [digitalFiles, setDigitalFiles] = useState<(File | { url: string; name: string; publicId: string; isExisting: boolean })[]>([]);
	const [coverImageIndex, setCoverImageIndex] = useState<number>(0);

  // Slug checker state
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [slugMessage, setSlugMessage] = useState("");
  const [previewSlug, setPreviewSlug] = useState("");
  // Whether the user has manually edited the slug (stops auto-generation from overwriting)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Fetch categories and product types
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, productTypesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/product-types"),
        ]);
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
        if (productTypesRes.ok) setProductTypes(await productTypesRes.json());
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    }
    if (type === "post" || type === "subcategory") fetchData();
  }, [type]);

  // Auto-generate slug from title when the user hasn't manually edited the slug field
  useEffect(() => {
    if (type !== "post" || slugManuallyEdited) return;
    const generated = generateSlug(formData.title);
    setPreviewSlug(generated);
    setFormData((prev) => ({ ...prev, slug: generated }));
    setSlugStatus("idle");
    setSlugMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.title, type]);

  // When the user manually edits the slug input, keep previewSlug in sync
  useEffect(() => {
    if (type !== "post" || !slugManuallyEdited) return;
    setPreviewSlug(formData.slug);
    setSlugStatus("idle");
    setSlugMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.slug]);

	// Initialize form with initial data
	useEffect(() => {
		if (initialData) {
			setFormData({
				title: initialData.title || "",
				description: initialData.description || initialData.descripition || "",
				categoryId: initialData.categoryId || "",
				subcategoryId: initialData.subcategoryId || "",
				productTypeId: initialData.productTypeId || "",
				price: initialData.price?.toString() || "",
				compareAtPrice: initialData.compareAtPrice?.toString() || "",
				isDigital: initialData.isDigital || false,
				name: initialData.name || "",
				slug: initialData.slug || "",
			});
		} else {
			// Reset form for new item
			setFormData({
				title: "",
				description: "",
				categoryId: "",
				subcategoryId: "",
				productTypeId: "",
				price: "",
				compareAtPrice: "",
				isDigital: false,
				name: "",
				slug: "",
			});
			setFiles([]);
			setDigitalFiles([]);
		}
	}, [initialData]);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? onOpenChange! : setOpen;

  // Check slug availability against the backend
  const checkSlugAvailability = useCallback(async () => {
    const slug = previewSlug;
    if (!slug) return;

    setSlugStatus("checking");
    setSlugMessage("");

    try {
      const params = new URLSearchParams({ slug });
      // If editing, pass the current id so the backend can exclude it
      if (initialData?.id) params.set("excludeId", initialData.id.toString());

      const res = await fetch(`/api/check-slug?${params.toString()}`);
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      if (data.available) {
        setSlugStatus("available");
        setSlugMessage("This slug is available.");
      } else {
        setSlugStatus("taken");
        setSlugMessage(data.message || "This slug is already in use.");
      }
    } catch {
      setSlugStatus("error");
      setSlugMessage("Could not check slug availability. Try again.");
    }
  }, [previewSlug, initialData?.id]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const submitData = new FormData();
		
		// Add form fields
		if (type === "post" || type === "featured") {
			submitData.append("title", formData.title);
			submitData.append("description", formData.description);
			if (type === "post") {
				if (formData.slug) {
					submitData.append("slug", formData.slug);
				}
				submitData.append("categoryId", formData.categoryId);
				if (formData.subcategoryId) {
					submitData.append("subcategoryId", formData.subcategoryId);
				}
				if (formData.productTypeId) {
					submitData.append("productTypeId", formData.productTypeId);
				}
				if (formData.price) {
					submitData.append("price", formData.price);
				}
				submitData.append("isDigital", formData.isDigital.toString());
			}
		} else if (type === "category" || type === "subcategory" || type === "product-type") {
			submitData.append("name", formData.name);
			if (type === "subcategory") {
				submitData.append("categoryId", formData.categoryId);
			} else if (type === "category" && parentId) {
				console.log("Adding parentId to form data:", parentId);
				submitData.append("parentId", parentId);
			}
		}

		// Add files
		files.forEach((file) => {
			// Only add actual File objects, not existing file objects
			if (file instanceof File) {
				submitData.append("files", file);
			}
		});

		// Add cover image index for multiple images
		if (files.length > 0) {
			submitData.append("coverImageIndex", coverImageIndex.toString());
		}

		// Add digital files for digital products
		if (formData.isDigital && digitalFiles.length > 0) {
			digitalFiles.forEach((file) => {
				// Only add actual File objects, not existing file objects
				if (file instanceof File) {
					submitData.append("digitalFiles", file);
				}
			});
		}

		// Add ID for updates
		if (initialData?.id) {
			submitData.append("id", initialData.id.toString());
		}

		await onSave?.({ 
			id: initialData?.id?.toString(),
			formData: submitData 
		});
		
		if (!initialData) {
			// Reset form only for new items
			setFormData({
				title: "",
				description: "",
				categoryId: "",
				subcategoryId: "",
				productTypeId: "",
				price: "",
				compareAtPrice: "",
				isDigital: false,
				name: "",
				slug: "",
			});
			setFiles([]);
			setDigitalFiles([]);
		}
		setIsOpen(false);
	};

  const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
  const MAX_DIGITAL_FILE_SIZE = 100 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > MAX_IMAGE_SIZE,
    );
    if (oversizedFiles.length > 0) {
      alert(
        `The following image files exceed 4MB limit:\n${oversizedFiles.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join("\n")}`,
      );
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDigitalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > MAX_DIGITAL_FILE_SIZE,
    );
    if (oversizedFiles.length > 0) {
      alert(
        `The following digital files exceed 100MB limit:\n${oversizedFiles.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join("\n")}`,
      );
      return;
    }
    setDigitalFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));
  const removeDigitalFile = (index: number) =>
    setDigitalFiles((prev) => prev.filter((_, i) => i !== index));

  const flattenCategories = (
    cats: Category[],
    depth = 0,
  ): { id: string; name: string; depth: number }[] => {
    return cats.flatMap((cat) => [
      { id: cat.id, name: cat.name, depth },
      ...(cat.children?.length
        ? flattenCategories(cat.children, depth + 1)
        : []),
    ]);
  };

  const flatCategories = flattenCategories(categories);

   const SlugStatusIndicator = () => {
    if (slugStatus === "idle") return null;

    const config = {
      checking: {
        icon: <Loader2 className="w-4 h-4 animate-spin text-blue-500" />,
        textColor: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200",
      },
      available: {
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50 border-emerald-200",
      },
      taken: {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
        textColor: "text-red-700",
        bgColor: "bg-red-50 border-red-200",
      },
      error: {
        icon: <XCircle className="w-4 h-4 text-amber-500" />,
        textColor: "text-amber-700",
        bgColor: "bg-amber-50 border-amber-200",
      },
    }[slugStatus];

    return (
      <div
        className={`flex items-center gap-2 mt-2 px-3 py-2 rounded-md border text-sm ${config.bgColor}`}
      >
        {config.icon}
        <span className={config.textColor}>{slugMessage}</span>
      </div>
    );
  };

  const SlugField = () => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor="slug">Slug</Label>
        {!slugManuallyEdited && formData.title && (
          <span className="text-xs text-gray-400 italic">
            auto-generated from title
          </span>
        )}
        {slugManuallyEdited && (
          <button
            type="button"
            onClick={() => {
              setSlugManuallyEdited(false);
              const generated = generateSlug(formData.title);
              setPreviewSlug(generated);
              setFormData((prev) => ({ ...prev, slug: generated }));
              setSlugStatus("idle");
              setSlugMessage("");
            }}
            className="mt-1 text-xs text-blue-500 hover:text-blue-700 underline"
          >
            Reset to auto-generated
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => {
            setSlugManuallyEdited(true);
            setFormData((prev) => ({ ...prev, slug: e.target.value }));
          }}
          placeholder="your-product-slug"
          className="flex-1 font-mono text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!previewSlug || slugStatus === "checking"}
          onClick={checkSlugAvailability}
          className="shrink-0 gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Check if this slug is available"
        >
          {slugStatus === "checking" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Check
        </Button>
      </div>

      <SlugStatusIndicator />
    </div>
  );


	const renderForm = () => {
		switch (type) {
			case "post":
				return (
					<div className="space-y-4">
						<div>
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
								placeholder="Enter product title"
								required
							/>
						</div>

            {/* Slug field with availability checker */}
            <SlugField />

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter product description"
                rows={4}
                required
								className="w-full resize-none"
              />
            </div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="category">Category *</Label>
								<p className="text-xs text-neutral-500">Select any category (including nested ones)</p>
								<Select value={formData.categoryId} onValueChange={(value: string) => setFormData(prev => ({ ...prev, categoryId: value, subcategoryId: "" }))}>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{flatCategories.length > 0 ? (
											flatCategories.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													<span style={{ paddingLeft: `${category.depth * 16}px` }}>
														{category.depth > 0 && <span className="text-neutral-400 mr-2">↳</span>}
														{category.name}
													</span>
												</SelectItem>
											))
										) : (
											<div className="px-2 py-1.5 text-sm text-neutral-500">
												No categories available
											</div>
										)}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="productType">Product Type (Optional)</Label>
								<Select value={formData.productTypeId} onValueChange={(value: string) => setFormData(prev => ({ ...prev, productTypeId: value }))}>
									<SelectTrigger>
										<SelectValue placeholder="Select product type" />
									</SelectTrigger>
									<SelectContent>
										{productTypes.map((productType) => (
											<SelectItem key={productType.id} value={productType.id}>
												{productType.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="price">Price ($)</Label>
								<Input
									id="price"
									type="number"
									step="0.01"
									min="0"
									value={formData.price}
									onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
									placeholder="0.00"
									className="w-full"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="compareAtPrice">M.R.P. / Scratch Price ($) - Optional</Label>
								<Input
									id="compareAtPrice"
									type="number"
									step="0.01"
									min="0"
									value={formData.compareAtPrice}
									onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
									placeholder="459.00 (higher than actual price)"
									className="w-full"
								/>
								<p className="text-xs text-gray-500">
									Shows as strikethrough price to highlight discount
								</p>
							</div>

							<div className="space-y-2">
								<Label className="flex items-center space-x-2">
									<input
										type="checkbox"
										checked={formData.isDigital}
										onChange={(e) => setFormData(prev => ({ ...prev, isDigital: e.target.checked }))}
										className="rounded border-gray-300 w-4 h-4"
									/>
									<span>Digital Product</span>
								</Label>
								<p className="text-xs text-gray-500">
									{formData.isDigital 
										? "Upload a cover image for display and digital files for download"
										: "Upload product images for display"
									}
								</p>
							</div>
						</div>

						
						{/* Product Images Section - For both physical and digital products */}
						<div>
							<Label>Product Images</Label>
							<p className="text-xs text-gray-500 mt-1">
								Upload multiple images. Select one as cover image for product cards.
							</p>
							<div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
								<input
									type="file"
									multiple
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
									id="file-upload"
								/>
								<label
									htmlFor="file-upload"
									className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
								>
									<Image className="w-8 h-8 text-gray-400 mb-2" aria-label="Upload product images" />
									<span className="text-sm text-gray-600">Click to upload images</span>
									<span className="text-xs text-gray-500">PNG, JPG, GIF - Max 4MB each (Vercel free tier)</span>
								</label>
							</div>
							{files.length > 0 && (
								<div className="mt-4 space-y-3">
									<div className="text-sm font-medium text-gray-700">Select Cover Image:</div>
									{files.map((file, index) => (
										<div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
											<input
												type="radio"
												name="coverImage"
												checked={coverImageIndex === index}
												onChange={() => setCoverImageIndex(index)}
												className="w-4 h-4 text-blue-600 flex-shrink-0"
											/>
											<div className="flex-1 flex items-center space-x-3 min-w-0">
												{/* Image preview */}
												{file && 'url' in file ? (
													<img 
														src={file.url} 
														alt={file.name}
														className="w-12 h-12 object-cover rounded flex-shrink-0"
													/>
												) : (
													<div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
														<Image className="w-6 h-6 text-gray-400" />
													</div>
												)}
												<div className="flex-1 min-w-0">
													<span className="text-sm truncate block">{file.name}</span>
													<div className="flex items-center space-x-2 mt-1">
														{file && 'isExisting' in file && file.isExisting && (
															<span className="text-xs text-gray-500">(Existing)</span>
														)}
														{coverImageIndex === index && (
															<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Cover</span>
														)}
													</div>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => {
													removeFile(index);
													if (coverImageIndex >= files.length - 1) {
														setCoverImageIndex(Math.max(0, files.length - 2));
													}
												}}
												className="flex-shrink-0"
											>
												<X className="w-4 h-4" />
											</Button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Digital Files Section - Only for digital products */}
						{formData.isDigital && (
							<div>
								<Label>Digital Files</Label>
								<div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
									<input
										type="file"
										multiple
										accept=".pdf,.doc,.docx,.txt,.zip,.rar"
										onChange={handleDigitalFileChange}
										className="hidden"
										id="digital-file-upload"
									/>
									<label
										htmlFor="digital-file-upload"
										className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
									>
										<FileText className="w-8 h-8 text-gray-400 mb-2" />
										<span className="text-sm text-gray-600">Click to upload digital files</span>
										<span className="text-xs text-gray-500">PDF, DOCX, TXT, ZIP - Max 100MB each</span>
									</label>
								</div>
								{digitalFiles.length > 0 && (
									<div className="mt-2 space-y-2">
										{digitalFiles.map((file, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
												<div className="flex items-center space-x-3 flex-1 min-w-0">
													{/* File icon */}
													<FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
													<div className="flex-1 min-w-0">
														<span className="text-sm truncate block">{file.name}</span>
														{file && 'isExisting' in file && file.isExisting && (
															<span className="text-xs text-gray-500">(Existing)</span>
														)}
													</div>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeDigitalFile(index)}
													className="flex-shrink-0"
												>
													<X className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				);

      case "featured":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter featured item title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter featured item description"
                rows={3}
                required
              />
            </div>
            <div>
              <Label>Featured Image</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="featured-file-upload"
                />
                <label
                  htmlFor="featured-file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                >
                  <Image
                    className="w-8 h-8 text-gray-400 mb-2"
                    aria-label="Upload featured image"
                  />
                  <span className="text-sm text-gray-600">
                    Click to upload image
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 4MB
                  </span>
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "category":
      case "product-type":
        return (
          <div className="space-y-4">
            {type === "category" && parentId && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  ✓ Creating as a child category
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This category will be nested under its parent
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="name">
                {type === "category" ? "Category Name" : "Product Type Name"}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={`Enter ${type === "category" ? "category" : "product type"} name`}
                required
              />
            </div>
          </div>
        );

      case "subcategory":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Subcategory Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter subcategory name"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Parent Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, categoryId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

	
	if (triggerLabel === null) {
		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="bg-white dark:bg-gray-800 dark:text-white max-w-5xl max-h-[90vh] p-0 rounded-lg shadow-2xl flex flex-col">
					<DialogHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800 flex-shrink-0">
						<DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
							{initialData ? `Edit ${type}` : `Create New ${type}`}
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="flex flex-col flex-1">
						<div className="overflow-y-auto px-6 py-4 flex-1" style={{ maxHeight: 'calc(90vh - 140px)' }}>
							{renderForm()}
						</div>
						<DialogFooter className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800 flex-shrink-0">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsOpen(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								className="bg-blue-600 hover:bg-blue-700 text-white"
							>
							{isLoading ? (
								<div className="flex items-center space-x-2">
									<PremiumLoader variant="apple" size="small" className="text-white" />
									<span>Submitting...</span>
								</div>
							) : (
								initialData ? "Update" : "Create"
							)}
						</Button>
					</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{triggerLabel && (
				<Button
					onClick={() => setIsOpen(true)}
					disabled={isLoading}
					className="bg-blue-600 hover:bg-blue-700 text-white"
				>
					{isLoading ? (
						<div className="flex items-center space-x-2">
							<PremiumLoader variant="apple" size="small" className="text-white" />
							<span>Submitting...</span>
						</div>
					) : (
						triggerLabel
					)}
				</Button>
			)}
			<DialogContent className="bg-white dark:bg-gray-800 dark:text-white max-w-5xl max-h-[90vh] p-0 rounded-lg shadow-2xl flex flex-col">
				<DialogHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800 flex-shrink-0">
					<DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
						{initialData ? `Edit ${type}` : `Create New ${type}`}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col flex-1">
					<div className="overflow-y-auto px-6 py-4 flex-1" style={{ maxHeight: 'calc(90vh - 140px)' }}>
						{renderForm()}
					</div>
					<DialogFooter className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800 flex-shrink-0">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
							className="bg-blue-600 hover:bg-blue-700 text-white"
						>
							{isLoading ? (
								<div className="flex items-center space-x-2">
									<PremiumLoader variant="apple" size="small" className="text-white" />
									<span>Submitting...</span>
								</div>
							) : (
								initialData ? "Update" : "Create"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
