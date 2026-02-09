"use client";

import React, { useState } from "react";
import { FlickeringGrid } from "../magicui/flickering-grid";
import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";

const Projects = () => {
	const loadingStates = [
		{
			text: "Genuine quality — no cut corners, ever",
		},
		{
			text: "Transparent pricing — what you see is what you pay",
		},
		{
			text: "Responsive support — before, during, and after your order",
		},
		{
			text: "Reliable service — because your business depends on it",
		},
	];

	const [loading, setLoading] = useState(false);

	return (
		<div className='mt-10 relative w-full min-h-[20rem] md:min-h-screen flex items-center justify-center'>
			<FlickeringGrid
				className='absolute inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]'
				squareSize={4}
				gridGap={6}
				color='#60A5FA'
				maxOpacity={0.5}
				flickerChance={0.1}
			/>
			<div className='relative z-10 flex flex-col items-center justify-center w-full h-full'>
				<h2 className='bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 font-bold tracking-tight'>
					Our Commitment, <br /> Your Confidence
				</h2>
				<p className='max-w-xl mx-auto p-2 text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center'>
					We may be new, but our values are rock solid. Every product we offer
					is carefully selected to meet the high standards of the hospitality
					industry.
				</p>

				<div className='py-10 flex items-center justify-center'>
					{/* Core Loader Modal */}
					<Loader
						loadingStates={loadingStates}
						loading={loading}
						duration={2000}
					/>

					{/* The buttons are for demo only, remove it in your actual code ⬇️ */}
					<button
						onClick={() => setLoading(true)}
						className='bg-gradient-to-b from-indigo-900 via-indigo-500 to-indigo-300 text-background mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center'
						style={{
							boxShadow:
								"0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
						}}>
						You can expect
					</button>

					{loading && (
						<button
							className='fixed top-24 right-10 sm:top-30 text-black dark:text-white z-[120]'
							onClick={() => setLoading(false)}>
							<IconSquareRoundedX className='h-10 w-10' />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Projects;
