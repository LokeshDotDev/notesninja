"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Apple-inspired design system for navbar
const appleNavbar = {
  background: "bg-white/95 dark:bg-neutral-900/95",
  border: "border-[rgb(229, 229, 234)]/80 dark:border-neutral-800/80",
  text: {
    primary: "text-[rgb(28, 28, 30)] dark:text-white",
    secondary: "text-[rgb(99, 99, 102)] dark:text-neutral-400",
    hover: "hover:text-[rgb(0, 122, 255)] dark:hover:text-blue-400"
  },
  button: {
    primary: "bg-[rgb(0, 122, 255)] hover:bg-[rgb(0, 105, 217)] text-black",
    secondary: "bg-[rgb(248, 248, 248)] dark:bg-neutral-800 hover:bg-[rgb(0, 122, 255)]/10"
  }
};

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

	// Render nested categories for dropdown with Apple styling
	const renderNestedCategories = (categories: Category[], depth = 0) => {
		return categories.map((category) => (
			<div key={category.id}>
				<Link
					href={`/${category.path || category.slug}`}
					className={`block px-6 py-3 text-sm ${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
					style={{ paddingLeft: `${24 + depth * 16}px` }}
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
		<nav className={`fixed top-0 left-0 right-0 z-50 w-full ${appleNavbar.border} ${appleNavbar.background} backdrop-blur-xl shadow-sm`}>
			<div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="flex h-20 items-center justify-between">
					{/* Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-3 group">
							<Image 
								src="/assets/Notes ninja Logo copy.png" 
								alt="NotesNinja" 
								width={180}
								height={48}
								className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
							/>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center space-x-12">
						{/* Study Materials Dropdown */}
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className={`flex items-center space-x-2 ${appleNavbar.text.primary} ${appleNavbar.text.hover} transition-all duration-200 py-2 font-medium`}
							>
								<span>Study Materials</span>
								<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
							</button>
							
							{isDropdownOpen && (
								<div className="absolute top-full left-0 mt-3 w-96 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-[rgb(229, 229, 234)] dark:border-neutral-700 overflow-hidden backdrop-blur-xl">
									<div className="py-2 max-h-96 overflow-y-auto scrollbar-thin">
										{loading ? (
											<div className="px-6 py-4 text-sm text-[rgb(142, 142, 147)] dark:text-neutral-500">
												Loading categories...
											</div>
										) : categories.length > 0 ? (
											renderNestedCategories(categories)
										) : (
											<div className="px-6 py-4 text-sm text-[rgb(142, 142, 147)] dark:text-neutral-500">
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
							className={`${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms-conditions"
							className={`${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
						>
							Terms & Conditions
						</Link>
						<Link
							href="/refund-cancellation"
							className={`${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
						>
							Refund & Cancellation
						</Link>
					</div>

					{/* Apple-style CTA Button */}
					<div className="hidden lg:block">
						<Button
							asChild
							className={`${appleNavbar.button.primary} px-8 py-3 rounded-2xl font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-0`}
						>
							<a
								href="http://localhost:3001/online-manipal-university/notes-and-mockpaper"
								className="flex items-center gap-2"
							>
								<BookOpen className="w-5 h-5" />
								<span>Get Study Materials</span>
							</a>
						</Button>
					</div>

					{/* Mobile Menu Toggle */}
					<div className="lg:hidden">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className={`${appleNavbar.text.primary} p-2 rounded-xl hover:bg-[rgb(248, 248, 248)] dark:hover:bg-neutral-800 transition-all duration-200`}
						>
							{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<div className="lg:hidden py-6 border-t border-[rgb(229, 229, 234)] dark:border-neutral-800">
						<div className="space-y-6">
							{/* Study Materials Section */}
							<div>
								<div className="px-6 py-3 text-sm font-semibold text-[rgb(28, 28, 30)] dark:text-white">
									Study Materials
								</div>
								<div className="pl-6 space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
									{loading ? (
										<div className="py-3 text-sm text-[rgb(142, 142, 147)] dark:text-neutral-500">
											Loading categories...
										</div>
									) : categories.length > 0 ? (
										renderNestedCategories(categories)
									) : (
										<div className="py-3 text-sm text-[rgb(142, 142, 147)] dark:text-neutral-500">
											No categories available
										</div>
									)}
								</div>
							</div>

							{/* Other Links */}
							<Link
								href="/privacy-policy"
								className={`block px-6 py-3 text-sm ${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Privacy Policy
							</Link>
							<Link
								href="/terms-conditions"
								className={`block px-6 py-3 text-sm ${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Terms & Conditions
							</Link>
							<Link
								href="/refund-cancellation"
								className={`block px-6 py-3 text-sm ${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Refund & Cancellation
							</Link>

							{/* Mobile CTA Button */}
							<div className="px-6 pt-6">
								<Button
									asChild
									className={`w-full ${appleNavbar.button.primary} px-8 py-4 rounded-2xl font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-0`}
								>
									<a
										href="http://localhost:3001/online-manipal-university/notes-and-mockpaper"
										className="flex items-center justify-center gap-2"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<BookOpen className="w-5 h-5" />
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
