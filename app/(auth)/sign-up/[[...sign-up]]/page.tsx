import { SignUp } from "@clerk/nextjs";
import React from "react";

export default function Page() {
	return (
		<div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-blue-200 via-blue-400 to-blue-700 relative overflow-hidden'>
			{/* Decorative background shapes */}
			<div
				className='absolute top-0 left-0 w-full h-1/2 bg-gradient-to-tr from-blue-300 via-blue-400 to-blue-600 opacity-80 z-0'
				style={{ clipPath: "ellipse(120% 60% at 50% 0%)" }}
			/>
			<div
				className='absolute bottom-0 right-0 w-2/3 h-1/3 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 opacity-40 z-0'
				style={{ clipPath: "ellipse(80% 60% at 100% 100%)" }}
			/>

			{/* Centered card for sign-in */}
			<div className='relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto px-2 sm:px-0 py-8'>
				<div className='mb-6 flex flex-col items-center mt-10'>
					<h1 className='text-2xl text-center font-bold text-white drop-shadow-lg tracking-tight'>
						Welcome to Elevate Motel Supply
					</h1>
				</div>
				<div className='flex flex-col items-center'>
					<SignUp />
				</div>
			</div>
		</div>
	);
}
