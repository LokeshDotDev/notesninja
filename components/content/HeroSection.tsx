"use client";
import { ContainerTextFlip } from "../ui/container-text-flip";
import settings from "@/lib/settings";
import { BackgroundLines } from "../ui/background-lines";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtm from "@/lib/gtm";
import { BookOpen, Download, Star, Users, Trophy, ArrowRight, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";

export function HeroSection() {
	const pathname = usePathname();

	useEffect(() => {
		gtm.pageview(pathname);
	}, [pathname]);

	return (
		<BackgroundLines svgOptions={{ duration: 20 }}>
			<section className='relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-12 text-center'>
				{/* Trust Badges */}
				<div className="flex items-center gap-2 mb-6">
					<Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
						<Star className="w-4 h-4 mr-1 fill-yellow-500" />
						4.9/5 Rating
					</Badge>
					<Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
						<Users className="w-4 h-4 mr-1" />
						50,000+ Students
					</Badge>
					<Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
						<Trophy className="w-4 h-4 mr-1" />
						Award Winning
					</Badge>
				</div>

				{/* Main Headline */}
				<h1 className='text-4xl font-bold text-neutral-900 dark:text-white md:text-6xl lg:text-7xl leading-tight max-w-5xl mx-auto mb-6'>
					Transform Your Learning Journey with{" "}
					<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
						NotesNinja
					</span>
				</h1>

				{/* Animated Text */}
				<div className='mb-8'>
					<span className='text-xl md:text-2xl text-neutral-600 dark:text-neutral-400'>
						Premium Digital Materials That{" "}
						<span className='flex justify-center items-center mt-2'>
							<ContainerTextFlip
								className='h-8 text-xl md:text-2xl text-primary font-semibold'
								words={["Excel", "Inspire", "Transform", "Accelerate", "Empower"]}
							/>
						</span>
					</span>
				</div>

				{/* Description */}
				<p className='max-w-3xl text-lg text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed'>
					Access expert-curated study materials, comprehensive notes, and exam preparation guides trusted by top students worldwide. 
					<span className="block mt-2 font-semibold text-primary">
						✓ Instant Downloads ✓ Expert-Verified Content ✓ Affordable Pricing ✓ 24/7 Access
					</span>
				</p>

				{/* CTA Buttons */}
				<div className='flex flex-col sm:flex-row justify-center gap-4 mb-12'>
					<a
						href={settings.whatsapp.url()}
						className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50'
						target='_blank'
						rel='noopener noreferrer'>
						<Download className="w-5 h-5" />
						<span className='font-semibold'>Start Learning Free</span>
						<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
					</a>
					<button className='inline-flex items-center justify-center gap-2 rounded-full border-2 border-neutral-300 dark:border-neutral-700 bg-white/10 backdrop-blur-sm px-8 py-4 text-neutral-900 dark:text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50'>
						<BookOpen className="w-5 h-5" />
						<span className='font-semibold'>Browse Collection</span>
					</button>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
					<div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
						<div className="text-3xl font-bold text-primary mb-1">1000+</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400">Study Materials</div>
					</div>
					<div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
						<div className="text-3xl font-bold text-primary mb-1">50+</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400">Subjects</div>
					</div>
					<div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
						<div className="text-3xl font-bold text-primary mb-1">98%</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400">Success Rate</div>
					</div>
					<div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
						<div className="text-3xl font-bold text-primary mb-1">24/7</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400">Support</div>
					</div>
				</div>

				{/* Feature Highlights */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
						<div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
							<Download className="w-8 h-8 text-white" />
						</div>
						<h3 className="font-bold text-neutral-900 dark:text-white mb-2 text-lg">Lightning Fast Access</h3>
						<p className="text-neutral-600 dark:text-neutral-400">Instant downloads and immediate access to all study materials</p>
					</div>
					<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
						<div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-4">
							<GraduationCap className="w-8 h-8 text-white" />
						</div>
						<h3 className="font-bold text-neutral-900 dark:text-white mb-2 text-lg">Expert Curated</h3>
						<p className="text-neutral-600 dark:text-neutral-400">Quality content from top educators and industry professionals</p>
					</div>
					<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
						<div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
							<BookOpen className="w-8 h-8 text-white" />
						</div>
						<h3 className="font-bold text-neutral-900 dark:text-white mb-2 text-lg">Study Anywhere</h3>
						<p className="text-neutral-600 dark:text-neutral-400">Access your materials anytime, anywhere on any device</p>
					</div>
				</div>
			</section>
		</BackgroundLines>
	);
}
