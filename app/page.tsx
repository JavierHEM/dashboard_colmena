'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Thermometer, Droplets, Mountain, Wind } from 'lucide-react';

interface SensorData {
  temperatura: number;
  humedad: number;
  humedad_suelo: number;
  co2_detectado: number;
  timestamp: string;
}

// Función para generar datos simulados
const generateMockData = (): SensorData => ({
  temperatura: Math.round((20 + Math.random() * 15) * 10) / 10,
  humedad: Math.round((50 + Math.random() * 30) * 10) / 10,
  humedad_suelo: Math.round((40 + Math.random() * 40) * 10) / 10,
  co2_detectado: Math.round(300 + Math.random() * 200),
  timestamp: new Date().toISOString()
});

// Generar datos históricos simulados
const generateHistoricalData = (count: number): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date().getTime();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now - i * 3600000);
    data.push({
      ...generateMockData(),
      timestamp: date.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' })
    });
  }
  return data;
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);

  useEffect(() => {
    setMounted(true);
    const initialData = generateMockData();
    setCurrentData(initialData);
    setHistoricalData(generateHistoricalData(24));
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      const newData = generateMockData();
      setCurrentData(newData);
      setHistoricalData(prev => [...prev.slice(1), {
        ...newData,
        timestamp: new Date().toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 5000);

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted || !currentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando datos...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Monitor de Colmenas</h1>
        
        {/* Datos actuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
              <Thermometer className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.temperatura}°C</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humedad</CardTitle>
              <Droplets className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.humedad}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humedad Suelo</CardTitle>
              <Mountain className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.humedad_suelo}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO2</CardTitle>
              <Wind className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.co2_detectado} ppm</div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico histórico */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Histórico de Sensores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperatura" stroke="#ff7300" name="Temperatura" />
                  <Line type="monotone" dataKey="humedad" stroke="#387908" name="Humedad" />
                  <Line type="monotone" dataKey="humedad_suelo" stroke="#2196f3" name="Humedad Suelo" />
                  <Line type="monotone" dataKey="co2_detectado" stroke="#673ab7" name="CO2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}