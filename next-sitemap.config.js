const { PrismaClient } = require('@prisma/client');

function getSiteUrl() {
  const rawSiteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://notesninja.in';
  const matchedUrl = rawSiteUrl.match(/https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:\/[^\s]*)?/);
  const parsed = matchedUrl ? matchedUrl[0] : 'https://notesninja.in';
  return parsed.replace(/\/+$/, '');
}

function normalizePath(path = '') {
  if (!path) return '';
  return path
    .trim()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

function flattenCategoryPaths(categories = []) {
  const paths = [];

  const walk = (nodes = []) => {
    for (const category of nodes) {
      const categoryPath = normalizePath(category.path || category.slug || '');
      if (categoryPath) {
        paths.push({
          loc: `/${categoryPath}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: category.updatedAt || new Date().toISOString(),
        });
      }

      if (Array.isArray(category.children) && category.children.length > 0) {
        walk(category.children);
      }
    }
  };

  walk(categories);
  return paths;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: getSiteUrl(),
  generateRobotsTxt: true,
  exclude: [
    '/admin',
    '/admin/*',
    '/dashboard',
    '/dashboard/*',
    '/debug',
    '/debug/*',
    '/loading-demo',
    '/api/*',
    '/auth/*',
    '/login',
    '/register',
    '/signup',
    '/unauthorized',
    '/articles/create',
    '/pdp/*'
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
  additionalPaths: async () => {
    const prisma = new PrismaClient();
    const paths = [];

    try {
      // 1) Category pages
      const categories = await prisma.category.findMany({
        where: { parentId: null },
        select: {
          slug: true,
          path: true,
          updatedAt: true,
          children: {
            select: {
              slug: true,
              path: true,
              updatedAt: true,
              children: {
                select: {
                  slug: true,
                  path: true,
                  updatedAt: true,
                  children: {
                    select: {
                      slug: true,
                      path: true,
                      updatedAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      paths.push(...flattenCategoryPaths(categories));

      // 2) Product detail pages (SEO URLs)
      const products = await prisma.post.findMany({
        where: {
          slug: { not: null },
        },
        select: {
          slug: true,
          updatedAt: true,
          category: {
            select: {
              slug: true,
              path: true,
            },
          },
        },
      });

      const productUrlSet = new Set();
      for (const product of products) {
        const slug = normalizePath(product.slug || '');
        const categoryPath = normalizePath(product.category?.path || product.category?.slug || '');
        if (!slug || !categoryPath) continue;

        const loc = `/${categoryPath}/${slug}`;
        if (productUrlSet.has(loc)) continue;
        productUrlSet.add(loc);

        paths.push({
          loc,
          changefreq: 'weekly',
          priority: 0.9,
          lastmod: product.updatedAt || new Date().toISOString(),
        });
      }

      // 3) Published article pages
      const articles = await prisma.article.findMany({
        where: {
          published: true,
        },
        select: {
          slug: true,
          updatedAt: true,
          publishedAt: true,
        },
      });

      const articleUrlSet = new Set();
      for (const article of articles) {
        const slug = normalizePath(article.slug || '');
        if (!slug) continue;

        const loc = `/articles/${slug}`;
        if (articleUrlSet.has(loc)) continue;
        articleUrlSet.add(loc);

        paths.push({
          loc,
          changefreq: 'weekly',
          priority: 0.85,
          lastmod: article.updatedAt || article.publishedAt || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn('Could not build dynamic sitemap paths:', error.message);
    } finally {
      await prisma.$disconnect();
    }

    return paths;
  },
};
