import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NoticeCard } from '@/components/dashboard/NoticeCard';
import { mockNotices } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentNotices() {
  const allNotices = mockNotices;
  const highPriority = mockNotices.filter(n => n.priority === 'high');
  const mediumPriority = mockNotices.filter(n => n.priority === 'medium');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Notices & Announcements</h1>
          <p className="text-muted-foreground">Stay updated with the latest information</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All ({allNotices.length})</TabsTrigger>
            <TabsTrigger value="high">Important ({highPriority.length})</TabsTrigger>
            <TabsTrigger value="medium">Updates ({mediumPriority.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allNotices.map((notice, index) => (
                <div key={notice.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <NoticeCard notice={notice} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="high" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highPriority.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="medium" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediumPriority.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
