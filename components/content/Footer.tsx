import React from "react";
import Link from "next/link";
import {
	Instagram,
	Facebook,
	Youtube,
} from "lucide-react";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	
	return (
		<footer className="relative bg-gray-50 text-gray-900 overflow-hidden border-t border-gray-200 pb-2 md:pb-44">
			{/* Subtle gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-gray-50 pointer-events-none"></div>
			
			{/* Faded NotesNinja Background - Responsive placement */}
			<div className="absolute bottom-0 md:top-96 left-0 right-0 flex justify-center items-end pointer-events-none">
				<div className="text-[4rem] sm:text-[5rem] md:text-[8rem] lg:text-[15rem] font-bold leading-none bg-gradient-to-t from-gray-400 via-gray-200 to-white bg-clip-text text-transparent">
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
								Study Materials
							</h3>
							<ul className="space-y-3">
								<li>
									<Link href="/online-manipal-university/notes-and-mockpaper" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										MUJ. Notes
									</Link>
								</li>
							</ul>
						</div>

						{/* Services Section */}
						<div>
							<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
								Courses
							</h3>
							<ul className="space-y-3">
								<li>
									<Link href="/online-manipal-university/notes-and-mockpaper/mba" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										MBA
									</Link>
								</li>
								<li>
									<Link href="/online-manipal-university/notes-and-mockpaper/bba" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										BBA
									</Link>
								</li>
								<li>
									<Link href="/online-manipal-university/notes-and-mockpaper/bca" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										BCA
									</Link>
								</li>
								<li>
									<Link href="/online-manipal-university/notes-and-mockpaper/mca" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										MCA
									</Link>
								</li>
								<li>
									<Link href="/online-manipal-university/notes-and-mockpaper/bcom" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										B.COM
									</Link>
								</li>
								<li>
									<Link href="/online-manipal-university/notes-and-mockpaper/mcom" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										M.COM
									</Link>
								</li>
								<li>
									<Link href="/online-manipal-university/notes-and-mockpaper/majmc" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										MAJMC
									</Link>
								</li>
								<li>
									<Link href="/online-manipal-university/notes-and-mockpaper/ma-in-economics" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										MA IN ECONOMICS
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
									<Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link href="/terms-conditions" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Terms & Conditions
									</Link>
								</li>
								<li>
									<Link href="/refund-cancellation" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Refund & Cancellation
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
										support@notesninja.in
									</a>
								</li>
								<li>
									<a
										href="tel:+91-6378990158"
										className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
									>
										+91-6378990158
									</a>
								</li>
								<li>
									<p className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
										Jaipur
									</p>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom Section */}
					<div className="flex flex-col lg:flex-row justify-between items-center py-8 border-t border-gray-200">
						{/* Copyright */}
						<div className="text-center lg:text-left mb-4 lg:mb-0">
							<p className="text-xs text-gray-500">
								Copyright {currentYear} NotesNinja Inc. All rights reserved.
							</p>
						</div>
						
						{/* Social Icons */}
						<div className="flex items-center space-x-4 lg:mb-0">
							<a
								href="https://youtube.com/@notesninja_in?si=0qqvegrOesmyEJTH"
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
							>
								<Youtube className="w-4 h-4 text-gray-600" />
							</a>
							<a
								href="https://www.facebook.com/profile.php?id=61584482746353"
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
							>
								<Facebook className="w-4 h-4 text-gray-600" />
							</a>
							<a
								href="https://www.instagram.com/study_notesninja?igsh=b3YxdHhiYjBiNzl2"
								target="_blank"
								rel="noopener noreferrer"
								className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
							>
								<Instagram className="w-4 h-4 text-gray-600" />
							</a>
						</div>
					</div>

					{/* Mobile Legal Links */}
					{/* <div className="lg:hidden border-t border-gray-200 pt-6">
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
					</div> */}

				</div>
			</div>
		</footer>
	);
};

export default Footer;
