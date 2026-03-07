"use client";
import {
	Navbar,
	NavBody,
	NavItems,
	MobileNav,
	NavbarLogo,
	NavbarButton,
	MobileNavHeader,
	MobileNavToggle,
	MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import settings from "@/lib/settings";
import { useState } from "react";
import { ChevronDown, BookOpen, FileText, Shield, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export function NotesNinjaNavbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const router = useRouter();

	const studyCategories = [
		{ name: "Mathematics", link: "/mathematics" },
		{ name: "Science", link: "/science" },
		{ name: "Computer Science", link: "/computer-science" },
		{ name: "Medicine", link: "/medicine" },
		{ name: "Business", link: "/business" },
		{ name: "Literature", link: "/literature" },
		{ name: "Engineering", link: "/engineering" },
		{ name: "Arts & Design", link: "/arts-design" },
	];

	const navItems = [
		{
			name: "Study Materials",
			link: "#",
			icon: ChevronDown,
			dropdown: studyCategories,
		},
		{ name: "Privacy Policy", link: "/privacy-policy", icon: FileText },
		{ name: "Terms & Conditions", link: "/terms-conditions", icon: Shield },
	];

	const handleSearch = async (query: string) => {
		if (!query.trim()) return;
		
		// Handle specific course searches like "MBA"
		const lowerQuery = query.toLowerCase().trim();
		
		// Check for specific course patterns
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
		
		// For more specific searches like "mba sem 4 supply chain and management"
		// we'll search through posts and redirect to the product detail page
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
			if (response.ok) {
				const results = await response.json();
				if (results.length > 0) {
					// If we find an exact match, redirect to product detail
					const exactMatch = results.find((post: { title: string; slug: string }) => 
						post.title.toLowerCase() === lowerQuery || 
						post.title.toLowerCase().includes(lowerQuery)
					);
					
					if (exactMatch) {
						router.push(`/online-manipal-university/notes-and-mockpaper/${exactMatch.slug}`);
						return;
					}
					
					// Otherwise redirect to the main category with search query
					router.push(`/online-manipal-university/notes-and-mockpaper?search=${encodeURIComponent(query)}`);
				} else {
					// If no results, redirect to main category
					router.push("/online-manipal-university/notes-and-mockpaper");
				}
			}
		} catch {
			// Fallback to main category
			router.push("/online-manipal-university/notes-and-mockpaper");
		}
		
		// Reset search
		setSearchQuery("");
		setIsSearchOpen(false);
	};

	return (
		<div className='relative w-full'>
			<Navbar>
				{/* Desktop Navigation */}
				<NavBody>
					<NavbarLogo />
					<NavItems items={navItems} />
					<div className='flex items-center gap-4'>
						{/* Search Icon */}
						<div className="relative">
							{!isSearchOpen ? (
								<button
									onClick={() => setIsSearchOpen(true)}
									className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
									aria-label="Search"
								>
									<Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
								</button>
							) : (
								<div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-2 shadow-lg">
									<Search className="w-4 h-4 text-gray-400" />
									<Input
										type="text"
										placeholder="Search products..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handleSearch(searchQuery);
											} else if (e.key === 'Escape') {
												setIsSearchOpen(false);
												setSearchQuery("");
											}
										}}
										className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm w-48 md:w-64"
										autoFocus
									/>
									<button
										onClick={() => {
											setIsSearchOpen(false);
											setSearchQuery("");
										}}
										className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
									>
										<X className="w-3 h-3 text-gray-400" />
									</button>
								</div>
							)}
						</div>
						
						<NavbarButton
							variant='dark'
							className='group flex gap-2 justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-300 hover:text-white hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 hover:scale-105'
							href={settings.whatsapp.url()}
							target='_blank'
							rel='noopener noreferrer'>
							<BookOpen className="w-4 h-4" />
							<span className='font-semibold'>Get Study Materials</span>
						</NavbarButton>
					</div>
				</NavBody>

				{/* Mobile Navigation */}
				<MobileNav>
					<MobileNavHeader>
						<NavbarLogo />
						<MobileNavToggle
							isOpen={isMobileMenuOpen}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						/>
					</MobileNavHeader>

					<MobileNavMenu
						isOpen={isMobileMenuOpen}
						onClose={() => setIsMobileMenuOpen(false)}>
						
						{/* Mobile Search */}
						<div className="py-4 px-3 border-b border-gray-200 dark:border-gray-700">
							<div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-2">
								<Search className="w-4 h-4 text-gray-400" />
								<Input
									type="text"
									placeholder="Search products..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											handleSearch(searchQuery);
											setIsMobileMenuOpen(false);
										}
									}}
									className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm flex-1"
								/>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
									>
										<X className="w-3 h-3 text-gray-400" />
									</button>
								)}
							</div>
						</div>
						
						{/* Study Materials Dropdown for Mobile */}
						<div className="py-2">
							<div className="px-3 py-2 text-sm font-semibold text-neutral-900 dark:text-white">
								Study Materials
							</div>
							{studyCategories.map((category, idx) => (
								<a
									key={`mobile-category-${idx}`}
									href={category.link}
									onClick={() => setIsMobileMenuOpen(false)}
									className='block px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-primary'>
									{category.name}
								</a>
							))}
						</div>

						{/* Other Menu Items */}
						{navItems.slice(1).map((item, idx) => (
							<a
								key={`mobile-link-${idx}`}
								href={item.link}
								onClick={() => setIsMobileMenuOpen(false)}
								className='relative text-neutral-600 dark:text-neutral-300 px-3 py-2 text-sm'>
								<span className='block'>{item.name}</span>
							</a>
						))}
						
						<div className='flex w-full flex-col gap-4 mt-4 px-3'>
							<NavbarButton
								onClick={() => setIsMobileMenuOpen(false)}
								variant='dark'
								className='group w-full flex gap-2 justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-300 hover:text-white hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 hover:scale-105'
								href={settings.whatsapp.url()}
								target='_blank'
								rel='noopener noreferrer'>
								<BookOpen className="w-4 h-4" />
								<span className='font-semibold'>Get Study Materials</span>
							</NavbarButton>
						</div>
					</MobileNavMenu>
				</MobileNav>
			</Navbar>
		</div>
	);
}
