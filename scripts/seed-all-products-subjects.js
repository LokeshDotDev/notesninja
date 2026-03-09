// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

// Debug: Check if DATABASE_URL is loaded
console.log('🔍 DATABASE_URL loaded:', process.env.DATABASE_URL ? '✅ Yes' : '❌ No');

const prisma = new PrismaClient();

// CONFIGURATION: Add your products and subjects here
// Format: "Product Name": ["Subject 1", "Subject 2", "Subject 3"]
const PRODUCTS_AND_SUBJECTS = {
  // BBA Programs
  "BBA SEM 1": [
    "BUSINESS AND MANAGEMENT FUNCTIONS",
    "ENTREPRENEURSHIP AND INNOVATION MANAGEMENT",
    "FINANCIAL ACCOUNTING",
    "MICROECONOMICS",
    "OFFICE AUTOMATION TOOLS",
    "UNIVERSAL HUMAN VALUES"
  ],
  "BBA SEM 2": [
    "BUSINESS COMMUNICATION",
    "COMMUNITY DEVELOPMENT",
    "FINANCIAL MANAGEMENT",
    "INTRODUCTION TO PYTHON",
    "MACROECONOMICS",
    "ORGANIZATIONAL BEHAVIOUR",
    "STATISTICS FOR MANAGERS"
  ],
  "BBA SEM 3": [
    "ADVERTISING AND SALES",
    "CORPORATE LAWS",
    "MANAGEMENT ACCOUNTING",
    "QUANTITATIVE TECHNIQUES FOR MANAGEMENT",
    "RURAL MARKETING"
  ],
  "BBA SEM 4": [
    "BUSINESS STRATEGY",
    "ENVIRONMENT SCIENCE",
    "INTERNATIONAL MARKETING",
    "MANAGEMENT ACCOUNTING",
    "MANAGEMENT INFORMATION SYSTEM",
    "RURAL MARKETING"
  ],
  "BBA SEM 5": [
    "BUSINESS ANALYTICS",
    "BUYING",
    "CONSUMER BEHAVIOUR",
    "LOGISTICS MANAGEMENT",
    "STORE OPERATIONS AND JOB KNOWLEDGE",
    "VISUAL MERCHANDISING",
    "WAREHOUSE MANAGEMENT"
  ],
  "BBA SEM 6": [
    "CUSTOMER RELATIONSHIP MANAGEMENT",
    "DIGITAL MARKETING",
    "MERCHANDISING AND SUPPLY CHAIN MANAGEMENT",
    "MODERN RETAIL MANAGEMENT PROCESS AND RETAIL SERVICES",
    "RETAIL PROJECT PROPERTY MANAGEMENT AND CASE STUDIES IN RETAIL"
  ],

  // B.Com Programs
  "BCOM SEM 1": [
    "BUSINESS ORGANISATION",
    "ECONOMIC THEORY",
    "FUNDAMENTALS OF ACCOUNTING I",
    "GENERAL ENGLISH",
    "PRINCIPLES OF BUSINESS MANAGEMENT"
  ],
  "BCOM SEM 2": [
    "BUSINESS ORGANISATION",
    "ECONOMIC THEORY",
    "FUNDAMENTALS OF ACCOUNTING I",
    "GENERAL ENGLISH",
    "PRINCIPLES OF BUSINESS MANAGEMENT"
  ],
  "BCOM SEM 3": [
    "BUSINESS COMMUNICATION",
    "BUSINESS STATISTICS",
    "COST ACCOUNTING",
    "FINANCIAL MANAGEMENT",
    "FINANCIAL STATEMENT INTERPRETATION"
  ],
  "BCOM SEM 4": [
    "CORPORATE ACCOUNTING",
    "ENVIRONMENTAL SCIENCE",
    "FINANCIAL SERVICES",
    "HUMAN RESOURCE MANAGEMENT",
    "INDIRECT TAXES"
  ],
  "BCOM SEM 5": [
    "E-COMMERCE",
    "INTERNATIONAL TRADE & FINANCE",
    "INVESTMENT OPTIONS AND MUTUAL FUNDS",
    "MANAGEMENT ACCOUNTING",
    "MONEY AND BANKING"
  ],
  "BCOM SEM 6": [
    "BUSINESS ENVIRONMENT",
    "DIRECT TAXES",
    "ENTREPRENEURSHIP DEVELOPMENT",
    "PRINCIPLES AND PRACTICE OF AUDITING"
  ],

  // BCA Programs
  "BCA SEM 1": [
    "C PROGRAMMING",
    "ENVIRONMENTAL SCIENCE",
    "FUNDAMENTAL OF COMPUTER & DIGITAL SYSTEMS",
    "FUNDAMENTAL OF MATHEMATICS",
    "INTRODUCTION TO WEB PROGRAMMING",
    "TECHNICAL COMMUNICATION"
  ],
  "BCA SEM 2": [
    "BASIC STATISTICS AND PROBABILITY",
    "DATA STRUCTURES",
    "DATABASE MANAGEMENT SYSTEM",
    "OBJECT ORIENTED PROGRAMMING USING C++",
    "PRINCIPAL PROGRAMMING LANGUAGES"
  ],
  "BCA SEM 3": [
    "ARTIFICIAL INTELLIGENCE",
    "DATA COMMUNICATION & PROTOCOLS",
    "JAVA PROGRAMMING",
    "OPERATING SYSTEMS"
  ],
  "BCA SEM 4": [
    "COMPUTER NETWORKING",
    "PRINCIPAL OF FINANCIAL ACCOUNTING AND MANAGEMENT",
    "SYSTEM SOFTWARE"
  ],
  "BCA SEM 5": [
    "E-COMMERCE",
    "SOFTWARE ENGINEERING",
    "VISUAL PROGRAMMING",
    "WEB DESIGN"
  ],
  "BCA SEM 6": [
    "ADVANCED WEB DESIGN",
    "MOBILE APPLICATION DEVELOPMENT",
    "SOFTWARE PROJECT MANAGEMENT"
  ],

  // M.Com Programs
  "MCOM SEM 1": [
    "BUSINESS AND ECONOMIC LAWS",
    "COST ANALYSIS & CONTROL",
    "FINANCIAL ACCOUNTING & REPORTING",
    "FINANCIAL MANAGEMENT",
    "MANAGEMENT CONCEPTS & ORGANISATIONAL BEHAVIOUR",
    "MANAGERIAL ECONOMIC"
  ],
  "MCOM SEM 2": [
    "BUSINESS ENVIRONMENT",
    "MANAGEMENT ACCOUNTING",
    "MANAGEMENT OF FINANCIAL INSTITUTIONS, MARKET AND SERVICE",
    "MARKETING MANAGEMENT",
    "PROJECT PLANNING, APPRAISAL & CONTROL",
    "RESEARCH METHODOLOGY AND STATISTICAL ANALYSIS"
  ],
  "MCOM SEM 3": [
    "CORPORATE TAX LAWS & PLANNING",
    "E-COMMERCE",
    "INTERNATIONAL BUSINESS",
    "MANAGEMENT INFORMATION SYSTEM",
    "SECURITY ANALYSIS AND PORTFOLIO MANAGEMENT",
    "STRATEGIC MANAGEMENT"
  ],
  "MCOM SEM 4": [
    "ADVANCED CORPORATE ACCOUNTING",
    "AUDIT & ASSURANCE",
    "BUSINESS ETHICS AND CORPORATE GOVERNANCE",
    "INDIRECT TAXES",
    "RISK MANAGEMENT"
  ],

  // MA Economics Programs
  "MA IN ECONOMICS – SEM 1": [
    "FUNDAMENTAL OF MATHEMATICS AND STATISTICS",
    "INDIAN ECONOMY",
    "MACROECONOMICS-I",
    "MICROECONOMICS-I",
    "PUBLIC ECONOMICS AND POLICY"
  ],
  "MA IN ECONOMICS – SEM 2": [
    "ECONOMICS OF INNOVATION AND ENTREPRENEURSHIP",
    "HISTORY OF ECONOMIC THOUGHT",
    "INTERMEDIATE ECONOMETRICS",
    "MACROECONOMICS-II",
    "MICROECONOMICS-II"
  ],

  // MAJMC Programs
  "MAJMC SEM 1": [
    "BASICS OF AUDIO & VISUAL COMMUNICATION",
    "BASIC OF LANGUAGE",
    "COMMUNICATION THEORIES & MODELS",
    "CONCEPTS OF NEWS & REPORTING",
    "DEVELOPMENT OF MEDIA",
    "FUNDAMENTAL OF PHOTOGRAPHY",
    "SOCIAL STRUCTURE & CURRENT AFFAIRS"
  ],
  "MAJMC SEM 2": [
    "BROADCAST JOURNALISM",
    "DEVELOPMENT COMMUNICATION",
    "DIGITAL PUBLISHING",
    "EDITING & LAYOUT DESIGNING",
    "MEDIA LANGUAGE",
    "MEDIA LAW AND ETHICS",
    "POLITICAL STRUCTURE & CURRENT AFFAIRS",
    "PUBLIC RELATIONS"
  ],
  "MAJMC SEM 3": [
    "ADVERTISING THEORY & PRACTICE",
    "BEATS OF JOURNALISM",
    "COMMUNICATION RESEARCH",
    "CORPORATE COMMUNICATION",
    "INTER CULTURE COMMUNICATION & CURRENT AFFAIRS",
    "MOBILE EDITING SOFTWARE",
    "WRITING FOR NEW MEDIA"
  ],
  "MAJMC SEM 4": [
    "BASICS OF AUDIO & VIDEO EDITING",
    "ECONOMIC STRUCTURE & CURRENT AFFAIRS",
    "FILM APPRECIATION",
    "SCRIPT & SCREEN WRITING"
  ],

  // MCA Programs
  "MCA SEM 1": [
    "DATA VISUALIZATION",
    "DISCRETE MATHEMATICS AND GRAPH THEORY",
    "FUNDAMENTAL OF MATHEMATICS",
    "FUNDAMENTALS OF COMPUTER & IT",
    "PRE SEMESTER INTRODUCTORY MATERIAL",
    "PROGRAMMING & PROBLEM SOLVING USING C",
    "PYTHON PROGRAMMING",
    "RELATIONAL DATABASE MANAGEMENT SYSTEM"
  ],
  "MCA SEM 2": [
    "COMPUTER ARCHITECTURE",
    "COMPUTER NETWORKS & PROTOCOLS",
    "CYBER SECURITY ESSENTIALS",
    "DATA STRUCTURES AND ALGORITHMS",
    "OBJECT ORIENTED PROGRAMMING USING JAVA",
    "OPERATING SYSTEM"
  ],
  "MCA SEM 3": [
    "AI FOR WEB APPLICATIONS",
    "MACHINE LEARNING",
    "SOFTWARE ENGINEERING & PROJECT MANAGEMENT",
    "UNIX & SHELL PROGRAMMING",
    "WEB TECHNOLOGY"
  ],
  "MCA SEM 4": [
    "ADVANCED WEB PROGRAMMING"
  ],

  // MBA Programs
  "MBA SEM 1": [
    "BUSINESS COMMUNICATION",
    "DATA VISUALIZATION",
    "ENTREPRENEURIAL PRACTICE",
    "FINANCIAL ACCOUNTING",
    "MANAGERIAL ECONOMICS",
    "MARKETING MANAGEMENT",
    "ORGANIZATIONAL BEHAVIOUR"
  ],
  "MBA SEM 2": [
    "BUSINESS COMMUNICATION(VAC)",
    "BUSINESS RESEARCH METHODS",
    "FINANCIAL MANAGEMENT",
    "HUMAN RESOURCE MANAGEMENT",
    "LEGAL ASPECT OF BUSINESS",
    "MANAGEMENT ACCOUNTING",
    "OPERATION MANAGEMENT"
  ],

  // MBA Sem 3 Specializations
  "MBA SEM 3 - ANALYTICS AND DATA SCIENCE": [
    "ANALYTICS & DATA SCIENCE",
    "ENTREPRENEURIAL PRACTICES",
    "EXPLORATORY DATA ANALYSIS",
    "INTRODUCTION TO MACHINE LEARNING",
    "LEGAL ASPECTS OF BUSINESS",
    "PROGRAMMING IN DATA SCIENCE",
    "VISUALIZATION"
  ],
  "MBA SEM 3 – BANKING FINANCIAL SERVICES": [
    "BANK MANAGEMENT & FINANCIAL RISK MANAGEMENT",
    "ENTREPRENEURIAL PRACTICES",
    "FINANCIAL SERVICES",
    "FINANCIAL STATEMENT ANALYSIS & BUSINESS VALUATION",
    "LEGAL ASPECTS OF BUSINESS",
    "PRINCIPLES & PRACTICES OF INSURANCE"
  ],
  "MBA SEM 3 – FINANCE": [
    "ENTREPRENEURIAL PRACTICES",
    "INTERNAL AUDIT & CONTROL",
    "LEGAL ASPECTS OF BUSINESS",
    "MERGERS & ACQUISITIONS",
    "SECURITY ANALYSIS AND PORTFOLIO MANAGEMENT",
    "TAXATION MANAGEMENT"
  ],
  "MBA SEM 3 – HUMAN RESOURCES": [
    "EMPLOYEE RELATIONS MANAGEMENT",
    "ENTREPRENEURIAL PRACTICES",
    "HR AUDIT",
    "LEGAL ASPECTS OF BUSINESS",
    "MANAGEMENT & ORGANIZATIONAL DEVELOPMENT",
    "MANPOWER PLANNING & SOURCING"
  ],
  "MBA SEM 3 – INFORMATION SYSTEM MANAGEMENT": [
    "BUSINESS INTELLIGENCE AND TOOLS",
    "COMPUTER NETWORKS",
    "DATABASE MANAGEMENT SYSTEMS",
    "ENTREPRENEURIAL PRACTICES",
    "LEGAL ASPECTS OF BUSINESS",
    "SOFTWARE ENGINEERING"
  ],
  "MBA SEM 3 – INTERNATIONAL BUSINESS": [
    "ENTREPRENEURIAL PRACTICES",
    "EXPORT-IMPORT MANAGEMENT",
    "INTERNATIONAL FINANCIAL MANAGEMENT",
    "INTERNATIONAL MARKETING",
    "LEGAL ASPECTS OF BUSINESS",
    "MANAGEMENT OF MULTINATIONAL CORPORATIONS"
  ],
  "MBA SEM 3 – IT & FINTECH": [
    "BUSINESS INTELLIGENCE AND TOOLS",
    "DATABASE MANAGEMENT SYSTEMS",
    "ENTREPRENEURIAL PRACTICES",
    "LEGAL ASPECTS OF BUSINESS",
    "SOFTWARE ENGINEERING",
    "TECHNOLOGY MANAGEMENT"
  ],
  "MBA SEM 3 – MARKETING": [
    "CONSUMER BEHAVIOUR",
    "ENTREPRENEURIAL PRACTICES",
    "LEGAL ASPECTS OF BUSINESS",
    "MARKETING RESEARCH",
    "RETAIL MARKETING",
    "SALES DISTRIBUTION & SUPPLY CHAIN MANAGEMENT"
  ],
  "MBA SEM 3 – OPERATION MANAGEMENT": [
    "ADVANCED PRODUCTION AND OPERATIONS MANAGEMENT",
    "APPLICATIONS OF OPERATIONS RESEARCH",
    "ENTERPRISE RESOURCE PLANNING",
    "ENTREPRENEURIAL PRACTICES",
    "LEGAL ASPECTS OF BUSINESS",
    "LOGISTICS AND SUPPLY CHAIN MANAGEMENT"
  ],
  "MBA SEM 3 – PROJECT MANAGEMENT": [
    "ENTREPRENEURIAL PRACTICES",
    "INTRODUCTION TO PROJECT MANAGEMENT",
    "LEGAL ASPECTS OF BUSINESS",
    "MANAGING HUMAN RESOURCES IN PROJECTS",
    "PROJECT FINANCE AND BUDGETING",
    "PROJECT PLANNING AND SCHEDULING"
  ],
  "MBA SEM 3 – RETAIL MANAGEMENT": [
    "ADVANCED OPERATIONS MANAGEMENT",
    "ENTERPRISE RESOURCE PLANNING",
    "ENTREPRENEURIAL PRACTICES",
    "IT IN RETAIL",
    "LEGAL ASPECTS OF BUSINESS",
    "RETAIL CUSTOMER RELATIONSHIP MANAGEMENT"
  ],
  "MBA SEM 3 – SUPPLY CHAIN MANAGEMENT": [
    "ENTREPRENEURIAL PRACTICES",
    "FOOD SUPPLY CHAIN MANAGEMENT",
    "INVENTORY MANAGEMENT",
    "LEGAL ASPECTS OF BUSINESS",
    "OUTSOURCING",
    "SUPPLY CHAIN MANAGEMENT"
  ],

  // MBA Sem 4 Specializations
  "MBA SEM 4 – ANALYTICS & DATA SCIENCE": [
    "ADVANCED MACHINE LEARNING",
    "BUSINESS ANALYTICS",
    "BUSINESS LEADERSHIP",
    "DATA SCRAPPING",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY",
    "UNSTRUCTURED DATA ANALYSIS"
  ],
  "MBA SEM 4 – BANKING FINANCIAL SERVICES": [
    "ALM & TREASURY MANAGEMENT",
    "BASEL REGULATIONS & RISK MANAGEMENT IN BANKING",
    "BUSINESS LEADERSHIP",
    "GENERAL INSURANCE MANAGEMENT",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "LIFE INSURANCE MANAGEMENT",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY"
  ],
  "MBA SEM 4 – FINANCE": [
    "BUSINESS LEADERSHIP",
    "INSURANCE AND RISK MANAGEMENT",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "INTERNATIONAL FINANCIAL MANAGEMENT",
    "MERCHANT BANKING AND FINANCIAL SERVICES",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY",
    "TREASURY MANAGEMENT"
  ],
  "MBA SEM 4 – HUMAN RESOURCES": [
    "BUSINESS LEADERSHIP",
    "CHANGE MANAGEMENT",
    "COMPENSATION AND BENEFITS",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "PERFORMANCE MANAGEMENT AND APPRAISAL",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY",
    "TALENT MANAGEMENT AND EMPLOYEE RETENTION"
  ],
  "MBA SEM 4 – INFORMATION SYSTEM MANAGEMENT": [
    "BUSINESS LEADERSHIP",
    "E-COMMERCE",
    "ENTERPRISE RESOURCE PLANNING",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "JAVA AND WEB DESIGN",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY",
    "TECHNOLOGY MANAGEMENT"
  ],
  "MBA SEM 4 – INTERNATIONAL BUSINESS": [
    "BUSINESS LEADERSHIP",
    "EXPORT-IMPORT FINANCE",
    "FOREIGN TRADE OF INDIA",
    "GLOBAL LOGISTICS AND DISTRIBUTION MANAGEMENT",
    "INTERNATIONAL BUSINESS ENVIRONMENT AND INTERNATIONAL LAW",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY"
  ],
  "MBA SEM 4 – IT & FINTECH": [
    "BUSINESS LEADERSHIP",
    "CRYPTOCURRENCY AND BLOCKCHAIN",
    "E-COMMERCE",
    "ENTERPRISE RESOURCE PLANNING",
    "FINTECH PAYMENTS AND REGULATIONS",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY"
  ],
  "MBA SEM 4 – MARKETING": [
    "ADVERTISING MANAGEMENT AND SALES PROMOTION",
    "BUSINESS LEADERSHIP",
    "E-MARKETING",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "INTERNATIONAL MARKETING",
    "SERVICES MARKETING AND CUSTOMER RELATIONSHIP MANAGEMENT",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY"
  ],
  "MBA SEM 4 – OPERATION MANAGEMENT": [
    "ADVANCED PROJECT MANAGEMENT",
    "BUSINESS LEADERSHIP",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "PRODUCTION PLANNING AND CONTROL",
    "SERVICES OPERATIONS MANAGEMENT",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY",
    "TOTAL QUALITY MANAGEMENT"
  ],
  "MBA SEM 4 – PROJECT MANAGEMENT": [
    "BUSINESS LEADERSHIP",
    "CONTRACTS MANAGEMENT IN PROJECTS",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "PROJECT QUALITY MANAGEMENT",
    "PROJECT RISK MANAGEMENT",
    "QUANTITATIVE METHODS IN PROJECT MANAGEMENT",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY"
  ],
  "MBA SEM 4 – RETAIL MANAGEMENT": [
    "BUSINESS LEADERSHIP",
    "ENTREPRENEURSHIP IN RETAIL BUSINESS",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "INTERNATIONAL RETAILING",
    "RETAIL MARKETING ENVIRONMENT",
    "RURAL RETAILING",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY"
  ],
  "MBA SEM 4 – SUPPLY CHAIN MANAGEMENT": [
    "BUSINESS LEADERSHIP",
    "CATEGORY MANAGEMENT IN PURCHASING",
    "GLOBAL LOGISTICS AND SUPPLY CHAIN MANAGEMENT",
    "INTERNATIONAL BUSINESS MANAGEMENT",
    "PURCHASING AND CONTRACTING FOR PROJECTS",
    "STRATEGIC MANAGEMENT & BUSINESS POLICY",
    "SUPPLY CHAIN COST MANAGEMENT"
  ]
};

// PRICING CONFIGURATION
const BUNDLE_PRICE = 3999;
const INDIVIDUAL_SUBJECT_PRICE = 999;

async function seedAllProductSubjects() {
  try {
    console.log('🌱 Starting to seed subjects for all products...\n');

    // Get all products from database
    const allProducts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true
      }
    });

    console.log(`📚 Found ${allProducts.length} products in database\n`);

    let totalSubjectsAdded = 0;
    let totalProductsProcessed = 0;

    // Process each product configuration
    for (const [productTitle, subjects] of Object.entries(PRODUCTS_AND_SUBJECTS)) {
      console.log(`🔍 Looking for product: "${productTitle}"`);
      
      // Find matching product (case-insensitive, partial match)
      const matchingProduct = allProducts.find(product => 
        product.title.toLowerCase().includes(productTitle.toLowerCase()) ||
        productTitle.toLowerCase().includes(product.title.toLowerCase())
      );

      if (!matchingProduct) {
        console.log(`❌ Product not found: "${productTitle}"`);
        console.log(`   Available products: ${allProducts.map(p => p.title).join(', ')}\n`);
        continue;
      }

      console.log(`✅ Found product: "${matchingProduct.title}" (ID: ${matchingProduct.id})`);
      
      // Clear existing subjects for this product
      await prisma.productSubject.deleteMany({
        where: { postId: matchingProduct.id }
      });
      console.log(`🗑️ Cleared existing subjects for this product`);

      // Create bundle subject
      const bundleSubjectId = `${matchingProduct.id}_full_bundle`;
      await prisma.productSubject.create({
        data: {
          postId: matchingProduct.id,
          subjectId: bundleSubjectId,
          name: `Complete Bundle (All ${subjects.length} Subjects)`,
          description: `All ${subjects.length} subjects included at best price`,
          price: BUNDLE_PRICE,
          isBundle: true,
          sortOrder: 0,
          isActive: true
        }
      });
      console.log(`✅ Added bundle: Complete Bundle - ₹${BUNDLE_PRICE}`);

      // Create individual subjects
      for (let i = 0; i < subjects.length; i++) {
        const subjectName = subjects[i];
        const subjectId = `${matchingProduct.id}_${subjectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        
        await prisma.productSubject.create({
          data: {
            postId: matchingProduct.id,
            subjectId: subjectId,
            name: subjectName,
            description: `Complete coverage of ${subjectName}`,
            price: INDIVIDUAL_SUBJECT_PRICE,
            isBundle: false,
            sortOrder: i + 1,
            isActive: true
          }
        });
        
        console.log(`✅ Added subject: ${subjectName} - ₹${INDIVIDUAL_SUBJECT_PRICE}`);
      }

      totalSubjectsAdded += subjects.length + 1; // +1 for bundle
      totalProductsProcessed++;
      console.log(`📊 Added ${subjects.length + 1} subjects to "${matchingProduct.title}"\n`);
    }

    // Summary
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`📊 Summary:`);
    console.log(`   - Products processed: ${totalProductsProcessed}`);
    console.log(`   - Total subjects added: ${totalSubjectsAdded}`);
    console.log(`   - Bundle price: ₹${BUNDLE_PRICE}`);
    console.log(`   - Individual subject price: ₹${INDIVIDUAL_SUBJECT_PRICE}`);
    console.log(`\n✨ All subjects are now active and ready for use!`);

  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to generate subject IDs
function generateSubjectId(productId, subjectName) {
  return `${productId}_${subjectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

// Helper function to preview what will be created
function previewConfiguration() {
  console.log('📋 PREVIEW - Products and Subjects to be created:\n');
  
  for (const [productTitle, subjects] of Object.entries(PRODUCTS_AND_SUBJECTS)) {
    console.log(`📚 Product: "${productTitle}"`);
    console.log(`   Bundle: Complete Bundle (${subjects.length} subjects) - ₹${BUNDLE_PRICE}`);
    subjects.forEach((subject, index) => {
      console.log(`   ${index + 1}. ${subject} - ₹${INDIVIDUAL_SUBJECT_PRICE}`);
    });
    console.log(`   Total: ${subjects.length + 1} subjects\n`);
  }
  
  console.log(`💰 Total value per product: ₹${BUNDLE_PRICE} (bundle) or ₹${INDIVIDUAL_SUBJECT_PRICE * 6} (all individual)`);
  console.log(`💸 Savings with bundle: ₹${INDIVIDUAL_SUBJECT_PRICE * 6 - BUNDLE_PRICE}\n`);
}

// Run the seed function
if (require.main === module) {
  console.log('🚀 Starting Product Subjects Seeding Script\n');
  
  // Show preview first
  previewConfiguration();
  
  // Ask for confirmation (in production, you might want to remove this)
  console.log('⚠️  This will clear existing subjects and create new ones.');
  console.log('👍 Starting in 3 seconds...\n');
  
  setTimeout(() => {
    seedAllProductSubjects();
  }, 3000);
}

module.exports = { seedAllProductSubjects, PRODUCTS_AND_SUBJECTS };
