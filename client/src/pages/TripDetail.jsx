import React, { useEffect, useState, useMemo } from 'react'
import Navbar from "../components/Navbar.jsx"
import TripImg from '../assets/trip.jpg'
import { motion } from 'framer-motion'
import { Building2, Calendar, Coffee, MapPin, Moon, Share2, ShieldCheck, Sun, TrainFront, User, Users, Wallet } from 'lucide-react'
import HeaderBade from '../components/HeaderBade.jsx'
import TimeLineCard from '../components/TimeLineCard.jsx'
import AiInsightCard from '../components/AiInsightCard.jsx'
import MapView from '../components/MapView.jsx'
import LogisticRow from '../components/LogisticRow.jsx'
import { useNavigate, useParams } from 'react-router'
import toast from 'react-hot-toast'
import { budgetApi, tripApi } from '../services/app.js'
import LoadingScreen from '../components/LoadingScreen.jsx'
import ExportPDF from '../components/ExportPDF.jsx'
import UserTripData from '../components/UserTripData.jsx'

function TripDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [budget, setBudget] = useState(null);
    const [loading, setloading] = useState(true);
    const [activeDay, SetActiveDay] = useState(0);
    const [mapFocus, setMapFocus] = useState(0);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await tripApi.getById(id);
                const data = res.data?.trip || res.data || res;
                const budgetres = await budgetApi.getHistory();
                const budgetData = budgetres.budgetres?.budgets || budgetres.budgetres || budgetres;
                setBudget(budgetData);

                setTrip(data);
            }
            catch (error) {
                toast.error("Trip data unavailable");
                navigate('/trips');
            } finally {
                setloading(false);
            }
        };
        fetchTrip();
    }, [id, navigate]);

    const totalCost = useMemo(() => {
        if (!trip?.itinerary?.days) return 0;
        return trip.itinerary.days.reduce((acc, day) => {
            return (
                acc +
                (parseFloat(day.morning?.estimatedCost) || 0),
                (parseFloat(day.afternoon?.estimatedCost) || 0),
                (parseFloat(day.evening?.estimatedCost) || 0)
            );
        }, 0);
    }, [trip]);

    if (loading) return <LoadingScreen />;
    if (!trip) return null;

    const { destination, itinerary, inputs, logistics, insight } = trip;

    const currentDay = itinerary?.days?.[activeDay];
    const cityName = destination.split(", ")[0].trim();

    return (
        <div className='min-h-screen bg-[#050506] text-white font-sans selection:bg-blue-500/30'>
            <Navbar />

            <section className='relative h-[70vh] w-full flex items-end pb-20 overflow-hidden'>
                <div className='absolute inset-0 z-0'>
                    <img src={TripImg}
                        className='w-full h-full object-cover scale-105'
                    />
                    <div className='absolute inset-0 bg-gradient-to-r from-[#050506] via-[#050506]/20 to-transparent' />
                    <div className='absolute inset-0 bg-black/40' />
                </div>

                <div className='container mx-auto px-6 relative z-10'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className='flex items-center gap-3 mb-6'>
                            <span className='px-4 py-1.5 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg
                        shadow-blue-600/20'>
                                Confirmed Trip
                            </span>
                            <p className='text-gray-400 text-xs text-xs font-bold uppercase tracking-widest flex items-center gap-2'>
                                <MapPin size={14} className='text-blue-500' /> {destination}
                            </p>
                        </div>

                        <h1 className='text-7xl md:text-9xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none mb-10'>
                           {cityName} <span className='text-blue-600'>.</span>
                        </h1>
                        <div className='flex flex-wrap items-center gap-6'>
                            <HeaderBade icon={Calendar} label={"Duration"} value={`${itinerary?.days?.length} Days`} />
                            <HeaderBade icon={Users} label={"Group"} value={inputs?.numTravelers} />

                            <div className='bg-blue-600/10 backdrop-blur-xl border border-blue-500/30 px-6 py-3 rounded-2xl flex items-center gap-4 
                        group-hover:bg-blue-600/20 transition-all shadow-2xl'>
                                <div className='w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white'>
                                    <Wallet size={18} />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-[8px] font-bold text-blue-400 uppercase tracking-[0.2em]'>
                                        Total Investment
                                    </span>
                                    <span className='text-xl font-black text-white tracking-tighter'>
                                        ${totalCost.toLocaleString()}
                                    </span>
                                    <span className='text-[10px] text-blue-400 ml-2 font-bold uppercase italic'>
                                        {inputs?.budget}
                                    </span>
                                </div>
                            </div>

                            <div className='ml-auto flex gap-3'>
                                <ExportPDF tripData={trip} />
                                <button 
                                className='p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-all'
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link Shared");
                                }}
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <main className='container mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16'>
                <div className='lg:col-span-8 space-y-12'>
                    <div className='flex items-center gap-2 overflow-auto pb-4 border-b border-white/5 scrollbar-hide'>
                        {itinerary?.days.map((_, i) => (
                            <button 
                            className={`px-8 py-4 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap
                            ${activeDay === i ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "bg-white/5 text-gray-500 hover:text-white"}`
                            }
                            onClick={() => SetActiveDay(i)}
                            >
                            Day {i + 1}
                        </button>
                        ))}
                    </div>

                    <div className='space-y-4'>
                        <TimeLineCard 
                            time={"09:00 Am"} 
                            period={"Morning"} 
                            icon={Sun} 
                            data={currentDay?.morning} 
                            onFocus={setMapFocus}
                            />
                        <TimeLineCard 
                            time={"01:00 Pm"} 
                            period={"Afternoon"} 
                            icon={Coffee} 
                            data={currentDay?.afternoon} 
                            onFocus={setMapFocus}
                            />
                        <TimeLineCard 
                            time={"07:00 Pm"} 
                            period={"Evening"} 
                            icon={Moon} 
                            data={currentDay?.evening} 
                            onFocus={setMapFocus}
                            />
                    </div>
                    <UserTripData  insights={trip?.insights || []} inputs={trip?.inputs || {}}/>
                </div>

                <aside className='lg:col-span-4 space-y-8'>
                    <div className='sticky top-24 space-y-8'>
                        <div className='h-[400px] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2'>
                            <MapView destination={destination} itinerary={itinerary} activeDay={activeDay} focusLocation={mapFocus} />
                        </div>

                        <div className='bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden'>
                            <div className='absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] pointer-events-none' />

                            <div className='relative z-10'>
                                <h3 className='text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-6'>
                                    Operation Hub
                                </h3>

                                <div className='space-y-6'>
                                    <LogisticRow
                                        icon={Building2}
                                        label="Primary Residence"
                                        value={logistics?.hotel || `Boutique Stay in ${cityName}`}
                                    />

                                    <LogisticRow
                                        icon={TrainFront}
                                        label="Transit Network"
                                        value={logistics?.transport || `local Integrated Transit`}
                                    />
                                </div>
                            </div>

                            <div className='p-8 border-t border-white/5 space-y-6'>
                                <h3 className='text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]'>
                                    Essential Intel
                                </h3>
                                <LogisticRow icon={ShieldCheck} label={"Safety Protocol"} value={"Region Verified - Safe"} />
                                <LogisticRow icon={ShieldCheck} label={"Safety Protocol"} value={"Region Verified - Safe"} />
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    )
}

export default TripDetail
