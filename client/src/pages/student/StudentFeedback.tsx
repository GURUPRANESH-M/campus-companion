import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/api";



const categories = [
  "Teaching Quality",
  "Communication",
  "Punctuality",
  "Subject Knowledge",
];

export default function StudentFeedback() {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setDataLoading(true);
        const res = await api.get('/faculty/department');
        setFacultyList(res.data);
      } catch (error) {
        console.error("Failed to fetch faculty", error);
        toast({
          title: "Error",
          description: "Could not load the faculty list.",
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };
    fetchFaculty();
  }, [toast]);

  const handleRating = (category: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = async () => {
    if (!selectedFaculty || Object.keys(ratings).length < categories.length) {
      toast({
        title: "Incomplete Feedback",
        description: "Please rate all categories.",
        variant: "destructive",
      });
      return;
    }

    const avgRating =
      Object.values(ratings).reduce((a, b) => a + b, 0) /
      Object.values(ratings).length;

    try {
      setLoading(true);

      await api.post("/feedback", {
        faculty: selectedFaculty,
        subject:
          facultyList.find((f) => f._id === selectedFaculty)?.handlingSubjects?.[0]?.subjectName || "Full Detailed Review",
        rating: Math.round(avgRating),
        comment: comments,
      });

      setSubmitted(true);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description:
          error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUCCESS SCREEN ================= */
  if (submitted) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
            <CheckCircle className="text-success" size={40} />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">
            Feedback Submitted Successfully!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your feedback helps improve education quality.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setSelectedFaculty("");
              setRatings({});
              setComments("");
            }}
          >
            Submit Another Feedback
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  /* ================= MAIN FORM ================= */
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-serif text-2xl font-bold">Faculty Feedback</h1>
          <p className="text-muted-foreground">
            Share your feedback to improve teaching quality
          </p>
        </div>

        {/* Faculty Select */}
        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <Label className="mb-3 block">Select Faculty</Label>
          <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
            <SelectTrigger>
              <SelectValue placeholder="Choose faculty" />
            </SelectTrigger>
            <SelectContent>
              {facultyList.map((f) => (
                <SelectItem key={f._id} value={f._id}>
                  {f.name} {f.handlingSubjects && f.handlingSubjects.length > 0 ? `– ${f.handlingSubjects[0].subjectName}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ratings */}
        {selectedFaculty && (
          <div className="bg-card rounded-xl p-6 border shadow-sm space-y-6">
            <h3 className="font-semibold text-lg">Rate Performance</h3>

            {categories.map((category) => (
              <div key={category}>
                <Label>{category}</Label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(category, star)}
                    >
                      <Star
                        size={28}
                        className={
                          ratings[category] >= star
                            ? "fill-warning text-warning"
                            : "text-muted-foreground/40"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <Label>Additional Comments</Label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmit}
              variant="gradient"
              className="w-full"
              disabled={loading}
            >
              <Send size={18} />
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
