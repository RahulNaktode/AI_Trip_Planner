import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Activity, ArrowRight, Compass, Cpu, Layers, Loader2, ShieldCheck, Target } from "lucide-react"
import ControlField from '../components/ControlField'
import DateInput from '../components/DateInput'
import Counter from '../components/Counter'
import PreviewStat from '../components/PreviewStat'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { tripApi } from '../services/app'

const INTERESTS = [
    { id: "Nature", icon: "🌲" },
    { id: "Food", icon: "🍴" },
    { id: "Culture", icon: "🏬" },
    { id: "Shopping", icon: "🛍️" },
    { id: "Nightlife", icon: "🌙" },
    { id: "Adventure", icon: "🚞" },
    { id: "History", icon: "📃" },
    { id: "Art", icon: "🎨" },
    { id: "Beaches", icon: "🏖️" },

];

const LOADING_PHASES = [
    "Mapping Coordinates...",
    "Simulating Budgets...",
    "Finalizing Assets..."
];

function TripPlanner() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingPhase, setLoadingPhase] = useState(0);
    const [form, setForm] = useState({
        destination: "",
        startDate: "",
        endDate: "",
        adults: 1,
        kids: 0,
        budgetMin: 1500,
        budgetMax: 4500,
        interest: "",
    })

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingPhase((prev) => (prev + 1) % LOADING_PHASES.length)
            }, 2000)
            return () => clearInterval(interval);
        }
    }, [loading]);

    const toggleInterest = (id) => {
        setForm((f) => ({
            ...f, interest: f.interest.includes(id)
                ? f.interest.filter((i) => i !== id)
                : [...f.interest, id],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.destination.trim()) return toast.error("Sector Requried")
        setLoading(true);

        try {
            const start = new Date(form.startDate);
            const end = new Date(form.endDate);
            const duration = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;

            const res = await tripApi.generate({
                destination: form.destination,
                inputs: {
                    duration,
                    numTravelers: Number(form.adults) + Number(form.kids),
                    travelStyle: "Balanced",
                    interest: form.interest,
                    budgetMin: Number(form.budgetMin),
                    budgetMax: Number(form.budgetMax)
                },
            });

            navigate(`/trip/${res.data.data._id}`);

        } catch (error) {
            setLoading(false);
            toast.error("Prcess Interrupted")
        }
    }

    return (
        <div className='h-screen bg-[#020203] text-gray-300 font-sans overflow-hidden flex flex-col'>
            <Navbar />

            <div className='flex-1 flex flex-col lg:flex-row overflow-hidden pt-20'>
                <aside className='w-full lg:w-[35%] border-r border-white/5 bg-white/[0.01] p-8 flex flex-col overflow-y-auto custom-scrollbar'>
                    <div className='mb-10'>
                        <div className='flex items-center gap-2 mb-2 text-blue-500'>
                            <Cpu size={14} />
                            <span className='text-[10px] font-black uppercase tracking-[0.4em]'>
                                Planner Engine v4.0
                            </span>
                        </div>
                        <h1 className='text-3xl font-black tracking-tight text-white italic uppercase'>
                            Route <span className='text-blue-600'>Synthesis</span>
                        </h1>
                    </div>

                    <form className='space-y-8' onSubmit={handleSubmit}>
                        <ControlField label="Traget Sector">
                            <div className='relative group'>
                                <Target
                                    size={16}
                                    className='absolute left-4 top-1/2 -translate-1/2 text-gray-600 group-focus-within:text-blue-500 transition-all'
                                />
                                <input
                                    type="text"
                                    value={form.destination}
                                    onChange={(e) =>
                                        setForm({ ...form, destination: e.target.value })
                                    }
                                    required
                                    className='w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-white outline-none 
                          focus:border-blue-500/50 transition-all placeholder:text-gray-700 uppercase'
                                    placeholder='E.G PARIS, FRANCE'
                                />
                            </div>
                        </ControlField>

                        <div className='grid grid-cols-2 gap-4'>
                            <DateInput label={"Infilatration"}
                                value={form.startDate}
                                onChange={(v) => setForm({ ...form, startDate: v })}
                            />
                            <DateInput
                                label={"Extraction"}
                                value={form.endDate}
                                onChange={(v) => setForm({ ...form, endDate: v })}
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-2'>
                            <Counter
                                label={"Adult Units"}
                                value={form.adults}
                                setter={(v) => setForm(prev => ({ ...prev, adults: v }))}
                            />
                            <Counter
                                label={"Child Units"}
                                value={form.kids}
                                setter={(v) => setForm({ ...form, kids: v })}
                            />
                        </div>

                        <ControlField label={"Fiscal Rnage (USD)"}>
                            <div className='flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1'>
                                <input
                                    type="number"
                                    className='w-full bg-transparent py-3 px-4 font-mono text-xs font-bold text-center outline-none'
                                    value={form.budgetMin}
                                    onChange={(e) => {
                                        setForm({ ...form, budgetMin: e.target.value });
                                    }}
                                />
                                <ArrowRight size={12} className='text-gray-700' />
                                <input type="number"
                                    className='w-full bg-transparent py-3 px-4 font-mono text-xs font-bold text-center outline-none text-blue-400'
                                    value={form.budgetMax}
                                    onChange={(e) => {
                                        setForm({ ...form, budgetMax: e.target.value });
                                    }}
                                />
                            </div>
                        </ControlField>

                        <button
                            type='submit'
                            className='w-full bg-blue-600 text-white py-5 rounded-xl font-black text-xl uppercase tracking-widest 
                  transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-blue-600/10'
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={18} className='animate-spin' />
                            ) : (
                                <>
                                    Initialize Generation <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className='mt-auto pt-10 border-t border-white/5 flex items-center gap-4'>
                        <div className='p-2 bg-emerald-500/10 rounded-lg'>
                            <ShieldCheck size={16} className='text-emerald-500' />
                        </div>
                        <p className='text-[9px] text-gray-500 leading-relaxed uppercase font-bold tracking-tight'>
                            {" "} Neural node encryption active. Pathfinding algorithms Utilizing real-time global telemetry.
                        </p>
                    </div>
                </aside>

                <main className='flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar bg-black'>
                    <div className='max-w-4xl mx-auto space-y-12'>
                        <section>
                            <header className='flex items-center justify-betweenmb-8'>
                                <div className='flex items-center gap-3'>
                                    <Layers size={18} className='text-blue-500' />
                                    <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-500'>
                                        Experience Layers
                                    </h3>
                                </div>
                                <span className='text-[10px] font-mono text-blue-500/50'>
                                    {form.interest.length} SELECTED
                                </span>
                            </header>

                            <div className='grid grid-cols-2 md:grid md:grid-cols-3 gap-4'>
                                {INTERESTS.map((item) => {
                                    const active = form.interest.includes(item.id);
                                    return (
                                        <button className={`group relative flex items-center gap-4 p-6 rounded-[2rem] border 
                                        transition-all duration-300 ${active ? "bg-blue-600/10 border-blue-500/50 shadow" :
                                                "bg-white/[0.02] border-white/5 hover:border-white/20"
                                            }`}

                                            onClick={() => toggleInterest(item.id)}
                                        >
                                            <span className={`text-2xl transition-all duration-500`}>
                                                {item.icon}
                                            </span>
                                            <div className='text-left'>
                                                <p className={`text-[10px] font-black uppercase tracking-widest`}>
                                                    {item.id}
                                                </p>
                                                <p className='text-[8px] text-gray-600 font-bold uppercase mt-0.5'>
                                                    Vector Active
                                                </p>
                                            </div>

                                            {active && (
                                                <div className='absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6' />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </section>

                        <section className='bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group'>
                            <div className='absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all'>
                                <Compass size={120} className='animate-[spin_10s_linear_infinite]' />
                            </div>

                            <div className='relative z-10'>
                                <div className='flex items-center gap-3 mb-10'>
                                    <Activity size={18} className='text-blue-500' />
                                    <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-500'>
                                        Mission Live Preivew
                                    </h3>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                                    <PreviewStat
                                        label={"Objective"}
                                        value={form.destination || "UNDEFINED"}
                                        sub={"Deployment Sector"}
                                    />
                                    <PreviewStat
                                        label={"Personnel"}
                                        value={`${form.adults + form.kids} Units`}
                                        sub={"Active Deployment"}
                                    />
                                    <PreviewStat
                                        label={"Duration"}
                                        value={form.startDate && form.endDate ? "Calculated" : "Awating Dates"}
                                        sub={"Temporal Cycle"}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center'
                    >
                        <div className='relative mb-12'>
                            <div className='w-24 h-24 border border-blue-500/20 rounded-full border-t-blue-500 animate-spin' />
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <div className='w-12 h-12 border border-blue-500/10 rounded-full border-b-blue-500 animate-spin-slow' />
                            </div>
                        </div>

                        <div className='text-center space-y-2'>
                            <p className='text-white font-black uppercase tracking-[0.6em] text-xs'>
                                {LOADING_PHASES[loadingPhase]}
                            </p>
                            <p className='text-blue-500/40 font-mono text-[8px] uppercase'>
                                Bypassing Regional Firewalls....Done
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default TripPlanner
