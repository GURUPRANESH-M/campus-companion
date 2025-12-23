import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DepartmentStats } from '@/data/mockData';

interface DepartmentChartProps {
  data: DepartmentStats[];
  type: 'students' | 'attendance' | 'performance';
}

const COLORS = [
  'hsl(224, 71%, 40%)',
  'hsl(168, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 65%, 50%)',
];

export function DepartmentChart({ data, type }: DepartmentChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.department,
    value: type === 'students' ? item.totalStudents : 
           type === 'attendance' ? item.avgAttendance : 
           item.avgPerformance,
    color: COLORS[index % COLORS.length],
  }));

  const titles = {
    students: 'Students by Department',
    attendance: 'Avg Attendance by Dept',
    performance: 'Avg Performance by Dept',
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="font-serif font-semibold text-lg text-foreground mb-4">{titles[type]}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [
                type === 'students' ? value : `${value}%`,
                type === 'students' ? 'Students' : 'Percentage'
              ]}
            />
            <Legend 
              formatter={(value) => (
                <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
