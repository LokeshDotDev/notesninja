"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
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
import { X, FileText, Image } from "lucide-react";

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
		parentId?: string;
	};
	onSave: (data: { id?: string; formData: FormData }) => void;
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
	});
	const [files, setFiles] = useState<File[]>([]);
	const [digitalFiles, setDigitalFiles] = useState<File[]>([]);

	// Fetch categories, subcategories, and product types
	useEffect(() => {
		async function fetchData() {
			try {
				const [categoriesRes, productTypesRes] = await Promise.all([
					fetch("/api/categories"),
					fetch("/api/product-types"),
				]);

				if (categoriesRes.ok) {
					const categoriesData = await categoriesRes.json();
					setCategories(categoriesData);
				}
				if (productTypesRes.ok) {
					const productTypesData = await productTypesRes.json();
					setProductTypes(productTypesData);
				}
			} catch (error) {
				console.error("Error fetching form data:", error);
			}
		}

		if (type === "post" || type === "subcategory") {
			fetchData();
		}
	}, [type]);

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
			});
			setFiles([]);
			setDigitalFiles([]);
		}
	}, [initialData]);

	const isControlled = controlledOpen !== undefined;
	const isOpen = isControlled ? controlledOpen : open;
	const setIsOpen = isControlled ? onOpenChange! : setOpen;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const submitData = new FormData();
		
		// Add form fields
		if (type === "post" || type === "featured") {
			submitData.append("title", formData.title);
			submitData.append("description", formData.description);
			if (type === "post") {
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
		files.forEach((file: File) => {
			submitData.append("files", file);
		});

		// Add digital files for digital products
		if (formData.isDigital && digitalFiles.length > 0) {
			digitalFiles.forEach((file: File) => {
				submitData.append("digitalFiles", file);
			});
		}

		// Add ID for updates
		if (initialData?.id) {
			submitData.append("id", initialData.id.toString());
		}

		await onSave({ 
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
			});
			setFiles([]);
			setDigitalFiles([]);
		}
		setIsOpen(false);
	};

	const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB (Vercel free tier limit)
	const MAX_DIGITAL_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Vercel free tier limit)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		
		// Validate file sizes
		const oversizedFiles = selectedFiles.filter(file => file.size > MAX_IMAGE_SIZE);
		if (oversizedFiles.length > 0) {
			alert(`The following image files exceed 4MB limit (Vercel free tier):\n${oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join('\n')}`);
			return;
		}
		
		setFiles(prev => [...prev, ...selectedFiles]);
	};

	const handleDigitalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		
		// Validate file sizes
		const oversizedFiles = selectedFiles.filter(file => file.size > MAX_DIGITAL_FILE_SIZE);
		if (oversizedFiles.length > 0) {
			alert(`The following digital files exceed 4MB limit (Vercel free tier):\n${oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join('\n')}\n\nNote: Upgrade to Vercel Pro for larger files.`);
			return;
		}
		
		setDigitalFiles(prev => [...prev, ...selectedFiles]);
	};

	const removeFile = (index: number) => {
		setFiles(prev => prev.filter((_, i) => i !== index));
	};

	const removeDigitalFile = (index: number) => {
		setDigitalFiles(prev => prev.filter((_, i) => i !== index));
	};

	// Helper function to flatten nested categories for selection with visual hierarchy
	const flattenCategories = (cats: Category[], depth = 0): { id: string; name: string; depth: number }[] => {
		return cats.flatMap((cat) => [
			{
				id: cat.id,
				name: cat.name,
				depth: depth
			},
			...(cat.children && cat.children.length > 0 
				? flattenCategories(cat.children, depth + 1)
				: [])
		]);
	};

	const flatCategories = flattenCategories(categories);

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
						
						<div>
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
								placeholder="Enter product description"
								rows={3}
								required
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="md:col-span-2">
								<Label htmlFor="category">Category *</Label>
								<p className="text-xs text-neutral-500 mb-2">Select any category (including nested ones)</p>
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
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

							<div>
								<Label htmlFor="price">Price ($)</Label>
								<Input
									id="price"
									type="number"
									step="0.01"
									min="0"
									value={formData.price}
									onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
									placeholder="0.00"
								/>
							</div>

							<div>
								<Label htmlFor="compareAtPrice">M.R.P. / Scratch Price ($) - Optional</Label>
								<Input
									id="compareAtPrice"
									type="number"
									step="0.01"
									min="0"
									value={formData.compareAtPrice}
									onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
									placeholder="459.00 (higher than actual price)"
								/>
								<p className="text-xs text-gray-500 mt-1">
									Shows as strikethrough price to highlight discount
								</p>
							</div>
						</div>

						<div>
							<Label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={formData.isDigital}
									onChange={(e) => setFormData(prev => ({ ...prev, isDigital: e.target.checked }))}
									className="rounded border-gray-300"
								/>
								<span>Digital Product</span>
							</Label>
							<p className="text-xs text-gray-500 mt-1">
								{formData.isDigital 
									? "Upload a cover image for display and digital files for download"
									: "Upload product images for display"
								}
							</p>
						</div>

						{/* Cover Image Section - Always show for digital products */}
						{formData.isDigital && (
							<div>
								<Label>Cover Image</Label>
								<div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
									<input
										type="file"
										accept="image/*"
										onChange={handleFileChange}
										className="hidden"
										id="cover-image-upload"
									/>
									<label
										htmlFor="cover-image-upload"
										className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
									>
										<Image className="w-8 h-8 text-gray-400 mb-2" aria-label="Upload cover image" />
										<span className="text-sm text-gray-600">Click to upload cover image</span>
										<span className="text-xs text-gray-500">PNG, JPG, GIF up to 4MB (Vercel free tier)</span>
									</label>
								</div>
								{files.length > 0 && (
									<div className="mt-2 space-y-2">
										{files.map((file, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
						)}

						{/* Product Images Section - Only for physical products */}
						{!formData.isDigital && (
							<div>
								<Label>Product Images</Label>
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
									<div className="mt-2 space-y-2">
										{files.map((file, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
						)}

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
										<span className="text-xs text-gray-500">PDF, DOCX, TXT, ZIP - Max 4MB each (Vercel free tier)</span>
									</label>
								</div>
								{digitalFiles.length > 0 && (
									<div className="mt-2 space-y-2">
										{digitalFiles.map((file, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
												<span className="text-sm truncate">{file.name}</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeDigitalFile(index)}
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
								onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
								placeholder="Enter featured item title"
								required
							/>
						</div>
						
						<div>
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
									<Image className="w-8 h-8 text-gray-400 mb-2" aria-label="Upload featured image" />
									<span className="text-sm text-gray-600">Click to upload image</span>
									<span className="text-xs text-gray-500">PNG, JPG, GIF up to 4MB (Vercel free tier)</span>
								</label>
							</div>
							{files.length > 0 && (
								<div className="mt-2 space-y-2">
									{files.map((file, index) => (
										<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
								onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
								placeholder="Enter subcategory name"
								required
							/>
						</div>

						<div>
							<Label htmlFor="category">Parent Category</Label>
							<Select value={formData.categoryId} onValueChange={(value: string) => setFormData(prev => ({ ...prev, categoryId: value }))}>
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

	const dialogContent = (
		<div className="space-y-4">
			<form onSubmit={handleSubmit}>
				{renderForm()}
				<div className="flex justify-end space-x-2 pt-6">
					<Button
						type="button"
						variant="outline"
						onClick={() => setIsOpen(false)}
						disabled={isLoading}
						className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<span>Saving...</span>
							</div>
						) : (
							initialData ? "Update" : "Create"
						)}
					</Button>
				</div>
			</form>
		</div>
	);

	if (triggerLabel === null) {
		return dialogContent;
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
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							<span>Loading...</span>
						</div>
					) : (
						triggerLabel
					)}
				</Button>
			)}
			<DialogContent className="bg-white dark:bg-gray-800 dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						{initialData ? `Edit ${type}` : `Create New ${type}`}
					</DialogTitle>
				</DialogHeader>
				{dialogContent}
			</DialogContent>
		</Dialog>
	);
}