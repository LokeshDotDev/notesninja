import React from "react";
import {
    BookOpen,
    Download,
    FileText,
    GraduationCap,
    PenTool,
    Library,
    Brain,
    Coffee,
    Target,
    Award,
    CheckCircle,
    Notebook
} from "lucide-react";

export const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    if (name.includes('notes') || name.includes('note')) return <FileText className="w-7 h-7" />;
    if (name.includes('mock') || name.includes('paper') || name.includes('exam')) return <FileText className="w-7 h-7" />;
    if (name.includes('assignment') || name.includes('homework')) return <PenTool className="w-7 h-7" />;
    if (name.includes('study') || name.includes('learn')) return <BookOpen className="w-7 h-7" />;
    if (name.includes('university') || name.includes('college')) return <GraduationCap className="w-7 h-7" />;
    if (name.includes('library') || name.includes('resource')) return <Library className="w-7 h-7" />;
    if (name.includes('brain') || name.includes('intelligence')) return <Brain className="w-7 h-7" />;
    if (name.includes('coffee') || name.includes('break')) return <Coffee className="w-7 h-7" />;
    if (name.includes('target') || name.includes('goal')) return <Target className="w-7 h-7" />;
    if (name.includes('award') || name.includes('certificate')) return <Award className="w-7 h-7" />;
    if (name.includes('complete') || name.includes('done')) return <CheckCircle className="w-7 h-7" />;

    return <Notebook className="w-7 h-7" />;
};

export const getPostIcon = (postTitle: string) => {
    const title = postTitle.toLowerCase();

    if (title.includes('semester') || title.includes('sem')) return <GraduationCap className="w-7 h-7" />;
    if (title.includes('notes') || title.includes('note')) return <FileText className="w-7 h-7" />;
    if (title.includes('mock') || title.includes('paper') || title.includes('exam')) return <FileText className="w-7 h-7" />;
    if (title.includes('assignment') || title.includes('homework')) return <PenTool className="w-7 h-7" />;
    if (title.includes('study') || title.includes('guide')) return <BookOpen className="w-7 h-7" />;
    if (title.includes('syllabus') || title.includes('curriculum')) return <Library className="w-7 h-7" />;
    if (title.includes('question') || title.includes('qb')) return <FileText className="w-7 h-7" />;
    if (title.includes('practical') || title.includes('lab')) return <Target className="w-7 h-7" />;

    return <Download className="w-7 h-7" />;
};

export const appleDesign = {
    typography: {
        heroTitle: "text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight",
        sectionTitle: "text-3xl md:text-4xl font-semibold tracking-tight",
        cardTitle: "text-xl md:text-2xl font-semibold tracking-tight",
        body: "text-base leading-relaxed",
        caption: "text-sm leading-relaxed"
    },
    spacing: {
        section: "py-2 md:py-2",
        card: "p-8 md:p-10",
        hero: "pt-16 pb-8 md:pt-20 md:pb-1"
    },
    colors: {
        primary: "rgb(0, 122, 255)",
        secondary: "rgb(142, 142, 147)",
        background: "rgb(248, 248, 248)",
        surface: "rgb(255, 255, 255)",
        text: "rgb(28, 28, 30)",
        textSecondary: "rgb(99, 99, 102)",
        border: "rgb(229, 229, 234)"
    }
};
