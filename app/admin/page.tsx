"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import FormDialog from "@/components/custom/FormDialog";
import Notification from "@/components/custom/Notification";
import { useAuth } from "@clerk/nextjs";

interface Post {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
}

interface Featured {
	id: string;
	title: string;
	descripition: string; // Matching the backend field name
	imageUrl: string;
}

interface Category {
	id: string;
	name: string;
	_count?: {
		posts: number;
	};
}

interface Subcategory {
	id: string;
	name: string;
	categoryId: string;
	category?: {
		id: string;
		name: string;
	};
	_count?: {
		posts: number;
	};
}

interface ProductType {
	id: string;
	name: string;
	_count?: {
		posts: number;
		featured: number;
	};
}

interface Analytics {
	totalVisits: number;
	totalPosts: number;
	visitsByRegion: { region: string; count: number }[];
}

type PostEdit = {
	id?: string;
	title?: string;
	description?: string;
	imageUrl?: string;
	categoryId?: string;
};
type FeaturedEdit = {
	id?: string;
	title?: string;
	descripition?: string;
	imageUrl?: string;
	categoryId?: string;
};
type CategoryEdit = {
	id?: string;
	name?: string;
};
type SubcategoryEdit = {
	id?: string;
	name?: string;
	categoryId?: string;
};
type ProductTypeEdit = {
	id?: string;
	name?: string;
};

interface Visitor {
	id: string;
	ipAddress: string;
	location: string;
	visitedAt: string;
}

// Helper to extract country from location string
function extractCountry(location: string = ""): string {
	if (!location) return "Unknown";
	const parts = location.split(/,|\s+/);
	return parts[parts.length - 1] || "Unknown";
}

export default function Dashboard() {
	const { userId, isLoaded: authLoaded } = useAuth();
	const [posts, setPosts] = useState<Post[]>([]);
	const [featured, setFeatured] = useState<Featured[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
	const [productTypes, setProductTypes] = useState<ProductType[]>([]);
	const [analytics, setAnalytics] = useState<Analytics | null>(null);
	const [visitors, setVisitors] = useState<Visitor[]>([]);
	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean;
		type: string;
		id: string;
	}>({
		open: false,
		type: "",
		id: "",
	});
	const [editDialog, setEditDialog] = useState<{
		open: boolean;
		type: "post" | "featured" | "category" | "subcategory" | "product-type";
		data: PostEdit | FeaturedEdit | CategoryEdit | SubcategoryEdit | ProductTypeEdit | null;
	}>({
		open: false,
		type: "post",
		data: null,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState<{
		create: boolean;
		update: boolean;
		delete: boolean;
		id?: string;
		loading?: boolean;
	}>({
		create: false,
		update: false,
		delete: false,
		id: undefined,
		loading: false,
	});
	const [error, setError] = useState<string | null>(null);
	const [notification, setNotification] = useState<{
		message: string;
		type: "success" | "error" | "info";
		show: boolean;
	}>({
		message: "",
		type: "success",
		show: false,
	});

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [
					postsRes,
					featuredRes,
					categoriesRes,
					subcategoriesRes,
					productTypesRes,
					analyticsRes,
				] = await Promise.all([
					fetch("/api/posts").then((res) => {
						if (!res.ok) throw new Error("Failed to fetch posts");
						return res.json();
					}),
					fetch("/api/featured").then((res) => {
						if (!res.ok) throw new Error("Failed to fetch featured items");
						return res.json();
					}),
					fetch("/api/categories").then((res) => {
						if (!res.ok) throw new Error("Failed to fetch categories");
						return res.json();
					}),
					fetch("/api/subcategories").then((res) => {
						if (!res.ok) throw new Error("Failed to fetch subcategories");
						return res.json();
					}),
					fetch("/api/product-types").then((res) => {
						if (!res.ok) throw new Error("Failed to fetch product types");
						return res.json();
					}),
					fetch("/api/analytics/visitors").then((res) => {
						if (!res.ok) throw new Error("Failed to fetch visitors");
						return res.json();
					}),
				]);
				setPosts(postsRes);
				setFeatured(featuredRes);
				setCategories(categoriesRes);
				setSubcategories(subcategoriesRes);
				setProductTypes(productTypesRes);

				const totalVisits = analyticsRes.length;
				const totalPosts = postsRes.length;
				const visitsByRegion = analyticsRes.reduce(
					(
						acc: { region: string; count: number }[],
						visitor: { location?: string }
					) => {
						const region = visitor.location || "Unknown";
						const existing = acc.find(
							(item: { region: string; count: number }) =>
								item.region === region
						);
						if (existing) {
							existing.count += 1;
						} else {
							acc.push({ region, count: 1 });
						}
						return acc;
					},
					[]
				);

				setAnalytics({ totalVisits, totalPosts, visitsByRegion });
			} catch (error) {
				console.error("Error fetching data:", error);
				setError("Failed to load dashboard data. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);
	const handleSave = async (
		type: "post" | "featured" | "category" | "subcategory" | "product-type",
		{ id, formData }: { id?: string; formData: FormData }
	) => {
		// Set loading state based on whether it's a create or update operation
		setActionLoading({
			...actionLoading,
			create: !id,
			update: !!id,
			id: id,
		});

		try {
			let body;
			let url;
			let method;
			
			if (type === "product-type") {
				// For product-type, send JSON instead of FormData
				body = JSON.stringify(Object.fromEntries(formData));
				url = id ? `/api/product-types/${id}` : '/api/product-types';
				method = id ? "PUT" : "POST";
			} else {
				// For other types, use FormData
				const endpointType =
					type === "category"
						? "categories"
						: type === "subcategory"
						? "subcategories"
						: type === "featured"
						? "featured"
						: `${type}s`;
				url = id ? `/api/${endpointType}/${id}` : `/api/${endpointType}`;
				method = id ? "PATCH" : "POST";
				body = formData;
			}
			
			const response = await fetch(url, { 
				method, 
				body,
				headers: type === "product-type" ? { 'Content-Type': 'application/json' } : undefined
			});

			let errorMessage = `Failed to save ${type}`;

			if (!response.ok) {
				try {
					const errorData = await response.json();
					console.error(`Error response from ${url}:`, errorData);

					if (response.status === 401) {
						errorMessage = `Unauthorized. Please sign in to save this ${type}.`;
					} else if (response.status === 400) {
						errorMessage = errorData.error || `Invalid data for ${type}.`;
					} else {
						errorMessage = errorData.error || errorMessage;
					}

					throw new Error(errorMessage);
				} catch (parseError) {
					console.error("Error parsing response:", parseError);
					throw new Error(`Server error. Could not save ${type}.`);
				}
			}

			// Get response data
			let data;
			try {
				const contentType = response.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					// Only parse if there is content
					const text = await response.text();
					data = text ? JSON.parse(text) : {};
				} else {
					data = {};
				}
			} catch (parseError) {
				console.error("Error parsing success response:", parseError);
				throw new Error(`Error reading server response for ${type}.`);
			}
			if (type === "post") {
				setPosts(
					id ? posts.map((p) => (p.id === id ? data : p)) : [...posts, data]
				);
			} else if (type === "featured") {
				setFeatured(
					id
						? featured.map((f) => (f.id === id ? data : f))
						: [...featured, data]
				);
			} else if (type === "category") {
				setCategories(
					id
						? categories.map((c) => (c.id === id ? data : c))
						: [...categories, data]
				);
			} else if (type === "subcategory") {
				setSubcategories(
					id
						? subcategories.map((s) => (s.id === id ? data : s))
						: [...subcategories, data]
				);
			} else if (type === "product-type") {
				setProductTypes(
					id
						? productTypes.map((pt) => (pt.id === id ? data : pt))
						: [...productTypes, data]
				);
			}
			setError(null);
			// Show success notification
			setNotification({
				message: `${id ? "Updated" : "Created"} ${type} successfully!`,
				type: "success",
				show: true,
			});
		} catch (error) {
			console.error(`Error saving ${type}:`, error);
			setError(`Failed to save ${type}. Please try again.`);
			// Show error notification
			setNotification({
				message: `Failed to ${
					id ? "update" : "create"
				} ${type}. Please try again.`,
				type: "error",
				show: true,
			});
		} finally {
			// Reset loading state
			setActionLoading({
				create: false,
				update: false,
				delete: false,
			});
		}
	};
	const handleDelete = async () => {
		const { type, id } = deleteDialog;
		// Set loading state for delete operation
		setActionLoading({
			...actionLoading,
			delete: true,
			id: id,
		});

		try {
			let endpointType;
			if (type === "category") {
				endpointType = "categories";
			} else if (type === "subcategory") {
				endpointType = "subcategories";
			} else if (type === "featured") {
				endpointType = "featured";
			} else if (type === "product-type") {
				endpointType = "product-types";
			} else {
				endpointType = `${type}s`;
			}
			const url = `/api/${endpointType}/${id}`;
			const response = await fetch(url, { method: "DELETE" });
			if (!response.ok) {
				const errorData = await response.json();
				setError(errorData.error || `Failed to delete ${type}`);
				return;
			}
			if (type === "post") {
				setPosts(posts.filter((p) => p.id !== id));
			} else if (type === "featured") {
				setFeatured(featured.filter((f) => f.id !== id));
			} else if (type === "category") {
				setCategories(categories.filter((c) => c.id !== id));
			} else if (type === "subcategory") {
				setSubcategories(subcategories.filter((s) => s.id !== id));
			} else if (type === "product-type") {
				setProductTypes(productTypes.filter((pt) => pt.id !== id));
			}
			setDeleteDialog({ open: false, type: "", id: "" });
			setError(null);
			// Show success notification
			setNotification({
				message: `Deleted ${type} successfully!`,
				type: "success",
				show: true,
			});
		} catch (error) {
			console.error(`Error deleting ${type}:`, error);
			setError(`Failed to delete ${type}. Please try again.`);
			// Show error notification
			setNotification({
				message: `Failed to delete ${type}. Please try again.`,
				type: "error",
				show: true,
			});
		} finally {
			// Reset loading state
			setActionLoading({
				create: false,
				update: false,
				delete: false,
			});
		}
	};

	useEffect(() => {
		async function fetchVisitors() {
			setIsLoading(true);
			const res = await fetch("/api/analytics");
			const data = await res.json();
			setVisitors(data);
			setIsLoading(false);
		}
		fetchVisitors();
	}, []);

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-screen bg-gray-100'>
				<div className='text-xl font-semibold text-gray-700'>Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center h-screen bg-gray-100'>
				<div className='text-xl font-semibold text-red-500'>{error}</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen p-0 md:p-6 mt-20'>
			<div className='max-w-7xl mx-auto w-full'>
				<div className='flex flex-col md:flex-row md:justify-between md:items-center mb-8 px-4 md:px-0 gap-4 md:gap-0'>
					<h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-blue-900'>
						Admin Dashboard
					</h1>
					<div className='flex items-center gap-2'>
						<span
							className={`h-2 w-2 rounded-full ${
								userId ? "bg-green-500" : "bg-red-500"
							}`}></span>
						<span className='text-sm font-medium'>
							{!authLoaded
								? "Loading auth..."
								: userId
								? "Authenticated"
								: "Not authenticated"}
						</span>
					</div>
				</div>
				{/* Analytics Section */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 px-4 md:px-0'>
					<Card className='shadow-xl border-0 bg-white/80 backdrop-blur-md hover:scale-[1.03] transition-transform duration-300 h-[280px] flex flex-col'>
						<CardHeader className='flex-shrink-0'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<span className='inline-block w-2 h-2 bg-blue-500 rounded-full'></span>
								Total Visits
							</CardTitle>
						</CardHeader>
						<CardContent className='flex-1 flex items-center justify-center'>
							<p className='text-4xl font-extrabold text-blue-600'>
								{analytics?.totalVisits || 0}
							</p>
						</CardContent>
					</Card>
					<Card className='shadow-xl border-0 bg-white/80 backdrop-blur-md hover:scale-[1.03] transition-transform duration-300 h-[280px] flex flex-col'>
						<CardHeader className='flex-shrink-0'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<span className='inline-block w-2 h-2 bg-green-500 rounded-full'></span>
								Total Posts
							</CardTitle>
						</CardHeader>
						<CardContent className='flex-1 flex items-center justify-center'>
							<p className='text-4xl font-extrabold text-green-600'>
								{analytics?.totalPosts || 0}
							</p>
						</CardContent>
					</Card>
					<Card className='shadow-xl border-0 bg-white/80 backdrop-blur-md hover:scale-[1.03] transition-transform duration-300 h-[280px] flex flex-col'>
						<CardHeader className='flex-shrink-0'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<span className='inline-block w-2 h-2 bg-purple-500 rounded-full'></span>
								Visits by Region
							</CardTitle>
						</CardHeader>
						<CardContent className='flex-1 overflow-hidden'>
							{analytics?.visitsByRegion &&
							analytics.visitsByRegion.length > 0 ? (
								<div className='h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
									<ul className='space-y-2'>
										{analytics.visitsByRegion.map((region) => (
											<li
												key={region.region}
												className='flex justify-between text-sm font-medium py-1'>
												<span className='truncate max-w-[120px]'>
													{region.region}
												</span>
												<span className='text-blue-700'>{region.count}</span>
											</li>
										))}
									</ul>
								</div>
							) : (
								<p className='text-sm text-gray-500'>
									No region data available
								</p>
							)}
						</CardContent>
					</Card>
				</div>
				{/* Top Visitor Countries Section */}
				<Card className='mb-10 shadow-xl border-0 bg-white/90 backdrop-blur-md h-[400px] flex flex-col'>
					<CardHeader className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 px-4 md:px-8 pt-6 pb-2 flex-shrink-0'>
						<CardTitle className='text-lg font-bold'>
							Top Visitor Countries
						</CardTitle>
					</CardHeader>
					<CardContent className='flex-1 overflow-hidden px-2 md:px-8 pb-6'>
						<div className='h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
							{(() => {
								const countryCounts = Object.entries(
									visitors.reduce((acc, v) => {
										const country = extractCountry(v.location);
										acc[country] = (acc[country] || 0) + 1;
										return acc;
									}, {} as Record<string, number>)
								).sort((a, b) => b[1] - a[1]);
								const maxCount =
									countryCounts.length > 0 ? countryCounts[0][1] : 1;
								return (
									<ul className='space-y-4'>
										{countryCounts.map(([country, count], idx) => (
											<li
												key={country}
												className='flex items-center gap-4 p-2 rounded-lg hover:bg-blue-50 transition min-h-[48px]'>
												<span className='text-gray-400 font-bold w-6 text-right'>
													{idx + 1}.
												</span>
												<span className='font-semibold text-gray-800 min-w-[120px]'>
													{country}
												</span>
												<div className='flex-1 mx-4'>
													<div className='relative w-full bg-gray-200 rounded-full h-4 shadow-inner'>
														<div
															className='h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-700 shadow'
															style={{
																width: `${(count / maxCount) * 100}%`,
															}}></div>
													</div>
												</div>
												<span className='font-bold text-blue-700 text-lg min-w-[60px] text-right'>
													{count.toLocaleString()}{" "}
													<span className='text-sm font-medium'>visitors</span>
												</span>
											</li>
										))}
									</ul>
								);
							})()}
						</div>
					</CardContent>
				</Card>
				{/* Posts Section */}
				<Card className='mb-10 shadow-xl border-0 bg-white/90 backdrop-blur-md h-[400px] flex flex-col'>
					<CardHeader className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 px-4 md:px-8 pt-6 pb-2 flex-shrink-0'>
						<CardTitle className='text-lg font-bold'>Posts</CardTitle>
						<FormDialog
							type='post'
							triggerLabel='Create'
							onSave={(data) => handleSave("post", data)}
							categories={categories}
							subcategories={subcategories}
							productTypes={productTypes}
							isLoading={actionLoading.create}
						/>
					</CardHeader>
					<CardContent className='flex-1 overflow-hidden px-2 md:px-8 pb-6'>
						<div className='h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
							<table className='w-full text-sm rounded-xl overflow-hidden'>
								<thead className='sticky top-0 bg-white z-10'>
									<tr className='border-b border-gray-200'>
										<th className='text-left p-3 font-semibold'>Title</th>
										<th className='text-left p-3 font-semibold'>Description</th>
										<th className='text-left p-3 font-semibold'>Actions</th>
									</tr>
								</thead>
								<tbody>
									{posts.map((post) => (
										<tr
											key={post.id}
											className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors group'>
											<td className='p-3 font-medium max-w-xs truncate'>
												{post.title}
											</td>
											<td className='p-3 max-w-md truncate text-gray-600'>
												{post.description || (
													<span className='italic text-gray-400'>
														No description
													</span>
												)}
											</td>
											<td className='p-3 flex space-x-2'>
												<button
													onClick={() =>
														setDeleteDialog({
															open: true,
															type: "post",
															id: post.id,
														})
													}
													className={`p-2 rounded-full ${
														actionLoading.delete && actionLoading.id === post.id
															? "bg-red-50"
															: "hover:bg-red-100"
													} text-red-600 transition-colors`}
													title='Delete'
													disabled={
														actionLoading.delete || actionLoading.update
													}>
													{actionLoading.delete &&
													actionLoading.id === post.id ? (
														<svg
															className='animate-spin h-5 w-5'
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
													) : (
														<Trash2 className='h-5 w-5' />
													)}
												</button>
												<button
													onClick={() =>
														setEditDialog({
															open: true,
															type: "post",
															data: post,
														})
													}
													className={`p-2 rounded-full ${
														actionLoading.update && actionLoading.id === post.id
															? "bg-blue-50"
															: "hover:bg-blue-100"
													} text-blue-600 transition-colors`}
													title='Edit'
													disabled={
														actionLoading.delete || actionLoading.update
													}>
													{actionLoading.update &&
													actionLoading.id === post.id ? (
														<svg
															className='animate-spin h-5 w-5'
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
													) : (
														<svg
															xmlns='http://www.w3.org/2000/svg'
															fill='none'
															viewBox='0 0 24 24'
															strokeWidth={1.5}
															stroke='currentColor'
															className='h-5 w-5'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213l-4 1 1-4 13.362-13.362z'
															/>
														</svg>
													)}
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
				{/* Featured Section */}
				<Card className='mb-10 shadow-xl border-0 bg-white/90 backdrop-blur-md h-[400px] flex flex-col'>
					<CardHeader className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 px-4 md:px-8 pt-6 pb-2 flex-shrink-0'>
						<CardTitle className='text-lg font-bold'>Featured Items</CardTitle>
						<FormDialog
							type='featured'
							triggerLabel='Create'
							onSave={(data) => handleSave("featured", data)}
							categories={categories}
							subcategories={subcategories}
							productTypes={productTypes}
							isLoading={actionLoading.create}
						/>
					</CardHeader>
					<CardContent className='flex-1 overflow-hidden px-2 md:px-8 pb-6'>
						<div className='h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
							<table className='w-full text-sm rounded-xl overflow-hidden'>
								<thead className='sticky top-0 bg-white z-10'>
									<tr className='border-b border-gray-200'>
										<th className='text-left p-3 font-semibold'>Title</th>
										<th className='text-left p-3 font-semibold'>Description</th>
										<th className='text-left p-3 font-semibold'>Actions</th>
									</tr>
								</thead>
								<tbody>
									{featured.map((item) => (
										<tr
											key={item.id}
											className='border-b border-gray-100 hover:bg-green-50/40 transition-colors group'>
											<td className='p-3 font-medium max-w-xs truncate'>
												{item.title}
											</td>
											<td className='p-3 max-w-md truncate text-gray-600'>
												{item.descripition || (
													<span className='italic text-gray-400'>
														No description
													</span>
												)}
											</td>
											<td className='p-3 flex space-x-2'>
												<button
													onClick={() =>
														setDeleteDialog({
															open: true,
															type: "featured",
															id: item.id,
														})
													}
													className={`p-2 rounded-full ${
														actionLoading.delete && actionLoading.id === item.id
															? "bg-red-50"
															: "hover:bg-red-100"
													} text-red-600 transition-colors`}
													title='Delete'
													disabled={
														actionLoading.delete || actionLoading.update
													}>
													{actionLoading.delete &&
													actionLoading.id === item.id ? (
														<svg
															className='animate-spin h-5 w-5'
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
													) : (
														<Trash2 className='h-5 w-5' />
													)}
												</button>
												<button
													onClick={() =>
														setEditDialog({
															open: true,
															type: "featured",
															data: item,
														})
													}
													className={`p-2 rounded-full ${
														actionLoading.update && actionLoading.id === item.id
															? "bg-blue-50"
															: "hover:bg-blue-100"
													} text-blue-600 transition-colors`}
													title='Edit'
													disabled={
														actionLoading.delete || actionLoading.update
													}>
													{actionLoading.update &&
													actionLoading.id === item.id ? (
														<svg
															className='animate-spin h-5 w-5'
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
													) : (
														<svg
															xmlns='http://www.w3.org/2000/svg'
															fill='none'
															viewBox='0 0 24 24'
															strokeWidth={1.5}
															stroke='currentColor'
															className='h-5 w-5'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213l-4 1 1-4 13.362-13.362z'
															/>
														</svg>
													)}
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
				{/* Categories Management Section */}
				<Card className='mb-10 shadow-xl border-0 bg-white/90 backdrop-blur-md h-[400px] flex flex-col'>
					<CardHeader className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 px-4 md:px-8 pt-6 pb-2 flex-shrink-0'>
						<CardTitle className='text-lg font-bold'>Categories</CardTitle>
						<div className='flex gap-2'>
							<FormDialog
								type='category'
								triggerLabel='Create Category'
								onSave={(data) => handleSave("category", data)}
								isLoading={actionLoading.create}
							/>
							<FormDialog
								type='subcategory'
								triggerLabel='Create Subcategory'
								onSave={(data) => handleSave("subcategory", data)}
								categories={categories}
								isLoading={actionLoading.create}
							/>
						</div>
					</CardHeader>
					<CardContent className='flex-1 overflow-hidden px-2 md:px-8 pb-6'>
						<div className='h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
							<div className='space-y-6'>
								{/* Categories */}
								<div>
									<h3 className='text-md font-semibold mb-3 text-blue-700'>Categories</h3>
									<table className='w-full text-sm rounded-xl overflow-hidden mb-4'>
										<thead className='sticky top-0 bg-white z-10'>
											<tr className='border-b border-gray-200'>
												<th className='text-left p-3 font-semibold'>Name</th>
												<th className='text-left p-3 font-semibold'>Posts</th>
												<th className='text-left p-3 font-semibold'>Actions</th>
											</tr>
										</thead>
										<tbody>
											{categories.map((category) => (
												<tr
													key={category.id}
													className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors group'>
													<td className='p-3 font-medium'>
														{category.name}
													</td>
													<td className='p-3 text-gray-600'>
														{category._count?.posts || 0}
													</td>
													<td className='p-3 flex space-x-2'>
														<button
															onClick={() =>
																setEditDialog({
																	open: true,
																	type: "category",
																	data: category,
																})
															}
															className={`p-2 rounded-full ${
																actionLoading.update && actionLoading.id === category.id
																	? "bg-blue-50"
																	: "hover:bg-blue-100"
															} text-blue-600 transition-colors`}
															title='Edit'
															disabled={
																actionLoading.delete || actionLoading.update
															}>
															{actionLoading.update &&
																actionLoading.id === category.id ? (
																<svg
																	className='animate-spin h-5 w-5'
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
															) : (
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	fill='none'
																	viewBox='0 0 24 24'
																	strokeWidth={1.5}
																	stroke='currentColor'
																	className='h-5 w-5'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		d='M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213l-4 1 1-4 13.362-13.362z'
																	/>
																</svg>
															)}
														</button>
														<button
															onClick={() =>
																setDeleteDialog({
																	open: true,
																	type: "category",
																	id: category.id,
																})
															}
															className={`p-2 rounded-full ${
																actionLoading.delete && actionLoading.id === category.id
																	? "bg-red-50"
																	: "hover:bg-red-100"
															} text-red-600 transition-colors`}
															title='Delete'
															disabled={
																actionLoading.delete || actionLoading.update
															}>
															{actionLoading.delete &&
																actionLoading.id === category.id ? (
																<svg
																	className='animate-spin h-5 w-5'
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
															) : (
																<Trash2 className='h-5 w-5' />
															)}
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Subcategories */}
								<div>
									<h3 className='text-md font-semibold mb-3 text-green-700'>Subcategories</h3>
									<table className='w-full text-sm rounded-xl overflow-hidden'>
										<thead className='sticky top-0 bg-white z-10'>
											<tr className='border-b border-gray-200'>
												<th className='text-left p-3 font-semibold'>Name</th>
												<th className='text-left p-3 font-semibold'>Category</th>
												<th className='text-left p-3 font-semibold'>Posts</th>
												<th className='text-left p-3 font-semibold'>Actions</th>
											</tr>
										</thead>
										<tbody>
											{subcategories.map((subcategory) => (
												<tr
													key={subcategory.id}
													className='border-b border-gray-100 hover:bg-green-50/40 transition-colors group'>
													<td className='p-3 font-medium'>
														{subcategory.name}
													</td>
													<td className='p-3 text-gray-600'>
														{subcategory.category?.name || 'Unknown'}
													</td>
													<td className='p-3 text-gray-600'>
														{subcategory._count?.posts || 0}
													</td>
													<td className='p-3 flex space-x-2'>
														<button
															onClick={() =>
																setEditDialog({
																	open: true,
																	type: "subcategory",
																	data: subcategory,
																})
															}
															className={`p-2 rounded-full ${
																actionLoading.update && actionLoading.id === subcategory.id
																	? "bg-blue-50"
																	: "hover:bg-blue-100"
															} text-blue-600 transition-colors`}
															title='Edit'
															disabled={
																actionLoading.delete || actionLoading.update
															}>
															{actionLoading.update &&
																actionLoading.id === subcategory.id ? (
																<svg
																	className='animate-spin h-5 w-5'
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
															) : (
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	fill='none'
																	viewBox='0 0 24 24'
																	strokeWidth={1.5}
																	stroke='currentColor'
																	className='h-5 w-5'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		d='M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213l-4 1 1-4 13.362-13.362z'
																	/>
																</svg>
															)}
														</button>
														<button
															onClick={() =>
																setDeleteDialog({
																	open: true,
																	type: "subcategory",
																	id: subcategory.id,
																})
															}
															className={`p-2 rounded-full ${
																actionLoading.delete && actionLoading.id === subcategory.id
																	? "bg-red-50"
																	: "hover:bg-red-100"
																} text-red-600 transition-colors`}
															title='Delete'
															disabled={
																actionLoading.delete || actionLoading.update
															}>
															{actionLoading.delete &&
																actionLoading.id === subcategory.id ? (
																<svg
																	className='animate-spin h-5 w-5'
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
															) : (
																<Trash2 className='h-5 w-5' />
															)}
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				{/* Product Types Management Section */}
				<Card className='mb-10 shadow-xl border-0 bg-white/90 backdrop-blur-md h-[400px] flex flex-col'>
					<CardHeader className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 px-4 md:px-8 pt-6 pb-2 flex-shrink-0'>
						<CardTitle className='text-lg font-bold'>Product Types</CardTitle>
						<FormDialog
							type='product-type'
							triggerLabel='Create Product Type'
							onSave={(data) => handleSave("product-type", data)}
							isLoading={actionLoading.create}
						/>
					</CardHeader>
					<CardContent className='flex-1 overflow-hidden px-2 md:px-8 pb-6'>
						<div className='h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
							<div className='space-y-6'>
								<div>
									<h3 className='text-md font-semibold mb-3 text-purple-700'>Product Types</h3>
									<table className='w-full text-sm rounded-xl overflow-hidden'>
										<thead className='sticky top-0 bg-white z-10'>
											<tr className='border-b border-gray-200'>
												<th className='text-left p-3 font-semibold'>Name</th>
												<th className='text-left p-3 font-semibold'>Posts</th>
												<th className='text-left p-3 font-semibold'>Featured</th>
												<th className='text-left p-3 font-semibold'>Actions</th>
											</tr>
										</thead>
										<tbody>
											{productTypes.map((productType) => (
												<tr
													key={productType.id}
													className='border-b border-gray-100 hover:bg-purple-50/40 transition-colors group'>
													<td className='p-3 font-medium'>
														{productType.name}
													</td>
													<td className='p-3 text-gray-600'>
														{productType._count?.posts || 0}
													</td>
													<td className='p-3 text-gray-600'>
														{productType._count?.featured || 0}
													</td>
													<td className='p-3 flex space-x-2'>
														<button
															onClick={() =>
																setEditDialog({
																	open: true,
																	type: "product-type",
																	data: productType,
																})
															}
															className={`p-2 rounded-full ${
																editDialog.loading && editDialog.id === productType.id
																	? "bg-gray-100 text-gray-400"
																	: "bg-blue-100 text-blue-600 hover:bg-blue-200"
															} transition-colors`}
															disabled={
																editDialog.loading && editDialog.id === productType.id
															}>
															{editDialog.loading && editDialog.id === productType.id ? (
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	fill='none'
																	viewBox='0 0 24 24'
																	strokeWidth={1.5}
																	stroke='currentColor'
																	className='h-4 w-4 animate-spin'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
																</svg>
															) : (
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	fill='none'
																	viewBox='0 0 24 24'
																	strokeWidth={1.5}
																	stroke='currentColor'
																	className='h-4 w-4'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		d='M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182L7.5 20.213l-4 1 1-4 13.362-13.362z'
																	/>
																</svg>
															)}
														</button>
														<button
															onClick={() =>
																setDeleteDialog({
																	open: true,
																	type: "product-type",
																	id: productType.id,
																})
															}
															className={`p-2 rounded-full ${
																actionLoading.delete && actionLoading.id === productType.id
																	? "bg-gray-100 text-gray-400"
																	: "bg-red-100 text-red-600 hover:bg-red-200"
															} transition-colors`}
															disabled={
																actionLoading.delete && actionLoading.id === productType.id
															}>
															{actionLoading.delete && actionLoading.id === productType.id ? (
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	fill='none'
																	viewBox='0 0 24 24'
																	className='h-4 w-4 animate-spin'>
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
															) : (
																<Trash2 className='h-4 w-4' />
															)}
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				{/* Visitors Section */}
				<Card className='mb-10 shadow-xl border-0 bg-white/90 backdrop-blur-md h-[400px] flex flex-col'>
					<CardHeader className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 px-4 md:px-8 pt-6 pb-2 flex-shrink-0'>
						<CardTitle className='text-lg font-bold'>
							Visitor Analytics
						</CardTitle>
					</CardHeader>
					<CardContent className='flex-1 overflow-hidden px-2 md:px-8 pb-6'>
						<div className='h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
							<table className='w-full text-sm rounded-xl overflow-hidden'>
								<thead className='sticky top-0 bg-white z-10'>
									<tr className='border-b border-gray-200'>
										<th className='text-left p-3 font-semibold'>IP Address</th>
										<th className='text-left p-3 font-semibold'>Location</th>
										<th className='text-left p-3 font-semibold'>Visited At</th>
									</tr>
								</thead>
								<tbody>
									{visitors.map((v) => (
										<tr key={v.id} className='border-t'>
											<td className='px-4 py-2 font-mono'>{v.ipAddress}</td>
											<td className='px-4 py-2'>{v.location}</td>
											<td className='px-4 py-2 text-xs text-gray-500'>
												{new Date(v.visitedAt).toLocaleString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
				{/* Delete Confirmation Dialog */}
				<Dialog
					open={deleteDialog.open}
					onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
					<DialogContent className='bg-white rounded-2xl shadow-2xl border-0 p-8'>
						<DialogHeader>
							<DialogTitle className='text-lg font-semibold'>
								Confirm Deletion
							</DialogTitle>
						</DialogHeader>
						<p className='mb-4'>
							Are you sure you want to delete this {deleteDialog.type}?
						</p>
						{error && <p className='text-red-500 py-2'>{error}</p>}
						<div className='flex justify-end space-x-2 mt-4'>
							<Button
								variant='outline'
								onClick={() => {
									setDeleteDialog({ open: false, type: "", id: "" });
									setError(null);
								}}
								className='border-gray-300 text-gray-700 hover:bg-gray-100'
								disabled={actionLoading.delete}>
								Cancel
							</Button>
							<Button
								variant='destructive'
								onClick={handleDelete}
								className='bg-red-600 hover:bg-red-700 text-white'
								disabled={actionLoading.delete}>
								{actionLoading.delete ? (
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
										<span>Deleting...</span>
									</div>
								) : (
									"Delete"
								)}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
				{/* Edit Dialog */}
				{editDialog.open && (
					<Dialog
						open={editDialog.open}
						onOpenChange={(open) => {
							if (!open) setEditDialog({ ...editDialog, open: false });
						}}>
						<DialogContent className='bg-white rounded-2xl shadow-2xl border-0 p-8 max-w-lg'>
							<DialogHeader>
								<DialogTitle className='text-lg font-semibold'>
									{editDialog.type === "post"
										? "Edit Post"
										: editDialog.type === "featured"
										? "Edit Featured Item"
										: editDialog.type === "category"
										? "Edit Category"
										: "Edit Subcategory"}
								</DialogTitle>
							</DialogHeader>
							<FormDialog
								type={editDialog.type}
								initialData={editDialog.data ?? undefined}
								triggerLabel={null}
								onSave={async (data) => {
									await handleSave(editDialog.type, data);
									setEditDialog({ ...editDialog, open: false, data: null });
								}}
								categories={categories}
								subcategories={subcategories}
								productTypes={productTypes}
								onClose={() => setEditDialog({ ...editDialog, open: false })}
								isLoading={actionLoading.update}
							/>
						</DialogContent>
					</Dialog>
				)}
			</div>
			{/* Notification Toast */}
			{notification.show && (
				<Notification
					message={notification.message}
					type={notification.type}
					onClose={() => setNotification({ ...notification, show: false })}
					duration={3000}
				/>
			)}
		</div>
	);
}
