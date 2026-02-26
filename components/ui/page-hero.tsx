import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface HeroSectionProps {
	title: string;
	headline: string;
	description: string;
}

export function PageHero({ title, headline, description }: HeroSectionProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
			className='w-full max-w-4xl flex flex-col items-center justify-center mt-32 mx-auto px-4'>
			<Card className='relative shadow-lg py-3 px-6 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700'>
				<motion.h1
					initial={{ scale: 0.95 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.5 }}
					className='text-2xl font-extrabold text-neutral-900 dark:text-white'>
					{title}
				</motion.h1>
			</Card>
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
				className='text-4xl md:text-5xl lg:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 mt-8'>
				{headline}
			</motion.h2>
			<motion.p
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.4 }}
				className='mt-4 text-lg md:text-xl text-neutral-600 dark:text-neutral-300 text-center max-w-2xl'>
				{description}
			</motion.p>
		</motion.div>
	);
}
