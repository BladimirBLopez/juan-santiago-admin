"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type DatoMes = {
  mes: string;
  monto: number;
};

export default function GraficoIngresos({ datos }: { datos: DatoMes[] }) {
  const sinDatos = datos.every((d) => d.monto === 0);

  if (sinDatos) {
    return <p className="text-xs text-[#6b6b80]">Sin ingresos registrados aún.</p>;
  }

  return (
    <div className="h-56 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={datos} margin={{ left: 0, right: 16, top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fill: "#9099a8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9099a8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
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
            formatter={(value: number) => [`Bs ${value}`, "Cobrado"]}
          />
          <Line
            type="monotone"
            dataKey="monto"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{ fill: "#22c55e", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
