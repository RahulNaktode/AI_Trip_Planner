import React from 'react'
import Navbar from "../components/Navbar.jsx"
import TripImg from '../assets/trip.jpg'
import { motion } from 'framer-motion'
import { Building2, Calendar, Coffee, MapPin, Moon, Share2, ShieldCheck, Sun, TrainFront, User, Users, Wallet } from 'lucide-react'
import HeaderBade from '../components/HeaderBade.jsx'
import TimeLineCard from '../components/TimeLineCard.jsx'
import AiInsightCard from '../components/AiInsightCard.jsx'
import MapView from '../components/MapView.jsx'
import LogisticRow from '../components/LogisticRow.jsx'

function TripDetail() {
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
                                <MapPin size={14} className='text-blue-500' /> Designation
                            </p>
                        </div>

                        <h1 className='text-7xl md:text-9xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none mb-10'>
                            City Name <span className='text-blue-600'>.</span>
                        </h1>
                        <div className='flex flex-wrap items-center gap-6'>
                            <HeaderBade icon={Calendar} label={"Duration"} value={"Days"} />
                            <HeaderBade icon={Users} label={"Group"} value={"Number Travels"} />

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
                                        Total Cost
                                    </span>
                                    <span className='text-[10px] text-blue-400 ml-2 font-bold uppercase italic'>
                                        Budget
                                    </span>
                                </div>
                            </div>

                            <div className='ml-auto flex gap-3'>
                                <button className='p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-all'>
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
                        <button className={`px-8 py-4 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap`}>
                            Day 1
                        </button>
                    </div>

                    <div className='space-y-4'>
                        <TimeLineCard time={"09:00 Am"} period={"Morning"} icon={Sun} data={""} />
                        <TimeLineCard time={"01:00 Pm"} period={"Afternoon"} icon={Coffee} data={""} />
                        <TimeLineCard time={"07:00 Pm"} period={"Evening"} icon={Moon} data={""} />
                    </div>
                    <AiInsightCard />
                </div>

                <aside className='lg:col-span-4 space-y-8'>
                    <div className='sticky top-24 space-y-8'>
                        <div className='h-[400px] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2'>
                            <MapView />
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
                                        value="Dummy"
                                    />

                                    <LogisticRow
                                        icon={TrainFront}
                                        label="Transit Network"
                                        value="Dummy"
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
