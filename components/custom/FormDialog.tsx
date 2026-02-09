"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface FormDialogProps {
	type: "post" | "featured" | "category" | "subcategory" | "product-type";
	initialData?: {
		id?: string;
		title?: string;
		description?: string;
		descripition?: string; // Added for featured items
		name?: string;
		categoryId?: string;
		subcategoryId?: string;
		productTypeId?: string;
		imageUrl?: string; // Added for displaying existing images
	};
	onSave: (data: { id?: string; formData: FormData }) => Promise<void>;
	triggerLabel: string | null;
	categories?: { id: string; name: string }[];
	subcategories?: { id: string; name: string; categoryId: string }[];
	productTypes?: { id: string; name: string }[];
	onClose?: () => void;
	isLoading?: boolean;
}

export default function FormDialog({
	type,
	initialData,
	onSave,
	triggerLabel,
	categories = [],
	subcategories = [],
	productTypes = [],
	onClose,
	isLoading = false,
}: FormDialogProps) {
	const [open, setOpen] = useState(triggerLabel === null);
	const [title, setTitle] = useState(initialData?.title || "");
	const [description, setDescription] = useState(
		initialData?.descripition || initialData?.description || ""
	);
	const [productTypeId, setProductTypeId] = useState(initialData?.productTypeId || "");
	const [subcategoryId, setSubcategoryId] = useState(initialData?.subcategoryId || "");
	const [image, setImage] = useState<File | null>(null);
	const [images, setImages] = useState<File[]>([]);
	const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
	const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
	const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
		initialData?.imageUrl || null
	);
	const [categoryName, setCategoryName] = useState(initialData?.name || "");
	const [categoryId, setCategoryId] = useState(
		initialData?.categoryId || categories[0]?.id || ""
	);

	// Ensure default category is set when categories load
	useEffect(() => {
		if (!categoryId && categories.length > 0) {
			setCategoryId(categories[0].id);
		}
	}, [categories, categoryId]);

	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title || "");
			setDescription(initialData.descripition || initialData.description || "");
			setCategoryName(initialData.name || "");
			setCategoryId(initialData.categoryId || categories[0]?.id || "");
			setExistingImageUrl(initialData.imageUrl || null);
		}
	}, [initialData, categories]);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("type", type);
		if (type === "category") {
			formData.append("name", categoryName);
		} else if (type === "subcategory") {
			formData.append("name", title);
			formData.append("categoryId", categoryId);
			
			// Handle image upload
			if (images.length > 0) {
				// Multiple new images uploaded
				images.forEach((file) => {
					formData.append("files", file);
				});
			} else if (image) {
				// Single image uploaded (backward compatibility)
				formData.append("file", image);
			} else if (existingImageUrl && initialData?.id) {
				// No new image, but we have an existing one - explicitly indicate to keep it
				formData.append("keepExistingImage", "true");
			}
		} else {
			formData.append("title", title);

			// Use the appropriate field name based on the type
			// - posts use "description" (correct spelling)
			// - featured uses "descripition" (with typo in the schema)
			if (type === "featured") {
				formData.append("descripition", description);
			} else {
				formData.append("description", description);
			}

			formData.append("categoryId", categoryId);
			formData.append("subcategoryId", subcategoryId || "");
			formData.append("productTypeId", productTypeId || ""); // Handle image upload
			if (images.length > 0) {
				// Multiple new images uploaded
				images.forEach((file) => {
					formData.append("files", file);
				});
			} else if (image) {
				// Single image uploaded (backward compatibility)
				formData.append("file", image);
			} else if (existingImageUrl && initialData?.id) {
				// No new image, but we have an existing one - explicitly indicate to keep it
				formData.append("keepExistingImage", "true");
			}
		}
		if (initialData?.id) {
			formData.append("id", initialData.id);
		}

		try {
			await onSave({ id: initialData?.id, formData });
			handleClose();
		} catch (error) {
			console.error("Error saving form:", error);
		}
	};
	const handleClose = () => {
		if (onClose) {
			onClose();
		} else {
			setOpen(false);
		}
		// Reset form
		if (!initialData) {
			setTitle("");
			setDescription("");
			setImage(null);
			setImages([]);
			setNewImagePreview(null);
			setNewImagePreviews([]);
			setCategoryName("");
			setCategoryId(categories[0]?.id || "");
		} else {
			// Just clear the new image preview if we're editing
			setNewImagePreview(null);
			setNewImagePreviews([]);
			setImage(null);
			setImages([]);
		}
	};

	const dialogContent = (
		<DialogContent className='bg-white dark:bg-gray-800 dark:text-white'>
			<DialogHeader>
				<DialogTitle className='text-lg font-semibold'>
					{initialData ? `Edit ${type}` : `Create new ${type}`}
				</DialogTitle>
			</DialogHeader>
			<form onSubmit={handleSubmit} className='space-y-4 mt-4'>
				{type === "category" ? (
					<div>
						<Label className='text-sm font-medium'>Category Name</Label>
						<Input
							type='text'
							value={categoryName}
							onChange={(e) => setCategoryName(e.target.value)}
							className='mt-1 dark:bg-gray-700 dark:text-gray-200'
							required
							placeholder='Enter category name'
						/>
					</div>
				) : type === "subcategory" ? (
					<>
						<div>
							<Label className='text-sm font-medium'>Subcategory Name</Label>
							<Input
								type='text'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className='mt-1 dark:bg-gray-700 dark:text-gray-200'
								required
								placeholder='Enter subcategory name'
							/>
						</div>
						<div>
							<Label className='text-sm font-medium'>Category</Label>
							<select
								className='mt-1 border rounded w-full p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
								value={categoryId}
								onChange={(e) => setCategoryId(e.target.value)}
								required>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
						</div>
					</>
				) : (
					<>
						<div>
							<Label className='text-sm font-medium'>Title</Label>
							<Input
								type='text'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className='mt-1 dark:bg-gray-700 dark:text-gray-200'
								required
							/>
						</div>
						<div>
							<Label className='text-sm font-medium'>Description</Label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className='mt-1 w-full min-h-[120px] border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 p-2'
								required
							/>
						</div>
						<div>
							<Label className='text-sm font-medium'>Category</Label>
							<select
								className='mt-1 border rounded w-full p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
								value={categoryId}
								onChange={(e) => setCategoryId(e.target.value)}
								required>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
						</div>
						<div>
							<Label className='text-sm font-medium'>Subcategory</Label>
							<select
								className='mt-1 border rounded w-full p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
								value={subcategoryId}
								onChange={(e) => setSubcategoryId(e.target.value)}
								required>
								<option value="">Select subcategory</option>
								{subcategories
									.filter(sub => sub.categoryId === categoryId)
									.map((sub) => (
										<option key={sub.id} value={sub.id}>
											{sub.name}
										</option>
									))}
							</select>
						</div>
						<div>
							<Label className='text-sm font-medium'>Product Type</Label>
							<select
								className='mt-1 border rounded w-full p-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
								value={productTypeId}
								onChange={(e) => setProductTypeId(e.target.value)}
								required>
								<option value="">Select product type</option>
								{productTypes.map((type) => (
									<option key={type.id} value={type.id}>
										{type.name}
									</option>
								))}
							</select>
						</div>{" "}
						<div>
							<Label className='text-sm font-medium'>Image</Label>
							{existingImageUrl && (
								<div className='mt-2 mb-3'>
									<p className='text-xs text-gray-500 mb-2'>Current image:</p>
									<div className='relative w-full max-w-[200px] h-[150px] border rounded overflow-hidden'>
										<Image
											src={existingImageUrl}
											alt='Current image'
											className='w-full h-full object-cover'
											width={200}
											height={150}
											loading='lazy'
										/>
									</div>
								</div>
							)}{" "}
							<Input
								type='file'
								accept='image/*'
								multiple={type === "post"} // Only allow multiple for posts
								onChange={(e) => {
									const files = Array.from(e.target.files || []);

									if (type === "post" && files.length > 0) {
										// Handle multiple files for posts
										setImages(files);
										setImage(null); // Clear single image

										// Create previews for multiple images
										const previewPromises = files.map((file) => {
											return new Promise<string>((resolve) => {
												const reader = new FileReader();
												reader.onload = (e) => {
													resolve(e.target?.result as string);
												};
												reader.readAsDataURL(file);
											});
										});

										Promise.all(previewPromises).then((previews) => {
											setNewImagePreviews(previews);
											setNewImagePreview(null); // Clear single preview
										});
									} else if (files.length > 0) {
										// Handle single file for featured/other types
										const file = files[0];
										setImage(file);
										setImages([]); // Clear multiple images

										// Create preview for single image
										const reader = new FileReader();
										reader.onload = (e) => {
											setNewImagePreview(e.target?.result as string);
										};
										reader.readAsDataURL(file);
										setNewImagePreviews([]); // Clear multiple previews
									} else {
										// No files selected
										setImage(null);
										setImages([]);
										setNewImagePreview(null);
										setNewImagePreviews([]);
									}
								}}
								className='mt-2 dark:bg-gray-700 dark:text-gray-200'
							/>{" "}
							{newImagePreviews.length > 0 && (
								<div className='mt-3 mb-2'>
									<p className='text-xs text-gray-500 mb-2'>
										New images preview ({newImagePreviews.length} selected):
									</p>
									<div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
										{newImagePreviews.map((preview, index) => (
											<div
												key={index}
												className='relative w-full h-[100px] border rounded overflow-hidden'>
												<Image
													src={preview}
													alt={`New image preview ${index + 1}`}
													className='w-full h-full object-cover'
													width={150}
													height={100}
													loading='lazy'
												/>
											</div>
										))}
									</div>
								</div>
							)}
							{newImagePreview && (
								<div className='mt-3 mb-2'>
									<p className='text-xs text-gray-500 mb-2'>
										New image preview:
									</p>
									<div className='relative w-full max-w-[200px] h-[150px] border rounded overflow-hidden'>
										<Image
											src={newImagePreview}
											alt='New image preview'
											className='w-full h-full object-cover'
											width={200}
											height={150}
											loading='lazy'
										/>
									</div>
								</div>
							)}{" "}
							<p className='text-xs text-gray-500 mt-1'>
								{type === "post"
									? existingImageUrl
										? "Upload new images (multiple allowed) to replace existing ones, or leave empty to keep current images."
										: "Please select image files (multiple images allowed for better product showcase)."
									: existingImageUrl
									? "Upload a new image to replace the current one, or leave empty to keep it."
									: "Please select an image file."}
							</p>
						</div>
					</>
				)}
				
				{/* Image field for all types except category */}
				{type !== "category" && (
					<div>
						<Label className='text-sm font-medium'>Image</Label>
						{existingImageUrl && (
							<div className='mt-2 mb-3'>
								<p className='text-xs text-gray-500 mb-2'>Current image:</p>
								<div className='relative w-full max-w-[200px] h-[150px] border rounded overflow-hidden'>
									<Image
										src={existingImageUrl}
										alt='Current image'
										className='w-full h-full object-cover'
										width={200}
										height={150}
										loading='lazy'
									/>
								</div>
							</div>
						)}{" "}
						<Input
							type='file'
							accept='image/*'
							multiple={type === "post"} // Only allow multiple for posts
							onChange={(e) => {
								const files = Array.from(e.target.files || []);

								if (type === "post" && files.length > 0) {
									// Handle multiple files for posts
									setImages(files);
									setImage(null); // Clear single image

									// Create previews for multiple images
									const previewPromises = files.map((file) => {
										return new Promise<string>((resolve) => {
											const reader = new FileReader();
											reader.onload = (e) => {
												resolve(e.target?.result as string);
											};
											reader.readAsDataURL(file);
										});
									});

									Promise.all(previewPromises).then((previews) => {
										setNewImagePreviews(previews);
									});
								} else if (files.length > 0) {
									// Handle single file for other types
									setImage(files[0]);
									setImages([]); // Clear multiple images
									setNewImagePreviews([]); // Clear multiple previews

									// Create preview for single image
									const reader = new FileReader();
									reader.onload = (e) => {
										setNewImagePreview(e.target?.result as string);
									};
									reader.readAsDataURL(files[0]);
								}
							}}
						/>
						{newImagePreviews.length > 0 && (
							<div className='mt-3 mb-2'>
								<p className='text-xs text-gray-500 mb-2'>
									New image previews:
								</p>
								<div className='flex flex-wrap gap-2'>
									{newImagePreviews.map((preview, index) => (
										<div
											key={index}
											className='relative w-full h-[100px] border rounded overflow-hidden'>
											<Image
												src={preview}
												alt={`New image preview ${index + 1}`}
												className='w-full h-full object-cover'
												width={150}
												height={100}
												loading='lazy'
											/>
										</div>
									))}
								</div>
							</div>
						)}
						{newImagePreview && (
							<div className='mt-3 mb-2'>
								<p className='text-xs text-gray-500 mb-2'>
									New image preview:
								</p>
								<div className='relative w-full max-w-[200px] h-[150px] border rounded overflow-hidden'>
									<Image
										src={newImagePreview}
										alt='New image preview'
										className='w-full h-full object-cover'
										width={200}
										height={150}
										loading='lazy'
									/>
								</div>
							</div>
						)}{" "}
						<p className='text-xs text-gray-500 mt-1'>
							{type === "post"
								? existingImageUrl
									? "Upload new images (multiple allowed) to replace existing ones, or leave empty to keep current images."
									: "Please select image files (multiple images allowed for better product showcase)."
								: existingImageUrl
								? "Upload a new image to replace the current one, or leave empty to keep it."
								: "Please select an image file."}
						</p>
					</div>
				)}
				
				<div className='flex justify-end space-x-2 pt-4'>
				<Button
					type='submit'
					className='bg-blue-600 hover:bg-blue-700 text-white'
					disabled={isLoading}>
					{isLoading ? (
						<div className='flex items-center space-x-2'>
							<svg
								className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
							</svg>
							<span>Saving...</span>
						</div>
					) : (
						"Save"
					)}
				</Button>
				{!triggerLabel && (
					<Button
						type='button'
						variant='outline'
						onClick={handleClose}
						className='ml-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
						disabled={isLoading}>
						Cancel
					</Button>
				)}
			</div>
			</form>
		</DialogContent>
	);

	// When used directly with no trigger (embedded in another dialog)
	if (triggerLabel === null) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				{dialogContent}
			</Dialog>
		);
	}
	// Normal usage with a trigger button
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className='bg-blue-600 hover:bg-blue-700 text-white'
					disabled={isLoading}>
					{isLoading ? (
						<div className='flex items-center space-x-2'>
							<svg
								className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
							</svg>
							<span>Creating...</span>
						</div>
					) : (
						triggerLabel
					)}
				</Button>
			</DialogTrigger>
			{dialogContent}
		</Dialog>
	);
}
