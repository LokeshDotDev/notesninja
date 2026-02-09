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

export function NavbarTop() {
	const navItems = [
		{ name: "Furniture", link: "/furniture" },
		{ name: "Beds", link: "/metal_frame_bed" },
		{ name: "Ceramic & Curtains", link: "/ceramic_and_curtains" },
		{ name: "Lighting & Fixtures", link: "/led_and_plugs" },
		{ name: "Safety & Access", link: "/safety_and_access" },
	];

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
							className='group flex gap-2 justify-center items-center bg-neutral-900 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-300 hover:text-white hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 [transition-property:background,color,box-shadow] [transition-delay:0s] group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:via-blue-500 group-hover:to-primary'
							href={settings.whatsapp.url()}
							target='_blank'
							rel='noopener noreferrer'>
							<span className='font-semibold'>Request a Quote</span>
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
						{navItems.map((item, idx) => (
							<a
								key={`mobile-link-${idx}`}
								href={item.link}
								onClick={() => setIsMobileMenuOpen(false)}
								className='relative text-neutral-600 dark:text-neutral-300'>
								<span className='block'>{item.name}</span>
							</a>
						))}
						<div className='flex w-full flex-col gap-4 mt-4'>
							<NavbarButton
								onClick={() => setIsMobileMenuOpen(false)}
								variant='dark'
								className='group w-full flex gap-2 justify-center items-center bg-neutral-900 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-300 hover:text-white hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 [transition-property:background,color,box-shadow] [transition-delay:0s] group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:via-blue-500 group-hover:to-primary'
								href={settings.whatsapp.url()}
								target='_blank'
								rel='noopener noreferrer'>
								<span className='font-semibold'>Request a Quote</span>
							</NavbarButton>
						</div>
					</MobileNavMenu>
				</MobileNav>
			</Navbar>

			{/* Navbar */}
		</div>
	);
}
