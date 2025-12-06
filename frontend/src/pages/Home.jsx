import React from 'react';

import { useNavigate } from 'react-router-dom';
import { FileText, Users, Send, FileSearch, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {

    const navigate = useNavigate();

    const cards = [
        {
            title: "Create RFP",
            desc: "Generate structured procurement requests with AI assistance.",
            icon: <FileText className="w-6 h-6" />,
            color: "text-blue-600",
            bg: "bg-blue-50",
            hover: "group-hover:text-blue-600",
            border: "group-hover:border-blue-200",
            path: "/create-rfp"
        },
        {
            title: "Manage Vendors",
            desc: "Add, categorize, and monitor your registered vendor network.",
            icon: <Users className="w-6 h-6" />,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            hover: "group-hover:text-emerald-600",
            border: "group-hover:border-emerald-200",
            path: "/vendors"
        },
        {
            title: "Send RFP",
            desc: "Automated email dispatch to targeted suppliers instantly.",
            icon: <Send className="w-6 h-6" />,
            color: "text-violet-600",
            bg: "bg-violet-50",
            hover: "group-hover:text-violet-600",
            border: "group-hover:border-violet-200",
            path: "/send-rfp"
        },
        {
            title: "View Proposals",
            desc: "Analyze and compare parsed vendor proposals side-by-side.",
            icon: <FileSearch className="w-6 h-6" />,
            color: "text-amber-600",
            bg: "bg-amber-50",
            hover: "group-hover:text-amber-600",
            border: "group-hover:border-amber-200",
            path: "/proposals"
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-100/40 rounded-full blur-[80px] -z-10" />

            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">


                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm backdrop-blur-sm mb-4">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">AI-Powered Procurement</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                        RFP <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Management</span>
                    </h1>

                    <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
                        Streamline your procurement process with our intelligent platform.
                        Create, send, and analyze RFPs in minutes, not days.
                    </p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    {cards.map((c) => (
                        <div
                            key={c.title}
                            onClick={() => navigate(c.path)}
                            className={`group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${c.border}`}
                        >

                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${c.bg} ${c.color}`}>
                                {c.icon}
                            </div>


                            <div className="space-y-3">
                                <h3 className={`text-xl font-bold text-slate-800 transition-colors ${c.hover}`}>
                                    {c.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {c.desc}
                                </p>
                            </div>


                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                <ArrowRight className={`w-5 h-5 ${c.color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="mt-20 text-slate-400 text-sm">
                    © Developed by Shaurya Pandey for Aerchain's SDE1 Assessment
                </footer>
            </div>
        </div>
    );
}