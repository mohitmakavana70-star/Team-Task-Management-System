import { useEffect, useState } from "react";
import api from "../api/axios";
import { CheckCircle, Clock, AlertTriangle, ListTodo } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="rounded-2xl bg-slate-900 p-4 sm:p-6 shadow-lg border border-slate-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-xs sm:text-sm">{title}</p>
        <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{value}</h2>
      </div>
      <div className="p-2 sm:p-3 rounded-xl bg-slate-800">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  });

 const chartData = [
  {
    name: "Completed",
    value: Number(stats.completed) || 0,
    color: "#22c55e"
  },
  {
    name: "In Progress",
    value: Number(stats.inProgress) || 0,
    color: "#3b82f6"
  },
  {
    name: "Overdue",
    value: Number(stats.overdue) || 0,
    color: "#ef4444"
  },
  {
    name: "Todo",
    value:
      Number(stats.total) -
      Number(stats.completed) -
      Number(stats.inProgress),
    color: "#94a3b8"
  }
].filter((item) => item.value > 0);

  useEffect(() => {
    api.get("/tasks/dashboard/stats")
      .then((res) => setStats(res.data));
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-400 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl">
          Track team progress, task status, and overdue work.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} />
          <StatCard title="In Progress" value={stats.inProgress} icon={Clock} />
          <StatCard title="Overdue" value={stats.overdue} icon={AlertTriangle} />
        </div>

        <div className="mt-6 sm:mt-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 sm:mb-6 gap-4 lg:gap-0">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Task Overview</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Visual breakdown of task progress
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
              <p className="text-xs text-slate-400">Total Tasks</p>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="h-64 sm:h-72 flex items-center justify-center text-slate-400">
              No task data available
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="w-full min-h-[320px]">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      smInnerRadius={75}
                      smOuterRadius={120}
                      paddingAngle={4}
                      dataKey="value"
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                          stroke="#0f172a"
                          strokeWidth={3}
                          smStrokeWidth={4}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#fff"
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {chartData.map((item) => {
                  const percent =
                    stats.total > 0
                      ? Math.round((item.value / stats.total) * 100)
                      : 0;

                  return (
                    <div
                      key={item.name}
                      className="bg-slate-800/70 border border-slate-700 rounded-xl p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1 sm:mb-2 gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>

                        <span className="text-xs sm:text-sm text-slate-300">
                          {item.value} tasks
                        </span>
                      </div>

                      <div className="w-full h-1.5 sm:h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: item.color
                          }}
                        ></div>
                      </div>

                      <p className="text-xs text-slate-400 mt-1 sm:mt-2">
                        {percent}% of total
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;