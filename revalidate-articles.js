const { revalidateTag } = require('next/cache');

// This script revalidates the articles cache tag
console.log('Revalidating articles cache...');
revalidateTag('articles');
console.log('✅ Articles cache cleared!');
