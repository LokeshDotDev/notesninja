"use client";
import { motion } from "motion/react";
import { 
  LibraryBig,
  FolderDown,
  BadgeCheck,
  FileClock,
  Handshake,
  ClipboardPenLine,
  ShieldCheck,
  Headphones
} from "lucide-react";
import { cn } from "@/lib/utils";

export function EducationalFeatures() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Why Students Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-600 to-green-400">NotesNinja</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Discover the features that make NotesNinja the preferred choice for ambitious students worldwide
          </p>
        </motion.div>

        {/* Main Features Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-neutral-800/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div> */}

        {/* Additional Benefits */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-8">
            More Reasons to Excel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700/50 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* Success Metrics */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-8">Trusted by the Best</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Active Students</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                <div className="text-blue-100">Study Materials</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
                <div className="text-blue-100">User Rating</div>
              </div>
            </div>
          </div>
        </motion.div> */}

        {/* Features Section Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          {/* <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-12 text-center">
            Platform Excellence
          </h3> */}
          <FeaturesSectionDemo />
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Comprehensive Study Materials",
      description:
        "Access thousands of expertly curated notes, guides, and reference materials across all subjects",
      icon: <LibraryBig />,
    },
    {
      title: "Instant Digital Downloads",
      description:
        "Get your study materials immediately with secure, high-speed downloads available 24/7",
      icon: <FolderDown />,
    },
    {
      title: "Expert-Verified Content",
      description:
        "All materials are reviewed and verified by subject matter experts and top educators",
      icon: <BadgeCheck />,
    },
    {
      title: "100% Save Study Time",
      description: "Reduce preparation time by 100% with organized, easy-to-understand study materials",
      icon: <FileClock />,
    },
    {
      title: "Collaborative Learning",
      description: "Join a community of 50,000+ students sharing insights and study strategies",
      icon: <Handshake />,
    },
    {
      title: "Exam Focused",
      description:
        "Materials specifically designed to help you excel in exams and assessments",
      icon: <ClipboardPenLine />,
    },
    {
      title: "24/7 Support",
      description:
        "Dedicated support team always ready to help you succeed",
      icon: <Headphones />,
    },
    {
      title: "Secure Platform",
      description: "Bank-level security for all your purchases and downloads",
      icon: <ShieldCheck />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
