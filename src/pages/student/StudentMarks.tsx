import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockMarks } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function StudentMarks() {
  const chartData = mockMarks.map(mark => ({
    name: mark.subjectCode,
    CIA1: mark.cia1,
    CIA2: mark.cia2,
    Assignment: mark.assignment,
  }));

  const totalObtained = mockMarks.reduce((acc, curr) => acc + curr.total, 0);
  const totalMax = mockMarks.reduce((acc, curr) => acc + curr.maxMarks, 0);
  const percentage = Math.round((totalObtained / totalMax) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Internal Marks</h1>
          <p className="text-muted-foreground">View your CIA and assignment scores</p>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-primary rounded-2xl p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 mb-1">Total Internal Marks</p>
              <p className="text-4xl font-bold">{totalObtained} / {totalMax}</p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/80 mb-1">Overall Percentage</p>
              <p className="text-4xl font-bold">{percentage}%</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Marks Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="CIA1" fill="hsl(224, 71%, 40%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CIA2" fill="hsl(168, 76%, 36%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Assignment" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-serif font-semibold text-lg text-foreground">Detailed Scores</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">CIA 1 (20)</TableHead>
                <TableHead className="text-center">CIA 2 (20)</TableHead>
                <TableHead className="text-center">Assignment (10)</TableHead>
                <TableHead className="text-center">Total (50)</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMarks.map((mark) => (
                <TableRow key={mark.subjectCode} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{mark.subjectCode}</TableCell>
                  <TableCell>{mark.subject}</TableCell>
                  <TableCell className="text-center">{mark.cia1}</TableCell>
                  <TableCell className="text-center">{mark.cia2}</TableCell>
                  <TableCell className="text-center">{mark.assignment}</TableCell>
                  <TableCell className="text-center font-semibold">{mark.total}</TableCell>
                  <TableCell className="w-32">
                    <Progress value={(mark.total / mark.maxMarks) * 100} className="h-2" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
