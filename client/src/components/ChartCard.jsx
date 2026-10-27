import { Activity, AlertTriangle, BarChart3, CheckCircle2, Wallet } from 'lucide-react'
import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = [
    "#2563EB",
    "#3B82F6",
    "#1E40AF",
    "#64748B",
    "#94A3B8",
    "#CBD5E1",
    "#0F172A",
    "#334155"
];

const LABELS = {
    accommodation: "LODGING",
    food: "DINING",
    localTransport: "TRANSIT",
    activities: "LEISURE",
    flights: "AIRFARE",
    insurance: "INSURANCE",
    miscellaneous: "EXTRAS",
    emergencyBuffer: "BUFFER (12%)",
};

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const data = payload[0];
        const value = Number(data.value ?? data.payload?.amount ?? 0);
        const total = Number(data.payload?.total ?? 0);
        const percentage = total > 0 ? (value / total) * 100 : 0;

        return (
             <div className="bg-black border border-white/10 rounded-xl p-4 shadow-lg min-w-[180px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
                {data.name ?? data.payload?.name ?? "Expense"}
            </p>

            <p className="text-3xl font-black text-white tracking-tight">
                ${value.toLocaleString("en-US")}
            </p>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {percentage.toFixed(1)}% of Total
                </p>
            </div>
        </div>
        )
    }
    return null;
}

function BudgetPieChart({ breakdown }) {
    const data = Object.entries(breakdown)
        .filter(([key, val]) => !["total", "perPerson"].includes(key) && val > 0)
        .map(([key, value], idx) => ({
            name: LABELS[key] || key,
            value,
            total: breakdown.total,
            color: COLORS[idx % COLORS.length],
        }));

    return (
        <div className='bg-[#141417] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl group hover:border-blue-500/30 transition-all duration-500'>
            <div className='flex justify-between items-center mb-10'>
                <h3 className='text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3'>
                    <Activity size={16} className='text-blue-500' /> Expense Matrix
                </h3>
                <div className='px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-blue-500 uppercase tracking-widest'>
                    Live Analysis
                </div>
            </div>

            <div className='h-[350px] w-full relative'>
                <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10'>
                    <span className='text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1'>
                        Total Asset Dept
                    </span>
                    <span className='text-5xl font-black text-white tracking-tighter italic'>
                        {breakdown.total?.toLocaleString()}
                    </span>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={100}
                            outerRadius={140}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="#0A0A0B"
                            strokeWidth={8}
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            
<div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-10 pt-10 border-t border-white/5">
    {data.map((item, i) => (
        <div
            key={item.name}
            className="flex items-center justify-between gap-3 min-w-0"
        >
            <div className="flex items-center gap-3 min-w-0">
                <div
                    className="w-2 h-2 shrink-0"
                    style={{ backgroundColor: item.color }}
                />

                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate">
                    {item.name}
                </span>
            </div>

            <span className="text-xs font-black text-white font-mono shrink-0">
                ${item.value.toLocaleString("en-US")}
            </span>
        </div>
    ))}
</div>

        </div>
    )
}

function BudgetBarChart({ breakdown }) {
    const data = Object.entries(breakdown)
        .filter(([key, val]) => !["total", "perPerson"].includes(key) && val > 0)
        .map(([key, value]) => ({
            name: LABELS[key] || key,
            amount: value,
        }));

    return (
        <div className='bg-[#141317] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl group hover:border-blue-500/30 transition-all duration-500'>
            <h3 className='text-[11px] font-black text-white uppercase tracking-[0.4em] mb-12 flex items-center gap-3'>
                <BarChart3 size={16} className='text-blue-500' /> Resource Depth
            </h3>
            <div className='h-[320px] w-full'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout='vertical'
                        margin={{ left: 10, right: 40 }}
                    >
                        <XAxis type='number' hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke='#475569'
                            fontSize={10}
                            fontWeight={900}
                            tickLine={false}
                            axisLine={false}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.03" }}
                            content={<CustomTooltip />}
                        />
                        <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={16}>
                            {data.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

function BudgetOverUnder({ total, userBudget }) {
    if (!userBudget) return null;

    const diff = userBudget - total;
    const isOver = diff < 0;
    const percentageUsed = Math.min((total / userBudget) * 100, 100);
    return (
        <div className={`relative overflow-hidden rounded-[2.5rem] border p-12 transition-all duration-500 bg-[#141417] 
        ${isOver ? "border-red-500/20" : "border-emerald-500/20"}`}>
            <div className='absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none'>
                <Wallet size={160} strokeWidth={1} className='text-white' />
            </div>

            <div className='flex justify-between items-start mb-12 relative z-10'>
                <div>
                    <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${isOver ? "text-red-500" : "text-emerald-500"
                        }`}>
                        {isOver ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                        {isOver ? "LIMIT BREACHED" : "RESOURCES OPTIMIZED"}
                    </div>
                    <h2 className='text-7xl font-black text-white tracking-tighter leading-none uppercase italic'>
                        ${Math.abs(diff).toLocaleString()}
                    </h2>
                    <p className='text-[10px] font-black text-gray-600 mt-4 uppercase tracking-[0.4em]'>
                        {isOver ? "Critical Diffict" : "RESERVE SURPLUS"}
                    </p>
                </div>
            </div>

            <div className='space-y-6 relative z-10'>
                <div className='flex justify-between items-end'>
                    <span className='text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]'>
                        Asset Utilization Rate
                    </span>
                    <span className={`text-3xl font-black italic ${isOver ? "text-red-500" : "text-emerald-500"}`}>
                        {Math.round((total / userBudget) * 100)}%
                    </span>
                </div>
                <div className='h-6 bg-white/5 rounded-none border border-white/10 p-[2px]'>
                    <div className={`h-full transition-all duration-1000 ease-out ${isOver
                        ? "bg-red-600"
                        : "bg-emerald-600 shadow-[0_0_20px_rgba(916, 185, 129,0.3)]"
                        }`}
                        style={{ width: `${percentageUsed}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

export { BudgetBarChart, BudgetPieChart, BudgetOverUnder }
