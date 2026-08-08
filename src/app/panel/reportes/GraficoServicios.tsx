"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type DatoServicio = {
  nombre: string;
  cantidad: number;
  color: string;
};

export default function GraficoServicios({
  datos,
  total,
}: {
  datos: DatoServicio[];
  total: number;
}) {
  if (datos.length === 0) {
    return <p className="text-xs text-[#6b6b80]">Sin datos aún.</p>;
  }

  return (
    <div className="h-56 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ left: 0, right: 16 }}>
          <XAxis type="number" domain={[0, total]} hide />
          <YAxis
            type="category"
            dataKey="nombre"
            width={110}
            tick={{ fill: "#9099a8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#131319",
              border: "1px solid #2a2a3d",
              borderRadius: 8,
              fontSize: 12,
              color: "#e8eaed",
            }}
            labelStyle={{ color: "#e8eaed" }}
            cursor={{ fill: "#6366f10f" }}
          />
          <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
            {datos.map((d, index) => (
              <Cell key={index} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
