"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, User, LogOut, ChevronDown as ChevronDownIcon, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { AuthModal } from "@/components/auth/AuthModal";
import { isAdmin } from "@/lib/admin";
import settings from "@/lib/settings";
import { MobileWhatsAppChat } from "@/components/ui/MobileWhatsAppChat";

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
	const router = useRouter();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchSuggestions, setSearchSuggestions] = useState<Array<{ id: string; title: string; description: string; slug: string; category: { path?: string } }>>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const userDropdownRef = useRef<HTMLDivElement>(null);

	// Check if current user is admin
	const isCurrentUserAdmin = session?.user?.email ? isAdmin(session.user.email) : false;

	const handleSearch = async (query: string, directProduct?: { id: string; title: string; description: string; slug: string; category: { path?: string } }) => {
		if (!query.trim()) return;
		
		const lowerQuery = query.toLowerCase().trim();
		
		// If clicked on suggestion, go directly to product page
		if (directProduct) {
			const categoryPath = directProduct.category?.path || 'online-manipal-university/notes-and-mockpaper';
			router.push(`/${categoryPath}/${directProduct.slug}`);
			setSearchQuery("");
			setShowSuggestions(false);
			return;
		}
		
		// Check for exact course matches first
		if (lowerQuery === "mba") {
			router.push("/online-manipal-university/notes-and-mockpaper/mba");
			return;
		}
		
		if (lowerQuery === "bca") {
			router.push("/online-manipal-university/notes-and-mockpaper/bca");
			return;
		}
		
		if (lowerQuery === "bba") {
			router.push("/online-manipal-university/notes-and-mockpaper/bba");
			return;
		}
		
		// Search for exact product match
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
			if (response.ok) {
				const results = await response.json();
				
				// Check for exact product title match
				const exactMatch = results.find((post: { title: string; slug: string; category: { path?: string } }) => 
					post.title.toLowerCase() === lowerQuery
				);
				
				if (exactMatch) {
					// Go to exact product page
					const categoryPath = exactMatch.category?.path || 'online-manipal-university/notes-and-mockpaper';
					router.push(`/${categoryPath}/${exactMatch.slug}`);
					return;
				}
				
				// Check for partial course match
				if (lowerQuery.includes("mba")) {
					router.push("/online-manipal-university/notes-and-mockpaper/mba");
					return;
				}
				
				if (lowerQuery.includes("bca")) {
					router.push("/online-manipal-university/notes-and-mockpaper/bca");
					return;
				}
				
				if (lowerQuery.includes("bba")) {
					router.push("/online-manipal-university/notes-and-mockpaper/bba");
					return;
				}
				
				// No match found, go to main category
				router.push("/online-manipal-university/notes-and-mockpaper");
			}
		} catch {
			// Fallback to main category
			router.push("/online-manipal-university/notes-and-mockpaper");
		}
		
		// Reset search
		setSearchQuery("");
		setShowSuggestions(false);
	};

	const fetchSuggestions = async (query: string) => {
		if (query.trim().length < 2) {
			setSearchSuggestions([]);
			setShowSuggestions(false);
			return;
		}

		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
			if (response.ok) {
				const results = await response.json();
				setSearchSuggestions(results.slice(0, 5)); // Show max 5 suggestions
				setShowSuggestions(true);
			}
		} catch {
			console.error("Error fetching suggestions:");
		}
	};

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
					onClick={() => {
						setIsDropdownOpen(false);
						setIsMobileMenuOpen(false);
					}}
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
			<nav className={`fixed top-0 left-0 right-0 z-[100] w-full ${appleNavbar.border} ${appleNavbar.background} backdrop-blur-xl shadow-sm`}>
			<div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="flex h-20 items-center justify-between">
					{/* Mobile Hamburger Menu - Left Side */}
					<div className="lg:hidden order-first">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className={`${appleNavbar.text.primary} p-2 rounded-xl hover:bg-[rgb(248, 248, 248)] dark:hover:bg-neutral-800 transition-all duration-200`}
						>
							{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</Button>
					</div>

					{/* Logo */}
					<div className="flex items-center flex-1 lg:flex-none justify-center lg:justify-start">
						<Link href="/" className="flex items-center space-x-3 group">
							<Image 
								src="/assets/Notes ninja Logo copy.png" 
								alt="NotesNinja" 
								width={150}
								height={48}
								priority
								className="h-10 lg:h-14 w-auto"
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
								<div className="absolute top-full left-0 mt-3 w-96 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-[rgb(229, 229, 234)] dark:border-neutral-700 overflow-hidden backdrop-blur-xl z-[110]">
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

						{/* Search - Always Visible */}
						<div className="relative">
							<div className="flex items-center gap-2 bg-white dark:bg-neutral-800 rounded-full border border-[rgb(229, 229, 234)] dark:border-neutral-700 px-3 py-2">
								<Search className="w-4 h-4 text-gray-400" />
								<input
									type="text"
									placeholder="Search products..."
									value={searchQuery}
									onChange={(e) => {
										setSearchQuery(e.target.value);
										fetchSuggestions(e.target.value);
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											handleSearch(searchQuery);
										} else if (e.key === 'Escape') {
											setSearchQuery("");
											setShowSuggestions(false);
										}
									}}
									className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm w-64 md:w-96 outline-none"
								/>
								{searchQuery && (
									<button
										onClick={() => {
											setSearchQuery("");
											setShowSuggestions(false);
										}}
										className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
									>
										<X className="w-3 h-3 text-gray-400" />
									</button>
								)}
								
								{/* Suggestions Dropdown */}
								{showSuggestions && searchSuggestions.length > 0 && (
									<div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-[rgb(229, 229, 234)] dark:border-neutral-700 overflow-hidden z-[120]">
										{searchSuggestions.map((suggestion) => (
											<button
												key={suggestion.id}
												onClick={() => handleSearch(searchQuery, suggestion)}
												className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors border-b border-gray-100 dark:border-neutral-700 last:border-b-0"
											>
												<div className="text-sm font-medium text-gray-900 dark:text-white">
													{suggestion.title}
												</div>
												<div className="text-xs text-gray-500 dark:text-gray-400 truncate">
													{suggestion.description}
												</div>
											</button>
										))}
									</div>
								)}
							</div>
						</div>
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
									<div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[110]">
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

					{/* Mobile Right Section - Call Icon & Auth */}
					<div className="lg:hidden flex items-center gap-2">
						{/* Direct Call Icon - Mobile Only */}
						<a
							href={`tel:${settings.whatsapp.number}`}
							className={`p-2 rounded-xl ${appleNavbar.text.primary} hover:bg-[rgb(248, 248, 248)] dark:hover:bg-neutral-800 transition-all duration-200`}
							title="Call us"
						>
							<Phone className="w-5 h-5" />
						</a>
						
						{/* Mobile WhatsApp Chat */}
						<MobileWhatsAppChat />
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
								href="/articles"
								className={`block px-6 py-3 text-sm ${appleNavbar.text.secondary} ${appleNavbar.text.hover} transition-all duration-200 font-medium`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Articles
							</Link>

							{/* Mobile Search */}
							<div className="px-6 py-3 border-t border-[rgb(229, 229, 234)] dark:border-neutral-700">
								<div className="flex items-center gap-2 bg-white dark:bg-neutral-800 rounded-full border border-[rgb(229, 229, 234)] dark:border-neutral-700 px-3 py-2">
									<Search className="w-4 h-4 text-gray-400" />
									<input
										type="text"
										placeholder="Search products..."
										value={searchQuery}
										onChange={(e) => {
											setSearchQuery(e.target.value);
											fetchSuggestions(e.target.value);
										}}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handleSearch(searchQuery);
												setIsMobileMenuOpen(false);
											}
										}}
										className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm flex-1 outline-none"
									/>
									{searchQuery && (
										<button
											onClick={() => {
												setSearchQuery("");
												setShowSuggestions(false);
											}}
											className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
										>
											<X className="w-3 h-3 text-gray-400" />
										</button>
									)}
								</div>
								
								{/* Mobile Suggestions */}
								{showSuggestions && searchSuggestions.length > 0 && (
									<div className="mt-2 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-[rgb(229, 229, 234)] dark:border-neutral-700 overflow-hidden">
										{searchSuggestions.map((suggestion) => (
											<button
												key={suggestion.id}
												onClick={() => {
													handleSearch(searchQuery, suggestion);
													setIsMobileMenuOpen(false);
												}}
												className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors border-b border-gray-100 dark:border-neutral-700 last:border-b-0"
											>
												<div className="text-sm font-medium text-gray-900 dark:text-white">
													{suggestion.title}
												</div>
												<div className="text-xs text-gray-500 dark:text-gray-400 truncate">
													{suggestion.description}
												</div>
											</button>
										))}
									</div>
								)}
							</div>

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
