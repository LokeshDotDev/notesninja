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
import { ChevronDown, BookOpen, FileText, Shield, RefreshCw } from "lucide-react";

export function NotesNinjaNavbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
		{ name: "Refund & Cancellation", link: "/refund-cancellation", icon: RefreshCw },
	];

	return (
		<div className='relative w-full'>
			<Navbar>
				{/* Desktop Navigation */}
				<NavBody>
					<NavbarLogo />
					<NavItems items={navItems} />
					<div className='flex items-center gap-4'>
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
