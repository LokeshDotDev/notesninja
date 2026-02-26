/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://notesninja.in',
  generateRobotsTxt: true,
  exclude: [
    '/admin', 
    '/dashboard', 
    '/debug', 
    '/loading-demo',
    '/api/admin',
    '/api/debug',
    '/auth/callback',
    '/auth/error'
  ],
  transform: async (config, path) => {
    // Custom priority for different page types
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    
    // Category pages get high priority
    if (path.startsWith('/') && !path.includes('/api/') && !path.includes('/auth/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    
    // Default transformation
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => {
    const paths = [];
    
    try {
      // Fetch categories from your API
      const response = await fetch(`${config.siteUrl}/api/categories`);
      const categories = await response.json();
      
      // Add category paths
      function addCategoryPaths(cats, basePath = '') {
        cats.forEach(category => {
          const categoryPath = basePath ? `${basePath}/${category.slug}` : `/${category.slug}`;
          paths.push({
            loc: categoryPath,
            changefreq: 'weekly',
            priority: basePath ? 0.7 : 0.8, // Subcategories get slightly lower priority
            lastmod: category.updatedAt || new Date().toISOString(),
          });
          
          // Add children recursively
          if (category.children && category.children.length > 0) {
            addCategoryPaths(category.children, categoryPath);
          }
        });
      }
      
      addCategoryPaths(categories);
      
    } catch (error) {
      console.warn('Could not fetch categories for sitemap:', error.message);
    }
    
    return paths;
  },
};
