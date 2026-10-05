import React from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Fingerprint, Globe, Play, ShieldCheck, Zap, Lock, ActivityIcon, Layers, Star } from 'lucide-react'
import tripImage from './../assets/trip.jpg'


function Home(fadeInUp) {
  return (
    <div>
      <Navbar />

      <section className="relative pt-44 pb-32 px-6 border-b border-white/5 overflow-hidden">
        <div
          className='absolute inset-0 bg-[url("https://www.transparenttexture.com/patterns/carbon-fibre.png")] opacity-20 pointer-events-none'
        />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-7xl md:text-[110px] font-black tracking-tighter leading-[0.85] text-white uppercase italic mb-10">
                Future of
                <br />
                <span className="text-blue-600 not-italic">
                  Exploration
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-xl mb-12 font-medium">
                The world's first autonomous travel architect. We don't just book
                trips; we synthesize experiences using real-time global intelligence.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  className="px-12 py-6 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all flex items-center gap-3"
                >
                  Initialize Mission
                  <ArrowRight size={18} />
                </a>

                <button
                  className="px-12 py-6 border border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all flex items-center gap-3"
                >
                  <Play size={16} fill="currentColor" />
                  System Demo
                </button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[40px] overflow-hidden border border-white/10 bg-[#0a0a0b] shadow-2xl">

              <img
                src={tripImage}
                alt="Travel expedition"
                className="'w-full h-[600px] object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
              />

              <div className="absolute bottom-8 right-8 left-8 p-8 bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10">
                <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest">
                  Operation Section
                </span>

                <p className="text-2xl font-black italic text-white uppercase mt-2">
                  Patagonia Ride Expedition
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      <section className='py-32 px-6 max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
          <motion.div 
          {...fadeInUp}
          className='md:col-span-8 bg-[#08080a] border border-white/5 rounded-[3rem] p-12 group overflow-hidden relative'>
            <div className='flex justify-between items-start mb-20'>
              <div className='p-5 bg-blue-600/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-all duration-500'>
                 <Cpu size={40} className='text-blue-50'/>
              </div>
              <div className='text-right'>
                <span className='blck text-[10px] font-b; text-blue-500 uppercase tracking-[0.4em'>
                  Precess Node
                </span>
                <span className='block text-[9px] font-mono text-gray-700 uppercase tracking-widest'>
                  Latency: 0.82ms
                </span>
              </div>
            </div>
            <h3 className='text-5xl font-black text-white italic uppercase mb-6 tracking-tighter'>
              Neural<br/> <span>Syntehsis</span>
            </h3>
            <p className='text-gray-500 text-xl max-w-md font-medium leading-relaxed'>
              Autonomous multi-vector routing. Our engine generation 14-day itineraries across global nodes in under 800ms.
            </p>
            <div className='absolute -right-16 -bottom-16 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none'>
              <Zap size={500} />
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className='md:col-span-4 bg-[#0a0505] border border-red-900/10 rounded-[3rem] p-12 
          flex flex-col justify-between group hover:border-red-600/30 transition-all'>
            <div className='relative'>
              <ActivityIcon className='text-red-600 animation-pulse' size={48} />
            </div>
            <div>
              <h3 className='text-2xl font-black text-white uppercase italic mb-2'>Vibe-Check</h3>
              <p className='text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed'>
                Sentiment analysis of local hotspots and urban density.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className='py-22 px-6 max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-colos-12 gap-16'>
          <motion.div 
      {...fadeInUp}
      className='md:col-span-4 bg-blue-600 rounded-[3rem] p-12 relative overflow-hidden group-shadow-[0_0_50px_rgba937,99,235,0.15)]'
      >
        <div className='relative z-10 h-full flex flex-col justify-between'>
          <ShieldCheck size={64} className='text-white group-hover:rotate-12 transition-transform duration-500' />
          <div>
            <h3 className='text-4xl font-black text-white italic uppercase mb-4 tracking-tighter'>
              SafeNode <br />
              Protocol
            </h3>
            <p className='text-blue-100 text-sm font-bold uppercase tracking-widest opacity-80'>
              {" "}
              Tracking 4k+ nodes for maximum enviromental stability.
            </p>
          </div>
        </div>
        <Globe 
        size={350}
        className='absolute -bottom-20 -right-20 text-white/10 animate-spin-slow pointer-events-none' />
      </motion.div>

      <motion.div {...fadeInUp} className='md:col-span-8 bg-[#08080a] border border-white/5 rounded-[3rem] p-12 flex items-center justify-between 
      group relative overflow-hidden'>
        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-[1px] bg-blue-600' />
              <span className='text-[10px] font-black uppercase text-blue-500 tracking=[0.3em]'>Security Uplink</span>
            
          </div>
          <h3 className='text-4xl font-black text-white italic uppercase tracking-tighter mb-4'>
            256-bit AES <br />
            <span className='text-gray-700'>Encrypted Cloud</span>
          </h3>
          <div className='flex gap-4'>
            <Fingerprint size={24} className='text-blue-600/40' />
            <Lock className='text-blue-600/40' size={24} />
          </div>
        </div>
        <Layers size={200}
        className='text-blue-600/5 group-hover:text-blue-600/10 group-hover:rorate-90 transition-all duration-1000 mr-10'
        />
      </motion.div>

      <motion.div className='md:col-span-12 bg-[#0a0a05] border border-yellow-900/10 rounded-[3rem] p-10 flex items-center justify-between
      group hover:bg-yellow-950/5'>
        <div className='flex items-center gap-8'>
          <Star size={48}
          className='texxt-yellow-600 group-hover:rotate-[144deg] transition-all duration-700' />
        <div>
        <h3 className='text-xl font-black text-white uppercase tracking-widest'>
          Curated Excellence
        </h3>
        <p className='text-[9px] text-yellow-600/50 font-momo mt-1 font-bold uppercase tracking-[0.2em'>
        Verified Expcellence V-4
        </p>
        </div>
        </div>
        <div className='hidden md:flex gap-2'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div className='w-8 h-1 bg-yellow-600/20 rounded-full overflow-hidden'>
              <div className='w-full h-full bg-yellow-600 -translate-x-full group-hover:translate-x-0 transition-all duration-500'
              style={{transitionDelay: `${i * 100}ms`}}
              />
            </div>
          ))}
        </div>
      </motion.div>
        </div>
      </section>

      <section className='py-32 px-6 bg-[#050507] border-y border-white/5'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 lhg:grid-cols-2 gap-24 items-center'>
          <motion.div {...fadeInUp}>
            <div className='inline-flex items-center gap-2 px-2 bg-blue-600 text-white rounded-lg mb-10'>
              <Cpu size={18} />
              <span className='text-[10px] font-black uppercase tracking-widest'>
                Logic Engine
              </span>
            </div>
            <h2 className='text-6xl font-black text-white italic uppercase mb-12 leading-none'>
              Autonomous
            </h2>{" "}
            <br />Logistic
            <div className='space-y-10'>
              {[
                {
                  s:"01",
                  t:"Constraint Ingestion",
                  d:"Specify budget, duration, and sensory preferences.",
                },
                {
                  s:"02",
                  t:"Vector Synthesis",
                  d:"AI cross-refernces millions of data points for optimal paths.",
                },
                {
                  s:"03",
                  t:"Live Deployment",
                  d:"Dynamic updates sent to your device every 60 seconds.",
                }
              ].map((step, i) => (
                <div className='flex gap-8 group'>
                  <span className='text-blue-600 font-black text-3xl opacity-50 group-hover:opacity-100 tarnsition-opacity'>
                    {step.s}
                  </span>
                  <div>
                    <h4 className='text-2xl font-black text-white italic uppercase mb-2 tracking-tighter'>
                      {step.t}
                    </h4>
                    <p className='text-gray-500 text-lg'>{step.d}</p>
                  </div>
                </div>
              ))
              }
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
