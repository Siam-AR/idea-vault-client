"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ideasAPI } from "@/lib/api";
import type { Idea } from "@/types";

interface CategoryData {
  name: string;
  count: number;
}

const COLORS = [
  "#0ea5e9", // cyan-500
  "#8b5cf6", // violet-500
  "#f43f5e", // rose-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#6366f1", // indigo-500
  "#ec4899", // pink-500
];

export default function CategoryChart() {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const ideas = await ideasAPI.getAll();
        const counts: Record<string, number> = {};

        if (Array.isArray(ideas)) {
          ideas.forEach((idea: Idea) => {
            const category = idea.category || "Uncategorized";
            counts[category] = (counts[category] || 0) + 1;
          });
        }

        const chartData = Object.keys(counts).map((key) => ({
          name: key,
          count: counts[key],
        })).sort((a, b) => b.count - a.count);

        setData(chartData);
      } catch (error) {
        console.error("Failed to load ideas for chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Ideas by Category</h3>
          <p className="mt-2 text-sm text-slate-500">
            A visual breakdown of the startup ideas shared by our community.
          </p>
        </div>

        <div className="h-[400px] w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-500">Loading chart data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-500">No data available.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis 
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
