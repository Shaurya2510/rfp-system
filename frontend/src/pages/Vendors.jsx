import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addVendor, getVendors, deleteVendor } from "../services/api";
import {
    Loader2,
    User,
    Mail,
    Plus,
    Trash2,
    Building2,
    Search,
    ArrowLeft,
    Users,
    XCircle
} from "lucide-react";

export default function Vendors() {
    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);
    const [vendor, setVendor] = useState({ name: "", email: "" });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        getVendors()
            .then((res) => setVendors(res.data))
            .finally(() => setFetching(false));
    }, []);

    const submit = async () => {
        if (!vendor.name || !vendor.email) return;
        setLoading(true);
        try {
            const res = await addVendor(vendor);
            const newVendor = res.data.vendor || res.data;
            setVendors([...vendors, newVendor]);
            setVendor({ name: "", email: "" });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const removeVendor = async (id) => {
        const originalList = [...vendors];
        setVendors(vendors.filter((v) => v.id !== id));

        try {
            await deleteVendor(id);
        } catch (e) {
            setVendors(originalList);
            console.error("Failed to delete", e);
        }
    };

    const getInitials = (name) => name.substring(0, 2).toUpperCase();

    const filteredVendors = vendors.filter((v) =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">

            <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-blue-100/40 rounded-full blur-[80px] -z-10" />

            <div className="max-w-6xl mx-auto px-6 py-12">

                <div className="flex items-center gap-4 mb-10">

                    <button
                        onClick={() => navigate("/")}
                        className="p-2 rounded-full bg-white/50 hover:bg-white border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-emerald-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Vendor <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Network</span>
                        </h2>
                        <p className="text-slate-500 text-sm">Manage your suppliers and external partners.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


                    <div className="lg:col-span-4 h-fit">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-xl sticky top-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <Building2 size={20} />
                                </div>
                                <h3 className="font-semibold text-slate-800">Register Vendor</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Company Name</label>
                                    <div className="group mt-1 flex items-center bg-white border border-slate-200 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm">
                                        <User className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <input
                                            className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 ml-3 text-sm"
                                            type="text"
                                            placeholder="Acme Corp"
                                            value={vendor.name}
                                            onChange={(e) => setVendor({ ...vendor, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Contact Email</label>
                                    <div className="group mt-1 flex items-center bg-white border border-slate-200 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm">
                                        <Mail className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <input
                                            className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 ml-3 text-sm"
                                            type="email"
                                            placeholder="contact@acmecorp.com"
                                            value={vendor.email}
                                            onChange={(e) => setVendor({ ...vendor, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={submit}
                                    disabled={loading || !vendor.name || !vendor.email}
                                    className={`w-full mt-4 flex justify-center items-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg
                                    ${loading || !vendor.name || !vendor.email
                                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                            : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30 hover:-translate-y-0.5'}`}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                    {loading ? "Registering..." : "Add Vendor"}
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="lg:col-span-8">


                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="font-semibold text-slate-700">
                                Total Vendors <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs ml-2">{filteredVendors.length}</span>
                            </h3>

                            <div className="relative group w-full sm:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search vendors..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-white border border-slate-200 text-sm pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                />
                                {search && (
                                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <XCircle size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {fetching && (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="animate-spin text-emerald-500" size={32} />
                            </div>
                        )}

                        {!fetching && filteredVendors.length === 0 && (
                            <div className="bg-white/50 border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                                <div className="bg-slate-100 p-4 rounded-full mb-4">
                                    <Users size={32} className="text-slate-400" />
                                </div>
                                <h4 className="text-slate-600 font-semibold mb-1">
                                    {search ? "No matches found" : "No vendors found"}
                                </h4>
                                <p className="text-slate-500 text-sm">
                                    {search ? `We couldn't find any vendor matching "${search}"` : "Add your first vendor using the form on the left."}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!fetching && filteredVendors.map((v) => (
                                <div
                                    key={v.id}
                                    className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-200"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg shadow-inner">
                                                {getInitials(v.name)}
                                            </div>

                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">{v.name}</h4>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                                                    <Mail size={12} className="shrink-0" />
                                                    <span className="truncate">{v.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeVendor(v.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Remove Vendor"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}