import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRfp, getRfps, deleteRfp } from "../services/api";
import {
    Loader2,
    Type,
    AlignLeft,
    Sparkles,
    ArrowLeft,
    CheckCircle2,
    Terminal,
    FileText,
    Trash2,
    Clock
} from "lucide-react";

export default function CreateRfp() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);


    const [rfps, setRfps] = useState([]);
    const [fetching, setFetching] = useState(true);


    useEffect(() => {
        loadRfps();
    }, []);

    const loadRfps = async () => {
        try {
            const res = await getRfps();
            setRfps(res.data);
        } catch (error) {
            console.error("Failed to load RFPs", error);
        } finally {
            setFetching(false);
        }
    };

    const submit = async () => {
        if (!title || !desc) return;
        setLoading(true);
        try {
            const res = await createRfp({
                title,
                description_raw: desc,
            });
            setResult(res.data);


            loadRfps();


            setTitle("");
            setDesc("");
        } catch (error) {
            console.error("Failed to create RFP", error);
        } finally {
            setLoading(false);
        }
    };


    const removeRfp = async (id) => {
        if (!window.confirm("Are you sure you want to delete this RFP?")) return;


        const original = [...rfps];
        setRfps(rfps.filter(r => r.id !== id));

        try {
            await deleteRfp(id);
        } catch (error) {
            console.error("Failed to delete", error);
            setRfps(original);
            alert("Failed to delete RFP");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 font-sans">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-purple-100/40 rounded-full blur-[80px] -z-10" />

            <div className="max-w-5xl mx-auto px-6 py-12">


                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 rounded-full bg-white/50 hover:bg-white border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-indigo-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Create New <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">RFP</span>
                        </h2>
                        <p className="text-slate-500 text-sm">Fill in the details to generate a structured request.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">


                    <div className="lg:col-span-2">
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl h-full">


                            <div className="mb-6 space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Project Title</label>
                                <div className="group flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm">
                                    <Type className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input
                                        className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 ml-3"
                                        type="text"
                                        placeholder="E.g. Enterprise CRM Migration"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>


                            <div className="mb-8 space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Requirements Description</label>
                                <div className="group flex items-start bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm">
                                    <AlignLeft className="text-slate-400 group-focus-within:text-indigo-500 transition-colors mt-1" size={20} />
                                    <textarea
                                        className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 ml-3 resize-none"
                                        rows={8}
                                        placeholder="Describe the scope, timeline, and specific requirements..."
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        disabled={loading}
                                    ></textarea>
                                </div>
                            </div>


                            <button
                                onClick={submit}
                                disabled={loading || !title || !desc}
                                className={`w-full group relative overflow-hidden flex justify-center items-center gap-2 
                                py-4 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all
                                ${loading || !title || !desc ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] hover:shadow-indigo-500/50'}`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 group-hover:text-yellow-200 transition-colors" />
                                        <span>Generate RFP</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>


                    <div className="lg:col-span-1">
                        {result ? (
                            <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700 h-full flex flex-col animate-fade-in-up">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <CheckCircle2 size={18} />
                                        <span className="font-semibold text-sm">Created Successfully</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                                    </div>
                                </div>

                                <div className="flex-1 relative overflow-hidden">
                                    <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                        <pre className="text-xs font-mono text-indigo-200 leading-relaxed">
                                            {JSON.stringify(result, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                                    <span className="text-xs text-slate-500">Scroll down to see it in the list</span>
                                </div>
                            </div>
                        ) : (

                            <div className="h-full border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-slate-400">
                                <Terminal size={48} className="mb-4 text-indigo-200" />
                                <h3 className="font-semibold text-slate-600 mb-1">JSON Preview</h3>
                                <p className="text-sm text-slate-500">
                                    The generated AI structure will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>


                <div className="border-t border-slate-200 pt-10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="text-indigo-600" size={24} />
                            Existing Projects
                            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{rfps.length}</span>
                        </h3>
                    </div>

                    {fetching ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-indigo-500" size={32} />
                        </div>
                    ) : rfps.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>No active RFPs found. Create your first one above!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rfps.map((rfp) => (
                                <div key={rfp.id} className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 relative">


                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                            <FileText size={20} />
                                        </div>
                                        <button
                                            onClick={() => removeRfp(rfp.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2"
                                            title="Delete RFP"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <h4 className="font-bold text-slate-800 mb-2 truncate pr-4">{rfp.title}</h4>


                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                                        {rfp.description_raw || "No description provided."}
                                    </p>


                                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-4 mt-auto">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>ID: {rfp.id}</span>
                                        </div>
                                        <span className="font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}