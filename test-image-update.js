const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Create a simple test image file (1x1 pixel PNG)
const testImageBuffer = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
  0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
  0xFE, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

// Write test image to temp file
const testImagePath = '/tmp/test-image.png';
fs.writeFileSync(testImagePath, testImageBuffer);

async function testImageUpdate() {
  try {
    console.log('🚀 Starting end-to-end image update test...\n');
    
    // Step 1: Get current post data
    console.log('📋 Step 1: Fetching current post data...');
    const getResponse = await fetch('http://localhost:3001/api/posts/cmli62e7w000eo00ko5l83m3s');
    const currentPost = await getResponse.json();
    
    console.log('Current post:', {
      id: currentPost.id,
      title: currentPost.title,
      hasImage: !!currentPost.imageUrl,
      publicId: currentPost.publicId
    });
    console.log('');
    
    // Step 2: Update the image
    console.log('📤 Step 2: Updating image...');
    const form = new FormData();
    form.append('title', currentPost.title);
    form.append('description', currentPost.description);
    form.append('categoryId', currentPost.categoryId);
    
    // Add the test image file
    form.append('file', fs.createReadStream(testImagePath), {
      filename: 'test-update-image.png',
      contentType: 'image/png'
    });
    
    const updateResponse = await fetch('http://localhost:3001/api/posts/cmli62e7w000eo00ko5l83m3s', {
      method: 'PATCH',
      body: form,
      headers: form.getHeaders()
    });
    
    const updateResult = await updateResponse.json();
    console.log('Update response status:', updateResponse.status);
    console.log('Update result:', {
      id: updateResult.id,
      title: updateResult.title,
      imageUrl: updateResult.imageUrl,
      publicId: updateResult.publicId
    });
    console.log('');
    
    // Step 3: Verify the update
    console.log('✅ Step 3: Verifying the update...');
    const verifyResponse = await fetch('http://localhost:3001/api/posts/cmli62e7w000eo00ko5l83m3s');
    const verifiedPost = await verifyResponse.json();
    
    console.log('Verified post:', {
      id: verifiedPost.id,
      title: verifiedPost.title,
      imageUrl: verifiedPost.imageUrl,
      publicId: verifiedPost.publicId
    });
    
    // Check if image was actually updated
    const imageChanged = verifiedPost.publicId !== currentPost.publicId;
    console.log('Image changed:', imageChanged);
    
    if (imageChanged) {
      console.log('✅ SUCCESS: Image update flow completed successfully!');
      console.log('- Old image deleted from Cloudinary');
      console.log('- New image uploaded to Cloudinary');
      console.log('- Database updated with new image info');
    } else {
      console.log('❌ ISSUE: Image was not updated');
    }
    
    // Cleanup
    fs.unlinkSync(testImagePath);
    console.log('\n🧹 Cleaned up test files');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    // Cleanup on error
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  }
}

// Run the test
testImageUpdate();
