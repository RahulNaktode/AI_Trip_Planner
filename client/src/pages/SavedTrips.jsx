import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { AnimatePresence, motion } from 'framer-motion'
import SmartImage from '../components/SmartImage'
import Matrix from '../components/Matrix'
import { ArrowRight, Calendar, Layers, Monitor, Plus, Trash2, Zap } from 'lucide-react'
import { tripApi } from '../services/app'
import toast from 'react-hot-toast'
import { Link } from 'react-router'

function SavedTrips() {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteing, setDeleteing] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await tripApi.getHistory();
                const list = Array.isArray(data) ? data : data.trips || [];
                setTrips(list);

                if (list.length > 0) setSelectedTrip(list[0]);
            } catch (error) {
                toast.error("Archive syn failed")
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const executedDelete = async (id) => {
        setDeleteing(id);
        try {
            await tripApi.delete(id);
            const updated = trips.filter((t) => t._id !== id);
            setTrips(updated);

            if (selectedTrip?._id === id) setSelectedTrip(updated[0] || null);
        } catch (error) {
            toast.error("Memory purget");
        } finally {
            setDeleteing(null);
        }
    }

    const getStableImageUrl = (id, type = "hero") => {
        const seed = id
            ? id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
            : Math.floor(Math.random() * 1000);

        const width = type === "hero" ? 1200 : 400;
        const height = type === "hero" ? 800 : 400;

        return `https://picsum.photos/seed/${seed}/${width}/${height}`;
    }

    return (
        <div className='min-h-screen bg-[#070708] text-[#fafafa] font-sans selection:bg-blue-500/30 overflow-hidden'>
            <Navbar />

            <main className='flex h-screen pt-20'>

                <section className='hidden lg:flex flex-[1.4] relative border-r border-white/5 overflow-hidden bg-[#0a0a0b]'>
                    <AnimatePresence mode='wait'>
                        {selectedTrip ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className='w-full h-full flex flex-col relative'
                            >
                                <div className='absolute inset-0 z-0'>
                                    <SmartImage
                                        src={getStableImageUrl(selectedTrip?._id, "hero")}
                                        className={"absolute inset-0 bg-gradient-to-r from-[#070708] via-transparent to-transparent"} />
                                </div>

                                <div className='relative z-10 p-16 flex flex-col h-full'>
                                    <header>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-8 h-px bg-blue-500' />
                                            <span className='text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]'>
                                                Data Cluster //{selectedTrip?._id.slice(-6)}
                                            </span>
                                        </div>
                                        <h2 className='text-8xl font-black tracking-tighter uppercase italic leading-[0.05] mt-6'>
                                            {selectedTrip?.destination.split(",")[0]};
                                        </h2>
                                    </header>
                                    <div className='mt-auto grid grid-cols-3 gap-8 border-t border-white/10 pt-12 pb-8'>
                                        <Matrix
                                            label={"duration"}
                                            value={`${selectedTrip?.input?.duration}`}
                                            icon={Calendar}
                                        />
                                        <Matrix
                                            label={"Number of People"}
                                            value={`${selectedTrip?.input?.numTravelers || ""}`}
                                            icon={Zap}
                                        />
                                        <Matrix
                                            label={"Style"}
                                            value={`${selectedTrip?.input?.travelStyle}` || "Nomad"}
                                            icon={Layers}
                                        />
                                    </div>

                                    <div className='flex gap-4'>
                                        <Link
                                            to={`/trip/${selectedTrip?._id}`}
                                            className='flex-1 flex items-center justify-center gap-4 py-6 bg-blue-600 rounded-3xl font-black text-[11px] 
                            uppercase tracking-[0.2em] hover:bg-blue-500 transition-all'
                                        >
                                            Initialize Mission
                                        </Link>
                                        <button className='w-20 flex items-center justify-center rounded-3xl bg-white/5 border-white/10 text-gray-500 
                                        hover:text-red-500 trasition-all'
                                            onClick={() => executedDelete(selectedTrip._id)} >
                                            <Trash2 />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className='m-auto opacity-20 text-center uppercase tracking-widest text-xs font-black'>
                                <Monitor size={48} className='mx-auto mb-4' /> No Signal
                            </div>
                        )}
                    </AnimatePresence>
                </section>

                <section className='flex-1 overflow-y-hidden bg-[#070708] p-8 lg:p-10 custom-sceollbar'>
                    <div className='flex justify-between items-end mb-12'>
                        <h1 className='text-3xl font-black tracking-tighter uppercase italic text-white'>
                            Archives
                        </h1>
                        <Link
                            to={"/plan"}
                            className='w-12 h-12 bg-white/5 border-white/10 rounded-2xl flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:txt-white transition-all'
                        >
                            <Plus size={24} />
                        </Link>
                    </div>

                    <div className='grid gap-4'>
                        {loading ? [...Array(3)].map((_, i) => {
                            return (
                                <div className='h-24 bg-white/5 rounded-[2rem] animate-pulse' />
                            )
                        }) : (
                            trips.map((trip) => (
                                <motion.div
                                    className={`group relative p-4 rounded-[2.5rem] border transition-all duration-500 cursor-pointer 
                                              ${selectedTrip?._id === trip._id ? "bg-blue-600/10 border-blue-500/40 translate-x-2"
                                            : "bg-white/[0.02] border-e-white/5 hover:border-white/20"
                                        }`}
                                        onClick={() => setSelectedTrip(trip)}
                                >
                                    <div className='flex items-center gap-5 relative z-10'>
                                        <SmartImage
                                            src={getStableImageUrl(
                                                trip._id,
                                                "thumb" 
                                            )}
                                            alt={trip.destination || "Trip destination"}
                                            className="h-16 w-16 shrink-0 rounded-2xl"
                                        />
                                        {console.log(getStableImageUrl(trip._id))}
                                        <div className='flex-1 overflow-hidden'>
                                            <h4 className={`font-black text-lg tracking-tighter uppercase italic truncate
                                        ${selectedTrip?._id === trip._id ? "text-gray-400" : "text-white"}`}>
                                                {trip?.destination.split(",")[0]}
                                            </h4>
                                            <p className='text-[10px] font-bold text-gray-600 uppercase tracking-widest'>
                                                {console.log(trip.input)}
                                                {trip?.input?.duration}D Trip
                                            </p>
                                        </div>
                                        <ArrowRight size={18} />
                                    </div>
                                </motion.div>
                            ))
                        )}


                    </div>
                </section>
            </main>

        </div>
    )
}

export default SavedTrips
