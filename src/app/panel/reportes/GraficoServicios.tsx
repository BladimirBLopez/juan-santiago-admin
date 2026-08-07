"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type DatoServicio = {
  nombre: string;
  cantidad: number;
};

export default function GraficoServicios({ datos }: { datos: DatoServicio[] }) {
  if (datos.length === 0) {
    return <p className="text-xs text-[#5d6573]">Sin datos aún.</p>;
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
              backgroundColor: "#161a22",
              border: "1px solid #262b35",
              borderRadius: 8,
              fontSize: 12,
              color: "#e8eaed",
            }}
            labelStyle={{ color: "#e8eaed" }}
            cursor={{ fill: "#c9a24b0f" }}
          />
          <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
            {datos.map((_, index) => (
              <Cell key={index} fill="#c9a24b" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
