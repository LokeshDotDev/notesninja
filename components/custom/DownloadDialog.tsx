"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Download, Mail } from "lucide-react";

interface DownloadDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	purchaseId: string;
	userEmail: string;
}

export default function DownloadDialog({
	open,
	onOpenChange,
	purchaseId,
	userEmail,
}: DownloadDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [downloadLinks, setDownloadLinks] = useState<Array<{id: string; fileName: string; fileUrl: string; fileSize: number; fileType: string}>>([]);
	const [error, setError] = useState("");
	const [productTitle, setProductTitle] = useState("");

	const handleGetDownloads = async () => {
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch(
				`/api/downloads?purchaseId=${purchaseId}&userEmail=${userEmail}`
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to get download links");
			}

			setDownloadLinks(data.downloadLinks);
			setProductTitle(data.productTitle);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Download failed");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDownload = (fileId: string, fileName: string) => {
		// Construct secure download URL
		const downloadUrl = `/api/download?fileId=${fileId}&fileName=${encodeURIComponent(fileName)}&purchaseId=${purchaseId}&userEmail=${encodeURIComponent(userEmail)}`;
		
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-white dark:bg-gray-800 dark:text-white">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						Download Your Digital Files
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 mt-4">
					{productTitle && (
						<div>
							<p className="text-sm text-gray-600">Product:</p>
							<p className="font-semibold">{productTitle}</p>
						</div>
					)}

					{downloadLinks.length === 0 ? (
						<div className="text-center py-8">
							<div className="mb-4">
								<Mail className="h-12 w-12 text-blue-500 mx-auto" />
							</div>
							<p className="text-gray-600 mb-4">
								Click below to access your download links
							</p>
							<Button
								onClick={handleGetDownloads}
								disabled={isLoading}
								className="bg-blue-600 hover:bg-blue-700 text-white"
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
										<span>Loading...</span>
									</div>
								) : (
									"Get Download Links"
								)}
							</Button>
						</div>
					) : (
						<div>
							<p className="text-sm text-gray-600 mb-4">
								Your files are ready for download:
							</p>
							<div className="space-y-2">
								{downloadLinks.map((file, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										<div>
											<p className="font-medium">{file.fileName}</p>
											<p className="text-sm text-gray-500">
												{(file.fileSize / 1024 / 1024).toFixed(2)} MB • {file.fileType.toUpperCase()}
											</p>
										</div>
										<Button
											onClick={() => handleDownload(file.id, file.fileName)}
											size="sm"
											className="bg-green-600 hover:bg-green-700 text-white"
										>
											<Download className="h-4 w-4 mr-2" />
											Download
										</Button>
									</div>
								))}
							</div>
							<p className="text-xs text-gray-500 mt-4">
								Download links have also been sent to your email: {userEmail}
							</p>
						</div>
					)}

					{error && (
						<div className="text-red-500 text-sm text-center">{error}</div>
					)}

					<div className="flex justify-end pt-4">
						<Button
							onClick={() => onOpenChange(false)}
							variant="outline"
							className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Close
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
