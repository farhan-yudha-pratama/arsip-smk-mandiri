import { Head } from '@inertiajs/react';
import { FileText, Inbox, Layers } from 'lucide-react';
import { dashboard } from '@/routes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Props {
    outgoingCount: number;
    incomingCount: number;
    templateCount: number;
    timelineData: Array<{ date: string; incoming: number; outgoing: number }>;
    userStats: Array<{ name: string; count: number }>;
}

export default function Dashboard({ outgoingCount = 0, incomingCount = 0, templateCount = 0, timelineData = [], userStats = [] }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-6">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Card 1 */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card p-6 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">Surat Keluar</h3>
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="text-3xl font-bold">{outgoingCount}</p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card p-6 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">Surat Masuk</h3>
                            <div className="bg-blue-500/10 p-2 rounded-lg">
                                <Inbox className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="text-3xl font-bold">{incomingCount}</p>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-card p-6 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">Template Dokumen</h3>
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <Layers className="h-5 w-5 text-emerald-500" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="text-3xl font-bold">{templateCount}</p>
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Timeline Chart */}
                    <div className="bg-card p-4 md:p-6 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border shadow-sm flex flex-col h-[350px] md:h-[400px]">
                        <h3 className="text-base md:text-lg font-bold tracking-tight mb-4 md:mb-6 text-foreground">Aktivitas Surat (14 Hari Terakhir)</h3>
                        <div className="flex-1 min-h-0 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={timelineData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                                    <XAxis dataKey="date" stroke="currentColor" className="text-[10px] font-medium opacity-60" tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="currentColor" className="text-[10px] font-medium opacity-60" tickLine={false} axisLine={false} allowDecimals={false} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem', fontSize: '12px', fontWeight: 'bold' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '5 5', opacity: 0.2 }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '600' }} iconType="circle" />
                                    <Line type="monotone" dataKey="incoming" name="Surat Masuk" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#card', stroke: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#card' }} />
                                    <Line type="monotone" dataKey="outgoing" name="Surat Keluar" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#card', stroke: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#10b981', stroke: '#card' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* User Stats Chart */}
                    <div className="bg-card p-4 md:p-6 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border shadow-sm flex flex-col h-[350px] md:h-[400px]">
                        <h3 className="text-base md:text-lg font-bold tracking-tight mb-4 md:mb-6 text-foreground">Top 5 Pembuat Surat Keluar</h3>
                        <div className="flex-1 min-h-0 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userStats} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" horizontal={false} />
                                    <XAxis type="number" stroke="currentColor" className="text-[10px] font-medium opacity-60" tickLine={false} axisLine={false} allowDecimals={false} />
                                    <YAxis dataKey="name" type="category" stroke="currentColor" className="text-xs font-semibold opacity-80" tickLine={false} axisLine={false} width={120} dx={-10} />
                                    <RechartsTooltip
                                        cursor={{ fill: 'currentColor', opacity: 0.04 }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem', fontSize: '12px', fontWeight: 'bold' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Bar dataKey="count" name="Jumlah Surat" fill="#8b5cf6" radius={[0, 6, 6, 0]} maxBarSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};