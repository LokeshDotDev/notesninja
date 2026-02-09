import React from "react";
import Link from "next/link";
import {
	Instagram,
	Globe,
	Heart,
	Star,
	Award,
	Phone,
	ArrowRight,
} from "lucide-react";

const NAV_LINKS = [
	{ name: "Home", href: "/" },
	{ name: "Furniture", href: "/furniture" },
	{ name: "Beds", href: "/metal_frame_bed" },
	{ name: "Ceramic & Curtains", href: "/ceramic_and_curtains" },
	{ name: "Lighting & Fixtures", href: "/led_and_plugs" },
	{ name: "Safety & Access", href: "/safety_and_access" },
];

const WHATSAPP_NUMBER = "15128013803";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const Footer: React.FC = () => {
	return (
		<footer className='bg-slate-900 text-white border-t border-slate-700 relative pt-8 pb-0 overflow-hidden'>
			{/* Animated Gradient Background */}
			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute -top-32 left-1/2 -translate-x-1/2 w-[120vw] h-96 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/10 blur-2xl opacity-60 animate-pulse'></div>
				<div className='absolute bottom-0 right-0 w-1/2 h-40 bg-gradient-to-br from-pink-500/20 to-transparent blur-2xl opacity-40'></div>
			</div>
			{/* Top Gradient Line */}
			<div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'></div>
			{/* Main Content */}
			<div className='relative z-10 container mx-auto px-6 pb-4'>
				<div className='flex flex-col md:flex-row md:justify-between md:items-start gap-8'>
					{/* Brand & Description */}
					<div className='flex-1 min-w-[220px] mb-8 md:mb-0'>
						<h2 className='text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-lg'>
							Elevate Motel Supply
						</h2>
						<p className='text-gray-300 leading-relaxed mb-4 max-w-xs text-base'>
							Transforming hospitality experiences with premium furniture and
							supplies for motels and hotels across the United States.
						</p>
						<div className='flex items-center gap-2 text-sm text-gray-400 mb-2'>
							<Star className='text-yellow-500' size={16} />
							<span>Premium Quality • Trusted Service</span>
						</div>
					</div>

					{/* Navigation Links */}
					<div className='flex-1 min-w-[180px] mb-8 md:mb-0'>
						<h3 className='text-lg font-semibold mb-3 text-white/90'>
							Quick Links
						</h3>
						<ul className='space-y-2'>
							{NAV_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className='text-gray-300 hover:text-white transition-colors duration-150 font-medium hover:underline underline-offset-4'>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact & Request a Quote */}
					<div className='flex-1 min-w-[220px] flex flex-col items-start gap-3'>
						<h3 className='text-lg font-semibold mb-1 text-white/90'>
							Contact
						</h3>
						<div className='flex flex-col gap-2 mb-2'>
							<div className='flex items-center gap-2'>
								<Phone size={16} className='text-blue-400' />
								<span className='font-medium'>+1 (512) 801-3803</span>
							</div>
							<div className='flex items-center gap-2'>
								<Phone size={16} className='text-blue-400' />
								<span className='font-medium'>+91 95863 78776</span>
							</div>
						</div>
						{/* Official Instagram handle prominently displayed */}
						<div className='mb-2'>
							<a
								href='https://www.instagram.com/elevatemotelsupply/'
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-800/60 via-purple-700/60 to-blue-900/60 backdrop-blur-md border border-blue-400/30 shadow-md text-white font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-2'
								style={{ boxShadow: "0 4px 24px 0 rgba(80,120,255,0.10)" }}>
								<Instagram size={18} className='text-pink-400 drop-shadow' />
								<span className='tracking-wide'>@elevatemotelsupply</span>
							</a>
						</div>
						<a
							href={WHATSAPP_URL}
							target='_blank'
							rel='noopener noreferrer'
							className='group inline-flex items-center gap-1 rounded-full border border-blue-700/40 bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 px-5 py-2 text-white font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 hover:text-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:ring-offset-2 [transition-property:background,color,box-shadow] [transition-delay:0s] group-hover:[transition-delay:0.5s] group-hover:from-blue-900 group-hover:via-blue-800 group-hover:to-blue-600'>
							<ArrowRight
								size={15}
								className='opacity-70 group-hover:translate-x-1 transition-transform duration-200'
							/>
							<span>Request a Quote</span>
						</a>
					</div>
				</div>

				{/* Minimal Social & Developed By Row - aligned together */}
				<div className='border-t border-slate-700/50 mt-4 pt-2 flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
					<div className='flex items-center gap-3 justify-center md:justify-start'>
						{/* Trendify Instagram link removed or de-emphasized, only official handle is prominent */}
						<a
							href='https://www.dailylance.com/'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-blue-400 transition-colors'>
							<Globe size={16} />
						</a>
						<span className='flex items-center gap-1 text-xs text-gray-400'>
							<Award className='inline-block text-blue-400' size={13} />
							<span>
								Developed by{" "}
								<span className='font-semibold text-white'>
									Trendify & Daily Lance
								</span>
							</span>
						</span>
					</div>
					<div className='text-center md:text-right text-xs text-gray-500'>
						© {new Date().getFullYear()} Elevate Motel Supply • All rights
						reserved | Built with{" "}
						<Heart className='inline-block text-red-500' size={12} /> by
						professionals
					</div>
				</div>
			</div>
			{/* Extra engaging background effect */}
			<div className='pointer-events-none absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-blue-900/40 via-blue-700/10 to-transparent blur-2xl opacity-60' />
		</footer>
	);
};

export default Footer;
