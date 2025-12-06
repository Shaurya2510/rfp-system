import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
    Loader2,
    Calendar,
    ShieldCheck,
    CreditCard,
    IndianRupee,
    Package,
    ArrowLeft,
    Inbox,
    Download
} from "lucide-react";


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Proposals() {
    const navigate = useNavigate();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/proposals")
            .then((res) => setProposals(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const getPrice = (data) => {
        return data.items?.[0]?.specs?.price || "N/A";
    };


    const generatePDF = (proposal) => {
        try {
            const doc = new jsPDF();
            const data = proposal.parsed_data || {};
            const price = getPrice(data);


            doc.setFontSize(20);
            doc.setTextColor(40, 40, 40);
            doc.text("Vendor Proposal", 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);


            doc.setDrawColor(200, 200, 200);
            doc.line(14, 32, 196, 32);

            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text(proposal.vendor_name || "Vendor", 14, 42);

            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            doc.text(`Email: ${proposal.vendor_email || "N/A"}`, 14, 48);
            doc.text(`RFP Reference ID: ${proposal.rfp_id || "N/A"}`, 14, 54);


            doc.setFontSize(12);
            doc.text("Commercial Terms", 14, 65);

            const terms = [
                [`Delivery Time`, data.delivery_days ? `${data.delivery_days} Days` : "N/A"],
                [`Warranty`, data.warranty || "N/A"],
                [`Payment Terms`, data.payment_terms || "N/A"],
                [`Per Item Cost`, `INR ${price}`]
            ];


            autoTable(doc, {
                startY: 70,
                head: [['Term', 'Details']],
                body: terms,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }
            });


            doc.text("Proposed Items", 14, doc.lastAutoTable.finalY + 15);

            const items = data.items?.map(item => {
                const specsStr = item.specs
                    ? Object.entries(item.specs).map(([k, v]) => `${k}: ${v}`).join(', ')
                    : '';
                return [item.name, item.qty, specsStr];
            }) || [];

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 20,
                head: [['Item Name', 'Quantity', 'Specifications']],
                body: items,
                theme: 'grid',
                headStyles: { fillColor: [60, 60, 60] }
            });


            const filename = `proposal_${(proposal.vendor_name || "vendor").replace(/\s+/g, '_')}.pdf`;
            doc.save(filename);

        } catch (error) {
            console.error("PDF Generation Failed:", error);
            alert("Failed to generate PDF. Check console for details.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">




            <div className="max-w-5xl mx-auto px-6 py-12">

                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 rounded-full bg-white/50 hover:bg-white border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-indigo-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Vendor <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Proposals</span>
                        </h2>
                        <p className="text-slate-500 text-sm">Review and compare incoming quotes from suppliers.</p>
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                        <p className="text-slate-500 text-sm">Fetching proposals...</p>
                    </div>
                )}

                {!loading && proposals.length === 0 && (
                    <div className="bg-white/50 border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                            <Inbox size={32} className="text-slate-400" />
                        </div>
                        <h4 className="text-slate-600 font-semibold mb-1">No proposals yet</h4>
                        <p className="text-slate-500 text-sm max-w-xs">
                            Once vendors reply to your RFPs, their proposals will appear here for review.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    {!loading && proposals.map((p) => {
                        const data = p.parsed_data || {};
                        const price = getPrice(data);

                        return (
                            <div key={p.id} className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white shadow-xl hover:shadow-2xl hover:border-indigo-100 transition-all duration-300">

                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-8 border-b border-slate-100 pb-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                                            {p.vendor_name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">{p.vendor_name}</h3>
                                            <p className="text-slate-500 text-sm flex items-center gap-1.5">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">RFP #{p.rfp_id}</span>
                                                <span className="text-slate-400">•</span>
                                                {p.vendor_email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Per Item Cost</p>
                                        <div className="flex items-center justify-end gap-1 text-3xl font-extrabold text-slate-900">
                                            <IndianRupee size={24} className="text-slate-400 mt-1" />
                                            {price}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <MetricCard icon={<Calendar size={18} />} label="Delivery Time" value={data.delivery_days ? `${data.delivery_days} Days` : "Not specified"} color="text-blue-600" bg="bg-blue-50" />
                                    <MetricCard icon={<ShieldCheck size={18} />} label="Warranty" value={data.warranty || "Not specified"} color="text-emerald-600" bg="bg-emerald-50" />
                                    <MetricCard icon={<CreditCard size={18} />} label="Payment Terms" value={data.payment_terms || "Not specified"} color="text-amber-600" bg="bg-amber-50" />
                                </div>

                                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                                    <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-4">
                                        <Package size={18} className="text-indigo-500" />
                                        Proposed Items
                                    </h4>
                                    <div className="space-y-3">
                                        {data.items?.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">{item.qty}x</span>
                                                    <span className="font-medium text-slate-800">{item.name}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                                    {item.specs && Object.entries(item.specs).map(([k, v]) => (
                                                        <span key={k} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-600">
                                                            <span className="font-semibold text-slate-400 mr-1">{k}:</span> {v}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => generatePDF(p)}
                                        className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Download size={16} />
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Sub-component (Keep this at the bottom)
function MetricCard({ icon, label, value, color, bg }) {
    return (
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">{label}</p>
                <p className="text-sm font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
}