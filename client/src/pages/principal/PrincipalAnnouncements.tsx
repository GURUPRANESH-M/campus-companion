import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function PrincipalAnnouncements() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold font-serif text-foreground">Announcements</h1>
                <div className="bg-card border rounded-xl p-8 flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">The Announcements management view is under construction.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
