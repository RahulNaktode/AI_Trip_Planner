import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Calendar, Infinity, ShieldCheck, Sparkles, Target, Terminal, User, Wallet, Zap } from 'lucide-react'

function UserTripData({ insights = [], inputs = {} }) {
    const aiInsights = insights?.[0]?.aiInsights || {};

    const displaySummary =
        aiInsights.verdict ||
        insights?.[0]?.content ||
        "Optimization protocol complete. Your trip is ready.";

    const optimizationTips =
        aiInsights.moneySavingTips?.length > 0
            ? aiInsights.moneySavingTips
            : insights
                  .map((item) => item.content || item.title)
                  .filter(Boolean);

    const finalTips =
        optimizationTips.length > 0
            ? optimizationTips
            : [
                  "Plan your route to minimize travel time.",
                  "Check local peak hours before travelling.",
                  "Compare prices to save your budget.",
              ];

    const tags =
        aiInsights.hiddenCosts?.length > 0
            ? aiInsights.hiddenCosts
            : insights.map((item) => item.title).filter(Boolean);
  return (
    <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className='rounded-[3rem] border border-gray-100 bg-white p-10 shadow-2xl relative overflow-hidden group mb-12'
    >
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
            <div className='flex items-center gap-5'>
                <div className='w-16 h-16 bg-gray-950 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl
                relative overflow-hidden shrink-0'>
                    <Sparkles size={24} className='relative z-10 text-blue-400' />
                    <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className='absolute inset-0 bg-gradient-to-tr from-blue-600/40 t0-tramsparent'
                    />
                </div>

                <div>
                    <h3 className='text-3xl font-black text-gray-950 uppercase italic tracking-tighter leading-none'>
                        Neural Intelligence Breifing
                    </h3>
                    <p className='text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2 mt-2'>
                        <ShieldCheck size={14} strokeWidth={3} /> System Verified Optimization
                    </p>
                </div>
            </div>

            <div className='hidden md:flex px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl items-center gap-3'>
                <div className='w-2 h-2 bg-emerald-500 rouunded-full animate-pulse' />
                <span className='text-[10px] font-black text-emerald-700 uppercase tracking-widest'>
                    Logic Engine 3.0 Live
                </span>
            </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-12'>
            <div className='p-5 bg-gray-50 rounded-[2rem] border border-gray-100'>
                <div className='flex items-center gap-2 text-gray-400 mb-2'>
                    <Calendar size={14} />
                    <span className='text-[9px] font-black uppercase tracking-widest'>
                        Timeline
                    </span>
                </div>
                <p className='text-xs font-bold text-gray-800 uppercase'>
                    {inputs?.duration} Days{" "}
                    <span className='text-[10px] text-gray-400 ml-1'>
                        ({inputs?.startDate})
                    </span>
                </p>
            </div>

            <div className='p-5 bg-gray-50 rounded-[2rem] border border-gray-100'>
                <div className='flex items-center gap-2 text-gray-400 mb-2'>
                    <User size={14} />
                    <span className='text-[9px] font-black uppercase tracking-widest'>
                        Personal
                    </span>
                </div>
                <p className='text-xs font-bold text-gray-800 uppercase'>
                    {inputs?.numTravelers} Units
                </p>
            </div>

            <div className='p-5 bg-gray-50 rounded-[2rem] border border-gray-100'>
                <div className='flex items-center gap-2 text-gray-400 mb-2'>
                    <Terminal size={14} />
                    <span className='text-[9px] font-black uppercase tracking-widest'>
                        Style
                    </span>
                </div>
                <p className='text-xs font-bold text-gray-800 uppercase'>
                    {inputs?.travelStyle}
                </p>
            </div>

            <div className='p-5 bg-gray-50 rounded-[2rem] border border-gray-100'>
                <div className='flex items-center gap-2 text-gray-400 mb-2'>
                    <Wallet size={14} />
                    <span className='text-[9px] font-black uppercase tracking-widest'>
                        Budget
                    </span>
                </div>
                <p className='text-xs font-bold text-gray-800 uppercase'>
                    ${inputs?.budgetMin} - ${inputs?.budgetMax}
                </p>
            </div>
        </div>

        <div className='relative mb-12'>
            <div className='absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full' />
            <p className='text-2xl text-gray-800 italic font-medium leading-relaxed pl-10 py-2'>
                {displaySummary}
            </p>
        </div>

        <div className='grid md:grid-cols-2 gap-12'>
            <div className='space-y-8'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-blue-50 rounded-lg'>
                        <Target size={18} className='text-blue-600' />
                    </div>
                    <h4 className='text-[11px] font-black bg-gray-400 uppercase tracking-[0.3em]'>
                        Strategic Optimization
                    </h4>
                </div>
                <ul className='space-y-5'>
                    {finalTips.map((tip, i) => (
                        <motion.li whileHover={{ x: 5 }}
                     className='text-sm font-bold text-gray-600 flex gap-5 items-start group/item'
                    >
                        <span className='flex-shrink-0 w-7 h-7 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center text-[10px] font-black 
                        group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:Shadow-lg transition-all'>
                            0 {i + 1}
                        </span>
                        <span className='leading-sung pt-1'>{tip}</span>
                    </motion.li>
                    ))}
                </ul>
            </div>

            <div className='space-y-8'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-indigo-50 rounded-lg'>
                        <Zap size={18} className='text-indigo-600' />
                    </div>
                    <h4 className='text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]'>
                        Risk Assessment / Tags
                    </h4>
                </div>
                <div className='flex flex-wrap gap-3'>
                    {tags.map((tag, i) => (
                        <span key={i} className='px-6 py-3.5 bg-gray-50 rounded-2xl text-[11px] font-black text-gray-700 
                        border border-gray-100 uppercase tracking-widest hover:border-blue-500/50 hover:bg-white 
                        hover:text-blue-600 hover:shadow-md transition-all cursor-default'>
                        {tag}
                    </span>
                    ))}
                </div>

                <div className='flex flex-wrap gap-2 pt-4 border-t border-gray-100'>
                    <span className='text-[9px] font-black text-gray-400 uppercase tracking-widest w-full mb-2'>
                        Target Interests
                    </span>
                    {inputs?.interest?.map((interests, i) => (
                        <span 
                         key={i}
                         className='text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase'
                        >
                            {interests}
                        </span>
                    ))}
                </div>

                <div className='mt-8 p-5 bg-amber-50/50 rounded-3xl border-amber-100/50 flex items-start gap-4'>
                   <AlertCircle size={18} className='="text-amber-500 shrek-0 mt-0.5' />
                   <p className='text-[11px] font-bold text-amber-700 leading-normal'>
                    Travel conditions are calculated based on current data. 
                    Always verify local local safety protocols and operating hours.
                   </p>
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default UserTripData
