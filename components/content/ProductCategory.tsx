"use client";

import { Bed, Blinds, Drill, KeyRound, Lamp } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useRouter } from "next/navigation";

export default function ProductCategory() {
	const router = useRouter();

	const handleCategoryClick = (category: string) => {
		router.push(`/${category}`);
	};

	return (
		<>
			<div className='w-full h-0.5 bg-gradient-to-l from-blue-400 via-blue-400 to-blue-700'></div>
			<div className='mx-auto max-w-7xl px-4 pt-32 md:px-10'>
				<ul className='grid grid-cols-1 grid-rows-none gap-4 cursor-pointer md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2'>
					<GridItem
						area='md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]'
						icon={
							<Drill className='h-4 w-4 text-black dark:text-neutral-400' />
						}
						title='Furniture'
						description='Modern, durable furniture designed for comfort and daily use — perfect for guest rooms, lobbies, and lounges.'
						onClick={() => handleCategoryClick("furniture")}
					/>

					<GridItem
						area='md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]'
						icon={<Bed className='h-4 w-4 text-black dark:text-neutral-400' />}
						title='Metal Frame Beds'
						description='Heavy-duty metal beds that offer lasting support, zero maintenance, and a clean, modern look.'
						onClick={() => handleCategoryClick("metal_frame_bed")}
					/>

					<GridItem
						area='md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]'
						icon={
							<KeyRound className='h-4 w-4 text-black dark:text-neutral-400' />
						}
						title='Smart Key Cards'
						description='Secure, contactless access systems that enhance guest safety and streamline your operations.'
						onClick={() => handleCategoryClick("key_and_cover")}
					/>

					<GridItem
						area='md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]'
						icon={
							<Blinds className='h-4 w-4 text-black dark:text-neutral-400' />
						}
						title='Curtains'
						description='Elegant, easy-to-install curtains that elevate room ambiance while offering privacy and light control.'
						onClick={() => handleCategoryClick("curtain")}
					/>

					<GridItem
						area='md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]'
						icon={<Lamp className='h-4 w-4 text-black dark:text-neutral-400' />}
						title='LED Lights & Plugs'
						description='Energy-efficient lighting and modern electrical fittings built for reliability, safety, and style.'
						onClick={() => handleCategoryClick("led_and_plugs")}
					/>
				</ul>
			</div>
		</>
	);
}

interface GridItemProps {
	area: string;
	icon: React.ReactNode;
	title: string;
	description: React.ReactNode;
	onClick: () => void;
}

const GridItem = ({
	area,
	icon,
	title,
	description,
	onClick,
}: GridItemProps) => {
	return (
		<li className={`min-h-[14rem] list-none ${area}`}>
			<div
				className='relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg'
				onClick={onClick}>
				<GlowingEffect
					blur={0}
					borderWidth={3}
					spread={80}
					glow={true}
					disabled={false}
					proximity={64}
					inactiveZone={0.01}
				/>
				<div className='border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]'>
					<div className='relative flex flex-1 flex-col justify-between gap-3'>
						<div className='w-fit rounded-lg border border-gray-600 p-2'>
							{icon}
						</div>
						<div className='space-y-3'>
							<h3 className='-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white'>
								{title}
							</h3>
							<h2 className='font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold'>
								{description}
							</h2>
						</div>
					</div>
				</div>
			</div>
		</li>
	);
};
