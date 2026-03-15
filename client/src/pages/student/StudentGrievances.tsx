import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GrievanceCard } from "@/components/dashboard/GrievanceCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import api from "@/api/api";
import { Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ✅ MUST MATCH BACKEND ENUM */
const categories = [
 { label:"Academic", value:"academic"},
 { label:"Examination", value:"exam"},
 { label:"Hostel", value:"hostel"},
 { label:"Administration", value:"admin"},
 { label:"Other", value:"other"}
];

export default function StudentGrievances() {

  const [grievances, setGrievances] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [isOpen, setIsOpen] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const { toast } = useToast();

  /* =====================
     FETCH GRIEVANCES
  ===================== */
  const fetchGrievances = async () => {
    try {
      const res =
        await api.get(
          "/grievances/my"
        );

      setGrievances(res.data);
    } catch (error) {
      console.error(error);

      toast({
        title:
          "Failed loading grievances",
        variant:
          "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit =
    async () => {

      if (
        !form.title ||
        !form.description ||
        !form.category
      ) {
        toast({
          title:
            "Fill all fields",
          variant:
            "destructive",
        });
        return;
      }

      try {

        await api.post(
          "/grievances",
          form
        );

        toast({
          title:
            "Grievance Submitted",
        });

        setForm({
          title: "",
          description: "",
          category: "",
        });

        setIsOpen(false);

        fetchGrievances();

      } catch (error) {

        console.error(error);

        toast({
          title:
            "Failed submission",
          description:
            "Check category or login",
          variant:
            "destructive",
        });
      }
    };

  /* STATUS COUNTS */

  const pending =
    grievances.filter(
      (g) =>
        g.status === "open"
    ).length;

  const progress =
    grievances.filter(
      (g) =>
        g.status ===
        "in_progress"
    ).length;

  const resolved =
    grievances.filter(
      (g) =>
        g.status ===
        "resolved"
    ).length;

  if (loading)
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between">

          <h1 className="text-2xl font-bold">
            Grievances
          </h1>

          <Dialog
            open={isOpen}
            onOpenChange={
              setIsOpen
            }
          >
            <DialogTrigger asChild>
              <Button>
                <Plus />
                New
              </Button>
            </DialogTrigger>

            <DialogContent>

              <DialogHeader>
                <DialogTitle>
                  Submit Grievance
                </DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Title"
                value={
                  form.title
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
              />

              <Select
                value={
                  form.category
                }
                onValueChange={(
                  value
                ) =>
                  setForm({
                    ...form,
                    category:
                      value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map(
                    (c) => (
                      <SelectItem
                        key={
                          c.value
                        }
                        value={
                          c.value
                        }
                      >
                        {c.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Textarea
                rows={4}
                placeholder="Description"
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target
                        .value,
                  })
                }
              />

              <Button
                onClick={
                  handleSubmit
                }
              >
                <Send />
                Submit
              </Button>

            </DialogContent>
          </Dialog>

        </div>

        {/* STATUS */}
        <div className="grid md:grid-cols-3 gap-4">

          <div>Open : {pending}</div>

          <div>
            In Progress :
            {progress}
          </div>

          <div>
            Resolved :
            {resolved}
          </div>

        </div>

        {/* LIST */}
        <div className="grid md:grid-cols-2 gap-4">

          {grievances.map(
            (g) => (
              <GrievanceCard
                key={g._id}
                grievance={g}
              />
            )
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}