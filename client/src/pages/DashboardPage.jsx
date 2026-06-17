import { useEffect, useState } from 'react';
import api from '../api/axios';
import HealthScoreCard from '../components/dashboard/HealthScoreCard';
import DailySummary from '../components/dashboard/DailySummary';
import InsightsCard from '../components/dashboard/InsightsCard';
import WeeklyStats from '../components/dashboard/WeeklyStats';
import TrendCharts from '../components/dashboard/TrendCharts';

export default function DashboardPage() {
  const [todayData, setTodayData] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [allRecords, setAllRecords] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch today's record, weekly stats, and records for charts
      const [todayRes, weeklyRes, trendsRes] = await Promise.all([
        api.get('/health/today'),
        api.get('/health/stats/weekly'),
        api.get('/health/trends?days=7'),
      ]);

      setTodayData(todayRes.data.record);
      setInsights(todayRes.data.insights || []);
      setWeeklyStats(weeklyRes.data.stats);
      setAllRecords(trendsRes.data.records || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Upper Grid: Score + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HealthScoreCard
            score={todayData?.healthScore || 0}
            category={todayData?.category || 'Needs Improvement'}
            hasData={!!todayData}
          />
        </div>
        <div className="lg:col-span-2">
          <DailySummary record={todayData} />
        </div>
      </div>

      {/* Middle Grid: Insights & Weekly stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightsCard insights={insights} />
        <WeeklyStats stats={weeklyStats} />
      </div>

      {/* Bottom Grid: Trend Chart */}
      <div className="grid grid-cols-1 gap-6">
        <TrendCharts records={allRecords} />
      </div>
    </div>
  );
}
