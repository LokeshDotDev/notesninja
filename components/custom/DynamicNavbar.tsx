"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, User, LogOut, ChevronDown as ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { AuthModal } from "@/components/auth/AuthModal";
import { isAdmin } from "@/lib/admin";

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
	const { data: session } = useSession();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const userDropdownRef = useRef<HTMLDivElement>(null);

	// Check if current user is admin
	const isCurrentUserAdmin = session?.user?.email ? isAdmin(session.user.email) : false;

	useEffect(() => {
		// Fetch categories from database with caching
		const fetchCategories = async () => {
			// Check if categories are cached in sessionStorage
			const cachedCategories = sessionStorage.getItem('navbarCategories');
			const cacheTimestamp = sessionStorage.getItem('navbarCategoriesTimestamp');
			const now = Date.now();
			
			// Use cache if it's less than 5 minutes old
			if (cachedCategories && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 300000) {
				setCategories(JSON.parse(cachedCategories));
				setLoading(false);
				return;
			}

			try {
				const response = await fetch("/api/categories");
				if (response.ok) {
					const data = await response.json();
					setCategories(data);
					// Cache the data
					sessionStorage.setItem('navbarCategories', JSON.stringify(data));
					sessionStorage.setItem('navbarCategoriesTimestamp', now.toString());
				}
			} catch (error) {
				console.error("Error fetching categories:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
			if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
				setIsUserDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
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
		<>
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
								priority
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
							href="/articles"
							className={`${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
						>
							Articles
						</Link>
						<Link
							href="/faq"
							className={`${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
						>
							FAQ
						</Link>
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

					{/* User Authentication Section */}
					<div className="hidden lg:flex items-center gap-4">
						{session ? (
							<div className="relative" ref={userDropdownRef}>
								<Button
									onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
									variant="outline"
									className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
								>
									<User className="w-4 h-4" />
									{session.user.name || session.user.email}
									<ChevronDownIcon className="w-4 h-4" />
								</Button>
								
								{isUserDropdownOpen && (
									<div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
										{isCurrentUserAdmin && (
											<Link
												href="/admin"
												className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
												onClick={() => setIsUserDropdownOpen(false)}
											>
												<User className="w-4 h-4 text-purple-600" />
												Admin Dashboard
											</Link>
										)}
										<Link
											href="/dashboard"
											className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
											onClick={() => setIsUserDropdownOpen(false)}
										>
											<User className="w-4 h-4 text-blue-600" />
											Dashboard
										</Link>
										<button
											onClick={() => {
												signOut();
												setIsUserDropdownOpen(false);
											}}
											className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
										>
											<LogOut className="w-4 h-4 text-red-600" />
											Sign Out
										</button>
									</div>
								)}
							</div>
						) : (
							<Button
								onClick={() => setIsAuthModalOpen(true)}
								className={`${appleNavbar.button.primary} px-8 py-3 rounded-2xl font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-0`}
							>
								<User className="w-5 h-5 mr-2" />
								Sign In
							</Button>
						)}
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
						<div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
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

							{/* Mobile Authentication Section */}
							{session ? (
								<>
									<Link
										href={isCurrentUserAdmin ? "/admin" : "/dashboard"}
										className={`block px-6 py-3 text-sm ${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<User className="w-4 h-4 inline mr-2" />
										{isCurrentUserAdmin ? "Admin Dashboard" : "Dashboard"}
									</Link>
									<button
										onClick={() => {
											signOut();
											setIsMobileMenuOpen(false);
										}}
										className={`block w-full text-left px-6 py-3 text-sm ${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
									>
										<LogOut className="w-4 h-4 inline mr-2" />
										Sign Out
									</button>
								</>
							) : (
								<div className="px-6 py-3">
									<Button
										onClick={() => {
											setIsAuthModalOpen(true);
											setIsMobileMenuOpen(false);
										}}
										className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
									>
										<User className="w-4 h-4 mr-2" />
										Sign In
									</Button>
								</div>
							)}

						</div>
					</div>
				)}
			</div>
		</nav>
		
		{/* Auth Modal */}
		<AuthModal
			isOpen={isAuthModalOpen}
			onClose={() => setIsAuthModalOpen(false)}
			onSuccess={() => {
				// Optional: Handle successful authentication
			}}
		/>
		</>
	);
}
