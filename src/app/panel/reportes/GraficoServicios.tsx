"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type DatoServicio = {
  nombre: string;
  cantidad: number;
};

export default function GraficoServicios({ datos }: { datos: DatoServicio[] }) {
  if (datos.length === 0) {
    return <p className="text-xs text-[#6b6b80]">Sin datos aún.</p>;
  }

  return (
    <div className="h-56 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ left: 0, right: 16 }}>
          <XAxis type="number" hide />
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
            cursor={{ fill: "#8b5cf60f" }}
          />
          <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
            {datos.map((_, index) => (
              <Cell key={index} fill="#8b5cf6" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
