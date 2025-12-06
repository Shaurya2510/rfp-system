import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRfps, getVendors, sendRfpEmail } from "../services/api";
import {
    Loader2,
    FileText,
    Store,
    Send,
    ChevronDown,
    ArrowRight,
    CheckCircle2,
    ArrowLeft
} from "lucide-react";

export default function SendRfp() {

    const navigate = useNavigate();

    const [rfps, setRfps] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selection, setSelection] = useState({ rfp_id: "", vendor_id: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rfpRes, vendorRes] = await Promise.all([getRfps(), getVendors()]);
                setRfps(rfpRes.data);
                setVendors(vendorRes.data);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, []);

    const sendMail = async () => {
        setLoading(true);
        try {
            await sendRfpEmail(selection);
            setSuccess(true);
            setSelection({ rfp_id: "", vendor_id: "" });
        } catch (error) {
            console.error("Failed to send", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSuccess(false);
    };


    const selectedRfp = rfps.find(r => r.id === selection.rfp_id);
    const selectedVendor = vendors.find(v => v.id === selection.vendor_id);

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-violet-100 selection:text-violet-900">


            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-200/30 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-100/40 rounded-full blur-[80px] -z-10" />


            <div className="absolute top-6 left-6 z-10">
                <button
                    onClick={() => navigate("/")}
                    className="p-3 rounded-full bg-white/50 hover:bg-white border border-transparent hover:border-violet-200 transition-all text-slate-500 hover:text-violet-600 shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">


                <div className="text-center mb-10 space-y-2">
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Dispatch <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Center</span>
                    </h2>
                    <p className="text-slate-500 text-sm">Select a procurement request and dispatch it to a vendor.</p>
                </div>

                <div className="w-full max-w-4xl">

                    {success ? (

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-white shadow-2xl text-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">RFP Sent Successfully!</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                The email has been dispatched to the vendor. They will receive the proposal details shortly.
                            </p>
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium"
                            >
                                <ArrowLeft size={18} />
                                Send Another
                            </button>
                        </div>
                    ) : (

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white shadow-2xl relative">

                            {fetching ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="animate-spin text-violet-600" size={32} />
                                </div>
                            ) : (
                                <div className="space-y-10">


                                    <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">


                                        <div className="md:col-span-5 space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                                1. Select Document
                                            </label>
                                            <div className={`group relative bg-white border-2 rounded-2xl transition-all duration-300 ${selection.rfp_id ? 'border-violet-500 ring-4 ring-violet-500/10' : 'border-slate-100 hover:border-violet-200'}`}>
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                                                    <FileText size={24} />
                                                </div>
                                                <select
                                                    className="w-full h-full p-4 pl-14 pr-10 bg-transparent outline-none appearance-none text-slate-700 font-medium cursor-pointer"
                                                    value={selection.rfp_id}
                                                    onChange={(e) => setSelection({ ...selection, rfp_id: e.target.value })}
                                                >
                                                    <option value="" disabled>Choose an RFP...</option>
                                                    {rfps.map((r) => (
                                                        <option key={r.id} value={r.id}>{r.title}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                    <ChevronDown size={20} />
                                                </div>
                                            </div>

                                            <div className="h-6 ml-1">
                                                {selectedRfp && <p className="text-xs text-violet-600 truncate font-medium">Selected: {selectedRfp.title}</p>}
                                            </div>
                                        </div>


                                        <div className="hidden md:flex md:col-span-1 justify-center -mt-6">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>


                                        <div className="md:col-span-5 space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                                2. Select Recipient
                                            </label>
                                            <div className={`group relative bg-white border-2 rounded-2xl transition-all duration-300 ${selection.vendor_id ? 'border-pink-500 ring-4 ring-pink-500/10' : 'border-slate-100 hover:border-pink-200'}`}>
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500">
                                                    <Store size={24} />
                                                </div>
                                                <select
                                                    className="w-full h-full p-4 pl-14 pr-10 bg-transparent outline-none appearance-none text-slate-700 font-medium cursor-pointer"
                                                    value={selection.vendor_id}
                                                    onChange={(e) => setSelection({ ...selection, vendor_id: e.target.value })}
                                                >
                                                    <option value="" disabled>Choose a Vendor...</option>
                                                    {vendors.map((v) => (
                                                        <option key={v.id} value={v.id}>{v.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                    <ChevronDown size={20} />
                                                </div>
                                            </div>

                                            <div className="h-6 ml-1">
                                                {selectedVendor && <p className="text-xs text-pink-600 truncate font-medium">Email: {selectedVendor.email}</p>}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="pt-6 border-t border-slate-100">
                                        <button
                                            onClick={sendMail}
                                            disabled={loading || !selection.rfp_id || !selection.vendor_id}
                                            className={`w-full group relative flex justify-center items-center gap-3 
                                            py-4 rounded-xl font-bold text-lg text-white transition-all duration-300
                                            ${loading || !selection.rfp_id || !selection.vendor_id
                                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.01]'}`}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={24} />
                                                    <span>Transmitting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Send Proposal</span>
                                                    <Send size={20} className={`transition-transform duration-300 ${(!selection.rfp_id || !selection.vendor_id) ? '' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}