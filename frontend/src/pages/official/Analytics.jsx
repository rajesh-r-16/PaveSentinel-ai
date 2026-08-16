import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import api from "../../services/api";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/dashboard/analytics");

        console.log("Analytics Response:", response.data);

        setAnalytics(response.data);
      } catch (err) {
        console.error("Analytics Error:", err);

        setError(
          err.response?.data?.detail ||
            "Failed to load analytics data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="smart-analytics-section min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-white">
          Loading Analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="smart-analytics-section min-h-screen p-8">
        <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">
            Analytics Error
          </h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const cards = analytics?.cards || {};
  const severity = analytics?.severity || {};

  const statusData = [
    {
      name: "Pending",
      value: cards.pending || 0,
    },
    {
      name: "Verified",
      value: cards.verified || 0,
    },
    {
      name: "In Progress",
      value: cards.in_progress || 0,
    },
    {
      name: "Completed",
      value: cards.completed || 0,
    },
  ];

  const severityData = [
    {
      name: "Low",
      value: severity.low || 0,
    },
    {
      name: "Medium",
      value: severity.medium || 0,
    },
    {
      name: "High",
      value: severity.high || 0,
    },
  ];

  return (
    <div className="smart-analytics-section smart-page-enter p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Analytics Dashboard
        </h1>

        <p className="text-slate-300 mt-2">
          AI-powered road monitoring and pothole analytics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm opacity-90">
            Total Reports
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {cards.total_reports || 0}
          </h2>
        </div>

        <div className="bg-yellow-500 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm opacity-90">
            Pending
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {cards.pending || 0}
          </h2>
        </div>

        <div className="bg-green-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm opacity-90">
            Verified
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {cards.verified || 0}
          </h2>
        </div>

        <div className="bg-orange-500 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm opacity-90">
            In Progress
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {cards.in_progress || 0}
          </h2>
        </div>

        <div className="bg-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm opacity-90">
            Completed
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {cards.completed || 0}
          </h2>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Report Status */}
        <div className="smart-glass rounded-2xl shadow-md p-6">

          <h2 className="text-xl font-bold text-white mb-6">
            Report Status
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148, 163, 184, 0.20)"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fill: "#cbd5e1" }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#cbd5e1" }}
                />

                <Tooltip />

                <Legend
                  wrapperStyle={{
                    color: "#cbd5e1"
                  }}
                />

                <Bar
                  dataKey="value"
                  name="Reports"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* Severity */}
        <div className="smart-glass rounded-2xl shadow-md p-6">

          <h2 className="text-xl font-bold text-white mb-6">
            Pothole Severity
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={severityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >

                  <Cell fill="#16A34A" />
                  <Cell fill="#F59E0B" />
                  <Cell fill="#DC2626" />

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>
        </div>

      </div>

      {/* Summary */}
      <div className="mt-8 smart-glass rounded-2xl shadow-md p-6">

        <h2 className="text-xl font-bold text-white mb-4">
          Analytics Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="border border-cyan-400/20 rounded-xl p-5 bg-white/5">
            <p className="text-slate-300">
              Total Reports
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {cards.total_reports || 0}
            </p>
          </div>

          <div className="border border-cyan-400/20 rounded-xl p-5 bg-white/5">
            <p className="text-slate-300">
              High Severity
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {severity.high || 0}
            </p>
          </div>

          <div className="border border-cyan-400/20 rounded-xl p-5 bg-white/5">
            <p className="text-slate-300">
              Completed Reports
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {cards.completed || 0}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Analytics;