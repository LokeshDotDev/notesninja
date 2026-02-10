"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PurchaseDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: {
		id: string;
		title: string;
		price: number;
		isDigital: boolean;
	};
	onPurchaseComplete: (purchase: { id: string; amount: number; status: string }) => void;
}

export default function PurchaseDialog({
	open,
	onOpenChange,
	product,
	onPurchaseComplete,
}: PurchaseDialogProps) {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handlePurchase = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			// Process payment
			const paymentResponse = await fetch("/api/payments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postId: product.id,
					userEmail: email,
					amount: product.price,
				}),
			});

			const paymentData = await paymentResponse.json();

			if (!paymentResponse.ok) {
				throw new Error(paymentData.error || "Payment failed");
			}

			// Create purchase record
			const purchaseResponse = await fetch("/api/purchases", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postId: product.id,
					userEmail: email,
					amount: product.price,
					paymentId: paymentData.paymentId,
				}),
			});

			const purchaseData = await purchaseResponse.json();

			if (!purchaseResponse.ok) {
				throw new Error(purchaseData.error || "Failed to create purchase");
			}

			// Success
			onPurchaseComplete(purchaseData);
			onOpenChange(false);
			setEmail("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Purchase failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-white dark:bg-gray-800 dark:text-white">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						Purchase Digital Product
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handlePurchase} className="space-y-4 mt-4">
					<div>
						<Label className="text-sm font-medium">Product</Label>
						<p className="mt-1 text-lg font-semibold">{product.title}</p>
						<p className="text-2xl font-bold text-green-600">${product.price}</p>
					</div>
					<div>
						<Label className="text-sm font-medium">Email Address</Label>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 dark:bg-gray-700 dark:text-gray-200"
							placeholder="Enter your email address"
							required
						/>
						<p className="text-xs text-gray-500 mt-1">
							Download links will be sent to this email
						</p>
					</div>
					{error && (
						<div className="text-red-500 text-sm">{error}</div>
					)}
					<div className="flex justify-end space-x-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
							className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-green-600 hover:bg-green-700 text-white"
							disabled={isLoading}
						>
							{isLoading ? (
								<div className="flex items-center space-x-2">
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									<span>Processing...</span>
								</div>
							) : (
								`Complete Purchase - $${product.price}`
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
