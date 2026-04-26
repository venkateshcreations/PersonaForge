import { useStore } from '../store/useStore';
import { BarChart3, Users, Target, AlertCircle, TrendingUp, Activity, Download, Calendar, PieChart, BarChart } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, BarChart as RechartsBar, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { useMemo, useState } from 'react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6'];

export const Analytics = () => {
  const { personas, teamLibrary } = useStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  if (personas.length === 0 && teamLibrary.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[var(--text)]">Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1">Persona insights and statistics</p>
        </div>
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-[var(--accent)]" />
          </div>
          <h3 className="font-display text-xl font-semibold text-[var(--text)] mb-2">No data yet</h3>
          <p className="text-[var(--text-secondary)]">Create some personas to see analytics</p>
        </div>
      </div>
    );
  }

  const stats = useMemo(() => {
    const totalPersonas = personas.length;
    const teamPersonas = teamLibrary.length;
    const totalGoals = personas.reduce((sum, p) => sum + (p.goals?.length || 0), 0);
    const totalPainPoints = personas.reduce((sum, p) => sum + (p.painPoints?.length || 0), 0);
    const totalMotivations = personas.reduce((sum, p) => sum + (p.motivations?.length || 0), 0);
    
    const completenessScores = personas.map(p => {
      let score = 0;
      if (p.name) score += 15;
      if (p.role) score += 15;
      if (p.avatar) score += 5;
      if (p.demographics?.age || p.demographics?.location) score += 10;
      if (p.background) score += 10;
      if (p.goals?.length) score += Math.min(p.goals.length * 5, 15);
      if (p.painPoints?.length) score += Math.min(p.painPoints.length * 5, 10);
      if (p.motivations?.length) score += 5;
      if (p.behaviors?.length) score += 5;
      if (p.quote) score += 5;
      if (p.personalityTraits) score += 5;
      return score;
    });
    
    const avgCompleteness = completenessScores.length > 0 
      ? Math.round(completenessScores.reduce((a, b) => a + b, 0) / completenessScores.length)
      : 0;

    const rolesData = personas.reduce((acc, p) => {
      const role = p.role || 'Unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const rolesChartData = Object.entries(rolesData).map(([name, value]) => ({ name, value }));

    const locationsData = personas.reduce((acc, p) => {
      const loc = p.demographics?.location || 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topLocations = Object.entries(locationsData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    const goalsVsPain = [
      { name: 'Goals', value: totalGoals, fill: '#22c55e' },
      { name: 'Pain Points', value: totalPainPoints, fill: '#ef4444' },
      { name: 'Motivations', value: totalMotivations, fill: '#3b82f6' },
    ];

    const tagsData = personas
      .flatMap((p) => p.tags || [])
      .filter(Boolean)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    const tagsChartData = Object.entries(tagsData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const usageTrend = (() => {
      const months: Record<string, number> = {};
      const now = new Date();
      const pastMonths = timeRange === 'week' ? 4 : timeRange === 'month' ? 6 : 12;
      
      for (let i = pastMonths - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        months[key] = 0;
      }
      
      personas.forEach(p => {
        const d = new Date(p.createdAt);
        const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (months[key] !== undefined) months[key]++;
      });
      
      return Object.entries(months).map(([month, count]) => ({ month, count }));
    })();

    const completenessDist = [
      { range: '0-25%', count: completenessScores.filter(s => s <= 25).length },
      { range: '26-50%', count: completenessScores.filter(s => s > 25 && s <= 50).length },
      { range: '51-75%', count: completenessScores.filter(s => s > 50 && s <= 75).length },
      { range: '76-100%', count: completenessScores.filter(s => s > 75).length },
    ];

    return { 
      totalPersonas, teamPersonas, totalGoals, totalPainPoints, totalMotivations, 
      rolesChartData, topLocations, goalsVsPain, tagsChartData, avgCompleteness,
      usageTrend, completenessDist, completenessScores 
    };
  }, [personas, teamLibrary, timeRange]);

  const { totalPersonas, teamPersonas, totalGoals, totalPainPoints, rolesChartData, topLocations, goalsVsPain, tagsChartData, avgCompleteness, usageTrend, completenessDist } = stats;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-[var(--text)]">{payload[0].name}</p>
          <p className="text-lg font-bold text-[var(--accent)]">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[var(--text)]">Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1">Persona insights and statistics</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTimeRange('week')} className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === 'week' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)]'}`}>4W</button>
          <button onClick={() => setTimeRange('month')} className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === 'month' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)]'}`}>6M</button>
          <button onClick={() => setTimeRange('all')} className={`px-3 py-1.5 rounded-lg text-sm ${timeRange === 'all' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)]'}`}>All</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <Users className="w-5 h-5 text-[var(--accent)] mb-2" />
          <p className="text-2xl font-bold text-[var(--text)]">{totalPersonas}</p>
          <p className="text-xs text-[var(--text-secondary)]">My Personas</p>
        </div>
        <div className="card p-4">
          <Users className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-[var(--text)]">{teamPersonas}</p>
          <p className="text-xs text-[var(--text-secondary)]">Team Personas</p>
        </div>
        <div className="card p-4">
          <Target className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-[var(--text)]">{totalGoals}</p>
          <p className="text-xs text-[var(--text-secondary)]">Total Goals</p>
        </div>
        <div className="card p-4">
          <Activity className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-[var(--text)]">{avgCompleteness}%</p>
          <p className="text-xs text-[var(--text-secondary)]">Avg Complete</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="font-medium text-[var(--text)] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            Usage Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={usageTrend}>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-medium text-[var(--text)] mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[var(--accent)]" />
            Roles Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPie>
              <Pie data={rolesChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {rolesChartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" formatter={(value) => <span className="text-xs">{value}</span>} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-4">
          <h3 className="font-medium text-[var(--text)] mb-4">Goals vs Pain Points</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RechartsBar data={goalsVsPain} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} />
            </RechartsBar>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-medium text-[var(--text)] mb-4">Completeness</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RechartsBar data={completenessDist} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="range" width={60} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </RechartsBar>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-medium text-[var(--text)] mb-4">Top Locations</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RechartsBar data={topLocations} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#14b8a6" radius={[0, 6, 6, 0]} />
            </RechartsBar>
          </ResponsiveContainer>
        </div>
      </div>

      {tagsChartData.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium text-[var(--text)] mb-4">Tags Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsBar data={tagsChartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </RechartsBar>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};