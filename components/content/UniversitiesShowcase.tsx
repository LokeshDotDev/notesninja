"use client";
import { GraduationCap, Users, MapPin, Star } from "lucide-react";
import { UniversityLogoScroller } from "@/components/custom/UniversityLogoScroller";

const stats = [
  {
    icon: GraduationCap,
    value: "15+",
    label: "Top Universities"
  },
  {
    icon: Users,
    value: "1,00,000+",
    label: "University Students"
  },
  {
    icon: MapPin,
    value: "10+",
    label: "Countries"
  },
  {
    icon: Star,
    value: "4.8/5",
    label: "Satisfied Students"
  }
];

export function UniversitiesShowcase() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Students from Top Universities
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our premium study materials are trusted by thousands of students from the world&apos;s leading universities.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* University Logo Scroller */}
        <div className="mb-16">
          <UniversityLogoScroller />
        </div>

        {/* Trust Indicators */}
        {/* <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Join Students from Elite Universities
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our study materials help students excel at the highest academic level
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                of students report improved grades
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">4.8/5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                average satisfaction rating
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                access to purchased materials
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
