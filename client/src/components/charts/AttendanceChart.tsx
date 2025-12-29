import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import { AttendanceRecord } from '@/data/mockData';

interface AttendanceChartProps {
  data: AttendanceRecord[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const chartData = data.map(item => ({
    name: item.subjectCode,
    fullName: item.subject,
    percentage: item.percentage,
  }));

  const getBarColor = (percentage: number) => {
    if (percentage >= 90) return 'hsl(142, 71%, 45%)'; // success
    if (percentage >= 75) return 'hsl(38, 92%, 50%)'; // warning
    return 'hsl(0, 84%, 60%)'; // destructive
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Attendance Overview</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value}%`,
                props.payload.fullName
              ]}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-success" />
          <span className="text-muted-foreground">≥90% (Excellent)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-warning" />
          <span className="text-muted-foreground">75-89% (Good)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-destructive" />
          <span className="text-muted-foreground">&lt;75% (Low)</span>
        </div>
      </div>
    </div>
  );
}
