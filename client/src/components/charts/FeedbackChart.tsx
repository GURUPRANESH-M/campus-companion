import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { FeedbackReport } from '@/data/mockData';

interface FeedbackChartProps {
  data: FeedbackReport;
}

export function FeedbackChart({ data }: FeedbackChartProps) {
  const chartData = [
    { category: 'Teaching', value: data.categories.teaching },
    { category: 'Communication', value: data.categories.communication },
    { category: 'Punctuality', value: data.categories.punctuality },
    { category: 'Knowledge', value: data.categories.knowledge },
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif font-semibold text-lg text-foreground">{data.facultyName}</h3>
          <p className="text-sm text-muted-foreground">{data.subject}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{data.avgRating.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">{data.totalResponses} responses</p>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            <PolarRadiusAxis 
              domain={[0, 5]} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Rating"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value.toFixed(1)} / 5`, 'Rating']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
