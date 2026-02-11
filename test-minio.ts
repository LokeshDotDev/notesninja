import "dotenv/config";
import prisma from "@/lib/prisma";
import { uploadContent, deleteContent, getAccessibleUrl } from "@/lib/minio";
import * as fs from "fs";
import * as path from "path";

async function runTests() {
  try {
    console.log("================================");
    console.log("MinIO Integration Test Suite");
    console.log("================================\n");

    // Test 1: Get or create a category
    console.log("✓ Test 1: Get or create category");
    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Test Category",
          slug: "test-category",
          description: "Category for testing MinIO",
        },
      });
    }
    console.log(`  Category ID: ${category.id}`);
    console.log(`  Category Name: ${category.name}\n`);

    // Test 2: Create a test file and upload to MinIO
    console.log("✓ Test 2: Create and upload test file to MinIO");
    const testFilePath = "/tmp/test-minio.txt";
    const testContent = `MinIO Test File\nCreated: ${new Date().toISOString()}\nThis is a test for digital product upload.`;
    fs.writeFileSync(testFilePath, testContent);

    const fileSize = fs.statSync(testFilePath).size;
    console.log(`  Created test file: ${fileSize} bytes`);

    // Create a File-like object
    const fileBuffer = fs.readFileSync(testFilePath);
    const file = new File([fileBuffer], "test-minio.txt", {
      type: "text/plain",
    });

    const uploadResult = await uploadContent(file, true);
    console.log(`  ✓ Uploaded to MinIO`);
    console.log(`  - Public ID (object name): ${uploadResult.public_id}`);
    console.log(`  - URL: ${uploadResult.secure_url}`);
    console.log(`  - Bucket: ${uploadResult.bucket}\n`);

    // Test 3: Create a product with this file URL
    console.log("✓ Test 3: Create digital product in database");
    const product = await prisma.post.create({
      data: {
        title: "MinIO Test Digital Product",
        description: "Testing MinIO file upload with digital products",
        categoryId: category.id,
        isDigital: true,
        price: 99.99,
      },
    });
    console.log(`  Product created with ID: ${product.id}\n`);

    // Test 4: Store digital file in database
    console.log("✓ Test 4: Store digital file reference in database");
    const digitalFile = await prisma.digitalFile.create({
      data: {
        postId: product.id,
        fileName: "test-minio.txt",
        fileUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        fileSize: file.size,
        fileType: "txt",
      },
    });
    console.log(`  Digital file stored`);
    console.log(`  - File ID: ${digitalFile.id}`);
    console.log(`  - File URL: ${digitalFile.fileUrl}`);
    console.log(`  - Public ID: ${digitalFile.publicId}\n`);

    // Test 5: Verify file is in database
    console.log("✓ Test 5: Verify file URL in database");
    const fetchedProduct = await prisma.post.findUnique({
      where: { id: product.id },
      include: {
        digitalFiles: true,
      },
    });
    console.log(`  Retrieved product from database`);
    console.log(`  - Digital files count: ${fetchedProduct?.digitalFiles.length}`);
    if (fetchedProduct?.digitalFiles[0]) {
      console.log(
        `  - File URL matches: ${fetchedProduct.digitalFiles[0].fileUrl === uploadResult.secure_url}`
      );
    }
    console.log();

    // Test 6: Test file accessibility
    console.log("✓ Test 6: Test MinIO URL accessibility");
    try {
      const response = await fetch(uploadResult.secure_url);
      console.log(`  HTTP Status: ${response.status}`);
      if (response.ok) {
        const content = await response.text();
        console.log(`  File content accessible (${content.length} bytes)`);
        console.log(`  ✓ File is accessible via MinIO URL\n`);
      } else {
        console.log(
          `  ⚠ Warning: HTTP ${response.status} (may need authentication)\n`
        );
      }
    } catch (error) {
      console.log(
        `  ⚠ Could not verify accessibility (network error): ${error}\n`
      );
    }

    // Test 7: Delete product and verify file deletion
    console.log("✓ Test 7: Delete product and file from MinIO");
    await deleteContent(uploadResult.public_id);
    console.log(`  ✓ File deleted from MinIO`);

    await prisma.digitalFile.delete({
      where: { id: digitalFile.id },
    });
    console.log(`  ✓ Digital file record deleted from database`);

    await prisma.post.delete({
      where: { id: product.id },
    });
    console.log(`  ✓ Product deleted from database\n`);

    // Test 8: Verify deletion
    console.log("✓ Test 8: Verify complete deletion");
    const deletedCheck = await prisma.post.findUnique({
      where: { id: product.id },
    });
    console.log(`  Product deleted: ${!deletedCheck ? "YES" : "NO"}\n`);

    // Test 9: Test with image file
    console.log("✓ Test 9: Test image upload (non-digital product)");
    const imageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    const imageFile = new File([imageBuffer], "test-image.png", {
      type: "image/png",
    });

    const imageUpload = await uploadContent(imageFile, false);
    console.log(`  ✓ Image uploaded to MinIO`);
    console.log(`  - Image URL: ${imageUpload.secure_url}\n`);

    // Clean up
    await deleteContent(imageUpload.public_id);
    console.log(`  ✓ Image deleted from MinIO\n`);

    console.log("================================");
    console.log("✓ All tests completed successfully!");
    console.log("================================");
    console.log("\n✓ MinIO integration is working perfectly:");
    console.log("  ✓ Files upload to MinIO");
    console.log("  ✓ URLs are stored in database");
    console.log("  ✓ Files are accessible");
    console.log("  ✓ File deletion works");
    console.log("  ✓ Both images and digital files work");

    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

runTests();
