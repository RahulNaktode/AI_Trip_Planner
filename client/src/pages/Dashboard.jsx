import React, { Activity } from 'react'
import Navbar from "../components/Navbar.jsx"
import { motion } from 'framer-motion'
import HUDMetric from '../components/HUDMetric.jsx'
import { Clock, CloudSun, Shield, User, History, LogIn, Map, Zap, Link, Compass, Sparkle, Globe, Plane, Loader2, ArrowRight, TrendingUp, Wallet, Cpu } from 'lucide-react'
import StatsBox from '../components/StatsBox.jsx'
import ActivityItem from '../components/ActivityItem.jsx'

function Dashboard() {
    return (
        <div className='min-h-screen bg-[#09090b] text-[#fafafa] font-sans selection:bg-blue-500/30'>
            <Navbar />

            <main className='max-w-[1700px] mx-auto px-6 pt-28 pb-10'>
                <header className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 border border-white/5 pb-10'>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='flex -space-x-2'>
                                <div className='w-3 h-3 rounded-full bg-[#4285f4]' />
                                <div className='w-3 h-3 rounded-full bg-[#EA4335]' />
                                <div className='w-3 h-3 rounded-full bg-[#fbbc05]' />
                                <div className='w-3 h-3 rounded-full bg-[#34a853]' />
                            </div>

                            <span className='text-[10px] font-black text-gray-500 uppercase tracking-widest'>
                                Session Active: {" "}
                                <span>admin@gmail.com</span>
                            </span>
                        </div>
                    </motion.div>

                    <div className='flex flex-wrap items-center gap-4'>
                        <HUDMetric icon={Clock} label={"System Time"} value={"12:23"} />
                        <HUDMetric icon={CloudSun} label={"Weather"} value={"Syncing...."} />
                        <HUDMetric icon={Map} label={"Region"} value={"Global/Edge"} />
                        <HUDMetric icon={Shield} label={"Auth Tier"} value={"Standard"} color='text-blue-400' />
                    </div>
                </header>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    <div className='bg-[#111113] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between relative
                overflow-hidden group hover:border-blue-500/30 transition-all'>
                        <div className='relative z-10'>
                            <div className='w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6'>
                                <User size={24} className='text-blue-500' />
                            </div>
                            <h3 className='text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1'>Identity Profile</h3>
                            <p className='text-xl font-bold text-white truncate'>
                                "Unknown User"
                            </p>
                            <div className='flex items-center gap-2 mt-2'>
                                <History size={12} className="text-gray-600" />
                                <p className='text-[10px] font-medium text-gray-500 uppercase tracking-tighter'>
                                    In: Login Time Stamp
                                </p>
                            </div>
                            <p className='text-[9px] font-mono text-gray-600 mt-4 bg-white/5 p-10 rounded-lg border border-white/5'>
                                ID Session Expired
                            </p>
                        </div>

                        <div className='mt-6 pt-6 border-t border-white/5 relative z-10 flex justify-between items-center'>
                            <span className='text-[9px] font-bold text-green-500 flex items-center gap-1.5 uppercase'>
                                <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' />
                                Secure Node
                            </span>
                            <LogIn size={14} className='text-gray-600 group-hover:text-blue-500 transition-colors' />
                        </div>
                    </div>
                    <StatsBox icon={Zap} label={"System Credits"} value={"1,250"} sub={"Compute units"} color={"text-yellow-400"} />

                    <div className='lg:col-span-2 bg-gradient-to-br from-[#4285f4] to-[#1a73e8] rounded-[2.5rem] p-10 flex flex-col justify-betwwen
                group relative overflow-hidden transition-all shadow-[0_20px_50px_rgba(66,133,244,0.3] cursor-pointer'>
                        <Link className='absolute inset-0 z-20' />
                        <div className='relative z-10'>
                            <Compass size={40} className='text-white mb-8 group-hover:rotate-45 transition-all duration-500' />
                            <h2 className='text-4xl font-black tracking-tighter text-white mb-2'>
                                New Itinerary
                            </h2>
                            <div className='flex items-center gap-2 text-white/70 t-medium'>
                                <Sparkle size={16} />
                                <span>Initialize AI Sysnthesis</span>
                            </div>
                        </div>

                        <div className='flex justify-end relative z-10 pointer-events-none'>
                            <div className='bg-white text-blue-600 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2'>
                                Lunch
                            </div>
                        </div>
                        <Globe size={280} className='absolute -right-20 -bottom-20 opacity-10 text-white rotate-12' />
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                    <div className='lg:col-span-8 bg-[#111113] border border-white/5 rounded-[3rem] p-10'>
                        <div className='flex justify-between items-center mb-10'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-white/5 rounded-lg'>
                                    <Plane size={16} className='text-blue-500' />
                                </div>
                                <h3 className='text-xs font-black uppercase tracking-[0.3em] text-gray-500'>
                                    Flight Archives
                                </h3>
                            </div>
                            <a href="#"
                                className='text-[10px] font-black text-blue-500'
                            >{" "}View All Logs
                            </a>
                        </div>

                        <div className='space-y-3'>
                            {/*<div className='flex justify-center py-20'>
                        <Loader2 size={16} className='animate-spin text-white/5' />
                    </div>*/}

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0 * 0.1 }}
                            >
                                <a href="#"
                                    className='flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0,04]
                        transition-all group'
                                >
                                    <div className='flex items-center gap-5'>
                                        <div className='w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-[#4285f4]'>
                                            Trip Desitnation
                                        </div>
                                        <div>
                                            <h3 className='font-bold text-white group-hover:text-[#4285f4] transition-all'>
                                                Trip Desitination
                                            </h3>

                                            <span className='text-[9px] font-black text-gray-600 uppercase tracking-widest'>
                                                Day Mission
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight size={20}
                                        className='text-gray-700 group-hover:text-white transition-all' />
                                </a>
                            </motion.div>
                        </div>
                    </div>

                    <div className='lg:col-span-4 space-y-6'>
                        <div className='bg-[#111113] border border-white/5 rounded-[3rem] p-8'>
                            <div className='flex items-center justify-between mb-8'>
                                <h3 className='text-xs font-black uppercase tracking-[0.3em] text-[#34a853] flex items-center gap-2'>
                                    <TrendingUp size={14} /> Fiscal Feedd
                                </h3>
                                <Wallet size={14} className='text-gray-600' />
                            </div>
                            <div className='space-y-6'>
                                <ActivityItem
                                    time={"Active"}
                                    action={"Dynamic"}
                                    desc={"Budget"}
                                    dot={"bg-green-500"}
                                />

                                <ActivityItem
                                    time={"Now"}
                                    action={"syncing Budgets"}
                                    desc={"No financial data found"}
                                    dot={"bg-yellow-500"}
                                />
                            </div>
                        </div>

                        <div className='bg-grident-to-br ffrom-zinc-900 to-black border border-white/5 rounded-[2.5rem] p-8 group'>
                          <div className='flex items-center gap-3 group'>
                            <div className='p-3 bg-white/5 rounded-xl text-blue-400'>
                              <Cpu size={20} />
                            </div>
                            <div>
                                <h4 className='text-xs font-black uppercase tracking-widest text-white'>
                                    Core Health
                                </h4>
                                <p className='text-[10px] text-gray-500 italic'>
                                    Node Cluster 09 Active
                                </p>
                            </div>
                          </div>
                        </div>

                        <div className='w-full bg-white/5 h-1 rounded-full overflow-hidden'>
                        <div className='bg-blue-500 h-full w-4/5 shadow-[0_0_10px_#4285f4]' />
                        <div className='flex justify-between mt-4'>
                            <div className='flex items-center gap-1'>
                                <Activity size={10} className='text-green-500' />
                                <span className='text-[8px] text-gray-500 uppercase font-bold'>
                                    Stable
                                </span>
                            </div>
                            <span className='text-[8px] text-gray-700 font-mono'>
                                User ID
                            </span>
                        </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard