"use client";
import { motion } from "motion/react";
import { ChevronRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const productCategories = [
  {
    icon: BookOpen,
    title: "MBA Study Materials",
    description: "Master of Business Administration notes, case studies, and exam resources",
    materials: 245,
    gradient: "from-blue-500 to-cyan-500",
    image: "/assets/courses logo/mba.png",
    slug: "online-manipal-university/notes-and-mockpaper/mba",
    originalPrice: "₹5,999",
    discountedPrice: "₹3,999"
  },
  {
    icon: BookOpen,
    title: "BBA Study Materials",
    description: "Bachelor of Business Administration notes, assignments, and study guides",
    materials: 189,
    gradient: "from-purple-500 to-pink-500",
    image: "/assets/courses logo/bba.png",
    slug: "online-manipal-university/notes-and-mockpaper/bba",
    originalPrice: "₹5,999",
    discountedPrice: "₹3,999"
  },
  {
    icon: BookOpen,
    title: "MCA Study Materials",
    description: "Master of Computer Applications programming notes, algorithms, and projects",
    materials: 156,
    gradient: "from-green-500 to-emerald-500",
    image: "/assets/courses logo/mca.png",
    slug: "online-manipal-university/notes-and-mockpaper/mca",
    originalPrice: "₹5,999",
    discountedPrice: "₹3,999"
  },
  {
    icon: BookOpen,
    title: "BCA Study Materials",
    description: "Bachelor of Computer Applications notes, practical files, and resources",
    materials: 134,
    gradient: "from-orange-500 to-red-500",
    image: "/assets/courses logo/bca.png",
    slug: "online-manipal-university/notes-and-mockpaper/bca",
    originalPrice: "₹5,999",
    discountedPrice: "₹3,999"
  },
  {
    icon: BookOpen,
    title: "MA Economics Study Materials",
    description: "Master of Arts in Economics notes, economic theories, and research papers",
    materials: 98,
    gradient: "from-indigo-500 to-purple-500",
    image: "/assets/courses logo/MA- Economics.webp",
    slug: "online-manipal-university/notes-and-mockpaper/maeco",
    originalPrice: "₹5,999",
    discountedPrice: "₹3,999"
  },
  {
    icon: BookOpen,
    title: "MCOM Study Materials",
    description: "Master of Commerce advanced accounting, finance, and business studies",
    materials: 85,
    gradient: "from-indigo-500 to-blue-500",
    image: "/assets/courses logo/mcom.png",
    slug: "online-manipal-university/notes-and-mockpaper/mcom",
    originalPrice: "₹5,999",
    discountedPrice: "₹3,999"
  },
  {
    icon: BookOpen,
    title: "BCOM Study Materials",
    description: "Bachelor of Commerce accounting, business law, and financial management",
    materials: 120,
    gradient: "from-teal-500 to-cyan-500",
    image: "/assets/courses logo/bcom.png",
    slug: "online-manipal-university/notes-and-mockpaper/bcom",
    originalPrice: "₹5,999",
    discountedPrice: "₹3,999"
  },
  {
    icon: BookOpen,
    title: "MAJMC Study Materials",
    description: "Master of Arts in Journalism & Mass Communication media studies and resources",
    materials: 67,
    gradient: "from-pink-500 to-rose-500",
    image: "/assets/courses logo/majmc.png",
    slug: "online-manipal-university/notes-and-mockpaper/majmc",
    originalPrice: "₹5,999",
    discountedPrice: "₹3,999"
  }
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Medical Student",
    university: "Harvard Medical School • Medicine",
    content: "NotesNinja completely transformed my study routine. The medical materials are comprehensive and perfectly structured for exam preparation. I scored in the top 5% of my class!",
    initials: "SJ",
    gradient: "from-blue-600 to-purple-600",
    badge: { text: "Top 5% Class Rank", color: "bg-green-100 text-green-800" },
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Computer Science Major",
    university: "MIT • Computer Science",
    content: "The programming notes and algorithm explanations are crystal clear. I went from struggling with data structures to acing my technical interviews. Worth every penny!",
    initials: "MC",
    gradient: "from-purple-600 to-pink-600",
    badge: { text: "FAANG Offer", color: "bg-green-100 text-green-800" },
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Biology Student",
    university: "Stanford University • Biology",
    content: "The biology materials are exceptional - from molecular biology to ecology. The diagrams and explanations made complex topics so much easier to understand.",
    initials: "ER",
    gradient: "from-green-600 to-emerald-600",
    badge: { text: "4.0 GPA", color: "bg-green-100 text-green-800" },
    rating: 5
  },
  {
    id: 4,
    name: "David Kim",
    role: "MBA Student",
    university: "Wharton Business School • MBA",
    content: "Outstanding business case studies and management theories. The practical examples helped me secure a summer internship at a top consulting firm.",
    initials: "DK",
    gradient: "from-indigo-600 to-blue-600",
    badge: { text: "Dean's List", color: "bg-green-100 text-green-800" },
    rating: 5
  },
  {
    id: 5,
    name: "Jessica Martinez",
    role: "Journalism Student",
    university: "Columbia Journalism School • Media",
    content: "The journalism resources are top-notch. From media ethics to investigative reporting techniques - everything is covered in depth.",
    initials: "JM",
    gradient: "from-pink-600 to-rose-600",
    badge: { text: "Award Winner", color: "bg-green-100 text-green-800" },
    rating: 5
  },
  {
    id: 6,
    name: "Alex Thompson",
    role: "Economics Student",
    university: "London School of Economics • Economics",
    content: "The economics notes are phenomenal. Complex theories explained with real-world examples made all the difference in my understanding.",
    initials: "AT",
    gradient: "from-orange-600 to-red-600",
    badge: { text: "First Class Honors", color: "bg-green-100 text-green-800" },
    rating: 5
  }
];

export function SubjectShowcase() {
  const [, setCurrentTestimonial] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 12000); // Change every 12 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (slug: string) => {
    router.push(`/${slug}`);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-neutral-50 to-white dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* University Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
        </motion.div>

        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent mb-1">
            Professional Study Materials for 
            <br />
            Online Manipal University 
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-4xl mx-auto mb-8 leading-relaxed">
            Access high-quality study materials for MBA, BBA, MCA, BCA, MAECO, BCOM, MCOM, and MAJMC
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              8 Courses
            </span>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-700">
              Instant Downloads
            </span>
            <span className="text-sm font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700">
              Expert Verified
            </span>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {productCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Card 
                className="h-full group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 border border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-800/80 backdrop-blur-xl relative overflow-hidden rounded-3xl p-0 cursor-pointer"
                onClick={() => handleCardClick(category.slug)}
              >  
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden rounded-t-3xl bg-neutral-100 dark:bg-neutral-900">
                  <Image 
                    src={category.image} 
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                                    
                </div>
                
                <CardContent className="p-8 space-y-4">
                  
                  <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
                    {category.title}
                  </h3>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                    {category.description}
                  </p>
                  
                  
                  <Button 
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-700"
                  >
                    Browse Collection
                    <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
         
        </motion.div>

       
      </div>
    </section>
  );
}
