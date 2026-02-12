import React from "react";
import Link from "next/link";
import {
	Instagram,
	Facebook,
	Twitter,
	Linkedin,
	ArrowUpRight,
} from "lucide-react";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	
	return (
		<footer className="relative bg-gray-50 text-gray-900 overflow-hidden border-t border-gray-200 pb-44">
			{/* Subtle gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-gray-50 pointer-events-none"></div>
			
			{/* Faded NotesNinja Background - Positioned closer to content from top */}
			<div className="absolute top-96 left-0 right-0 flex justify-center items-end pointer-events-none">
				<div className="text-[6rem] md:text-[8rem] lg:text-[15rem] font-bold leading-none bg-gradient-to-t from-gray-400 via-gray-200 to-white bg-clip-text text-transparent">
					NOTESNINJA
				</div>
			</div>
			
			<div className="relative z-10">
				{/* Main Footer Content */}
				<div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
						{/* Shop and Learn Section */}
						<div>
							<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
								Shop and Learn
							</h3>
							<ul className="space-y-3">
								<li>
									<Link href="/study-materials" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Study Materials
									</Link>
								</li>
								<li>
									<Link href="/exam-prep" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Exam Preparation
									</Link>
								</li>
								<li>
									<Link href="/assignments" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Assignments
									</Link>
								</li>
								<li>
									<Link href="/notes" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Premium Notes
									</Link>
								</li>
							</ul>
						</div>

						{/* Services Section */}
						<div>
							<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
								Services
							</h3>
							<ul className="space-y-3">
								<li>
									<Link href="/tutoring" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Online Tutoring
									</Link>
								</li>
								<li>
									<Link href="/study-groups" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Study Groups
									</Link>
								</li>
								<li>
									<Link href="/career-guidance" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Career Guidance
									</Link>
								</li>
								<li>
									<Link href="/support" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										24/7 Support
									</Link>
								</li>
							</ul>
						</div>

						{/* About Section */}
						<div>
							<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
								About
							</h3>
							<ul className="space-y-3">
								<li>
									<Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										About NotesNinja
									</Link>
								</li>
								<li>
									<Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Careers
									</Link>
								</li>
								<li>
									<Link href="/press" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Press Room
									</Link>
								</li>
								<li>
									<Link href="/investors" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Investors
									</Link>
								</li>
							</ul>
						</div>

						{/* Contact Section */}
						<div>
							<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
								Contact
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="mailto:support@notesninja.com"
										className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
									>
										support@notesninja.com
									</a>
								</li>
								<li>
									<a
										href="tel:+1-800-NINJA"
										className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
									>
										1-800-NINJA
									</a>
								</li>
								<li>
									<Link href="/locations" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Find a Location
									</Link>
								</li>
								<li>
									<Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center group">
										Get Help
										<ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom Section */}
					<div className="flex flex-col lg:flex-row justify-between items-center py-8">
						<div className="flex items-center space-x-6 mb-6 lg:mb-0">
							<p className="text-xs text-gray-500">
								Copyright {currentYear} NotesNinja Inc. All rights reserved.
							</p>
							<div className="hidden lg:flex items-center space-x-1">
								<span className="text-xs text-gray-500">|</span>
								<Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200 ml-1">
									Privacy Policy
								</Link>
								<span className="text-xs text-gray-500 ml-1">|</span>
								<Link href="/terms" className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200 ml-1">
									Terms of Use
								</Link>
								<span className="text-xs text-gray-500 ml-1">|</span>
								<Link href="/sales" className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200 ml-1">
									Sales and Refunds
								</Link>
								<span className="text-xs text-gray-500 ml-1">|</span>
								<Link href="/legal" className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200 ml-1">
									Legal
								</Link>
							</div>
						</div>
						
						{/* Social Icons */}
						<div className="flex items-center space-x-4">
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
							>
								<Twitter className="w-4 h-4 text-gray-600" />
							</a>
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
							>
								<Facebook className="w-4 h-4 text-gray-600" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
							>
								<Instagram className="w-4 h-4 text-gray-600" />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
							>
								<Linkedin className="w-4 h-4 text-gray-600" />
							</a>
						</div>
					</div>

					{/* Mobile Legal Links */}
					<div className="lg:hidden border-t border-gray-200 pt-6">
						<div className="grid grid-cols-2 gap-4">
							<Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200">
								Privacy Policy
							</Link>
							<Link href="/terms" className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200">
								Terms of Use
							</Link>
							<Link href="/sales" className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200">
								Sales and Refunds
							</Link>
							<Link href="/legal" className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200">
								Legal
							</Link>
						</div>
					</div>

				</div>
			</div>
		</footer>
	);
};

export default Footer;
