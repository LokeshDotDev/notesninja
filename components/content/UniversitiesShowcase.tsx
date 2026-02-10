"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, MapPin, Star } from "lucide-react";

const universities = [
  {
    name: "Harvard University",
    location: "Cambridge, MA",
    students: "2,500+",
    rating: 4.9,
    subjects: ["Business", "Law", "Medicine"],
    logo: "/api/placeholder/120/80"
  },
  {
    name: "Stanford University",
    location: "Stanford, CA",
    students: "1,800+",
    rating: 4.8,
    subjects: ["Computer Science", "Engineering", "Business"],
    logo: "/api/placeholder/120/80"
  },
  {
    name: "MIT",
    location: "Cambridge, MA",
    students: "2,200+",
    rating: 4.9,
    subjects: ["Engineering", "Physics", "Mathematics"],
    logo: "/api/placeholder/120/80"
  },
  {
    name: "UCLA",
    location: "Los Angeles, CA",
    students: "3,100+",
    rating: 4.7,
    subjects: ["Arts", "Sciences", "Engineering"],
    logo: "/api/placeholder/120/80"
  },
  {
    name: "University of Michigan",
    location: "Ann Arbor, MI",
    students: "2,800+",
    rating: 4.8,
    subjects: ["Business", "Engineering", "Medicine"],
    logo: "/api/placeholder/120/80"
  },
  {
    name: "UC Berkeley",
    location: "Berkeley, CA",
    students: "2,600+",
    rating: 4.9,
    subjects: ["Computer Science", "Chemistry", "Economics"],
    logo: "/api/placeholder/120/80"
  },
  {
    name: "Yale University",
    location: "New Haven, CT",
    students: "1,500+",
    rating: 4.8,
    subjects: ["Law", "Medicine", "Arts"],
    logo: "/api/placeholder/120/80"
  },
  {
    name: "Princeton University",
    location: "Princeton, NJ",
    students: "1,200+",
    rating: 4.9,
    subjects: ["Mathematics", "Physics", "Economics"],
    logo: "/api/placeholder/120/80"
  }
];

const stats = [
  {
    icon: GraduationCap,
    value: "50+",
    label: "Top Universities"
  },
  {
    icon: Users,
    value: "25,000+",
    label: "University Students"
  },
  {
    icon: MapPin,
    value: "15+",
    label: "Countries"
  },
  {
    icon: Star,
    value: "4.8/5",
    label: "Average Rating"
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
            Our premium study materials are trusted by thousands of students from the world's leading universities.
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

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {universities.map((university, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {university.name}
                </h3>
                
                <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <MapPin className="w-3 h-3 mr-1" />
                  {university.location}
                </div>
                
                <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <Users className="w-3 h-3 mr-1" />
                  {university.students} students
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(university.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    {university.rating}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 justify-center">
                  {university.subjects.slice(0, 2).map((subject, subjectIndex) => (
                    <Badge key={subjectIndex} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {university.subjects.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{university.subjects.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg">
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
        </div>
      </div>
    </section>
  );
}
