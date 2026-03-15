import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function PrincipalGrievances() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold font-serif text-foreground">Grievances Overview</h1>
                <div className="bg-card border rounded-xl p-8 flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">The Escalated Grievances view is under construction.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
