"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import settings from "@/lib/settings";
import { ChevronDown, BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function DynamicNavbar() {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Fetch categories from database
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/categories");
				if (response.ok) {
					const data = await response.json();
					setCategories(data);
				}
			} catch (error) {
				console.error("Failed to fetch categories:", error);
				// Fallback categories if API fails
				setCategories([
					{ id: "1", name: "Mathematics", slug: "mathematics", level: 0, path: "mathematics", parentId: null, children: [] },
					{ id: "2", name: "Science", slug: "science", level: 0, path: "science", parentId: null, children: [] },
					{ id: "3", name: "Computer Science", slug: "computer-science", level: 0, path: "computer-science", parentId: null, children: [] },
					{ id: "4", name: "Medicine", slug: "medicine", level: 0, path: "medicine", parentId: null, children: [] },
					{ id: "5", name: "Business", slug: "business", level: 0, path: "business", parentId: null, children: [] },
					{ id: "6", name: "Literature", slug: "literature", level: 0, path: "literature", parentId: null, children: [] },
					{ id: "7", name: "Engineering", slug: "engineering", level: 0, path: "engineering", parentId: null, children: [] },
					{ id: "8", name: "Arts & Design", slug: "arts-design", level: 0, path: "arts-design", parentId: null, children: [] },
				]);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Render nested categories for dropdown
	const renderNestedCategories = (categories: Category[], depth = 0) => {
		return categories.map((category) => (
			<div key={category.id}>
				<Link
					href={`/${category.path || category.slug}`}
					className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary transition-colors"
					style={{ paddingLeft: `${12 + depth * 16}px` }}
					onClick={() => setIsDropdownOpen(false)}
				>
					{category.name}
				</Link>
				{category.children && category.children.length > 0 && (
					renderNestedCategories(category.children, depth + 1)
				)}
			</div>
		));
	};

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/95">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-2">
							<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
								<BookOpen className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold text-neutral-900 dark:text-white">
								NotesNinja
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{/* Study Materials Dropdown */}
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="flex items-center space-x-1 text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors py-2"
							>
								<span>Study Materials</span>
								<ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
							</button>
							
							{isDropdownOpen && (
								<div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
									<div className="py-2 max-h-96 overflow-y-auto">
										{loading ? (
											<div className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400">
												Loading categories...
											</div>
										) : categories.length > 0 ? (
											renderNestedCategories(categories)
										) : (
											<div className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400">
												No categories available
											</div>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Other Links */}
						<Link
							href="/privacy-policy"
							className="text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms-conditions"
							className="text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors"
						>
							Terms & Conditions
						</Link>
						<Link
							href="/refund-cancellation"
							className="text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors"
						>
							Refund & Cancellation
						</Link>
					</div>

					{/* CTA Button */}
					<div className="hidden md:block">
						<Button
							asChild
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-300 hover:shadow-2xl hover:scale-105"
						>
							<a
								href={settings.whatsapp.url()}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2"
							>
								<BookOpen className="w-4 h-4" />
								<span>Get Study Materials</span>
							</a>
						</Button>
					</div>

					{/* Mobile Menu Toggle */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="text-neutral-700 dark:text-neutral-300"
						>
							{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-neutral-200 dark:border-neutral-800">
						<div className="space-y-4">
							{/* Study Materials Section */}
							<div>
								<div className="px-3 py-2 text-sm font-semibold text-neutral-900 dark:text-white">
									Study Materials
								</div>
								<div className="pl-6 space-y-1 max-h-64 overflow-y-auto">
									{loading ? (
										<div className="py-2 text-sm text-neutral-500 dark:text-neutral-400">
											Loading categories...
										</div>
									) : categories.length > 0 ? (
										renderNestedCategories(categories)
									) : (
										<div className="py-2 text-sm text-neutral-500 dark:text-neutral-400">
											No categories available
										</div>
									)}
								</div>
							</div>

							{/* Other Links */}
							<Link
								href="/privacy-policy"
								className="block px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Privacy Policy
							</Link>
							<Link
								href="/terms-conditions"
								className="block px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Terms & Conditions
							</Link>
							<Link
								href="/refund-cancellation"
								className="block px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Refund & Cancellation
							</Link>

							{/* Mobile CTA Button */}
							<div className="px-3 pt-4">
								<Button
									asChild
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-300 hover:shadow-2xl"
								>
									<a
										href={settings.whatsapp.url()}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<BookOpen className="w-4 h-4" />
										<span>Get Study Materials</span>
									</a>
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
