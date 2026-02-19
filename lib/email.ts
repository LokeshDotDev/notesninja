// Helper function to send purchase confirmation emails
export async function sendPurchaseConfirmationEmail(
  userEmail: string,
  productTitle: string,
  purchaseId: string,
  downloadLinks: Array<{ fileName: string; fileUrl: string }>
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        customerName: userEmail.split('@')[0], // Extract name from email
        productName: productTitle,
        downloadLinks: downloadLinks.map(link => ({
          fileName: link.fileName,
          fileUrl: link.fileUrl,
          fileSize: 1000000, // Mock file size
          fileType: 'PDF'
        }))
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send purchase confirmation email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    throw error;
  }
}
