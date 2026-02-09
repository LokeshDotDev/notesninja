"use client";
import { ContainerTextFlip } from "../ui/container-text-flip";
import settings from "@/lib/settings";
import { AuroraBackground } from "../ui/aurora-background";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtm from "@/lib/gtm";

export function HeroSection() {
	const pathname = usePathname();

	useEffect(() => {
		gtm.pageview(pathname);
	}, [pathname]);

	return (
		<AuroraBackground>
			<section className='relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-12 text-center'>
				<h1 className='text-3xl font-bold text-neutral-900 dark:text-white md:text-5xl lg:text-6xl leading-tight max-w-4xl mx-auto'>
					Premium US Hospitality Solutions That Impress and{" "}
					<span className='flex justify-center items-center mt-2'>
						<ContainerTextFlip
							className='h-16 text-3xl md:text-5xl lg:text-6xl flex justify-center items-center text-primary my-2'
							words={["Last", "Endure", "Perform", "Satisfy", "Deliver"]}
						/>
					</span>
				</h1>

				<p className='mt-6 max-w-2xl text-base text-neutral-800 dark:text-neutral-200 md:text-lg lg:text-xl'>
					At Elevate Motel Supply, we deliver more than just products :{" "}
					<strong>
						<br />
						1.Bulk pricing 2.Industry grade durability 3.Fast shipping—USA-wide
					</strong>
				</p>

				<div className='mt-10 flex flex-wrap justify-center gap-4'>
					<a
						href={settings.whatsapp.url()}
						className='group inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-white font-semibold text-lg shadow transition-all duration-300 hover:text-white hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 [transition-property:background,color,box-shadow] [transition-delay:0s] group-hover:[transition-delay:1s] group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:via-blue-500 group-hover:to-primary'
						target='_blank'
						rel='noopener noreferrer'>
						<span className='font-semibold'>Request a Quote</span>
					</a>
				</div>
			</section>
		</AuroraBackground>
	);
}
