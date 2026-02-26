// Helper function to send purchase confirmation emails
export async function sendPurchaseConfirmationEmail(
  userEmail: string,
  productTitle: string,
  purchaseId: string,
  downloadLinks: Array<{ fileName: string; fileUrl: string }>,
  price?: number,
  compareAtPrice?: number
) {
  try {
    // Use NEXT_PUBLIC_APP_URL, fallback to NEXT_PUBLIC_BASE_URL, then localhost
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const emailUrl = `${baseUrl}/api/send-email`;
    
    console.log('Sending email via:', emailUrl);
    
    const response = await fetch(emailUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userEmail,
        customerName: userEmail.split('@')[0], // Extract name from email
        productName: productTitle,
        price: price,
        compareAtPrice: compareAtPrice,
        downloadLinks: downloadLinks.map(link => ({
          fileName: link.fileName,
          fileUrl: link.fileUrl,
          fileSize: 1000000, // Mock file size
          fileType: 'PDF'
        }))
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to send email: ${response.status} ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    throw error;
  }
}
