import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockFeedback } from '@/data/mockData';
import { Star, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const facultyList = [
  { id: '1', name: 'Dr. Priya Patel', subject: 'Data Structures' },
  { id: '2', name: 'Dr. Ravi Kumar', subject: 'Database Systems' },
  { id: '3', name: 'Prof. Meena Shah', subject: 'Operating Systems' },
];

const categories = ['Teaching Quality', 'Communication', 'Punctuality', 'Subject Knowledge'];

export default function StudentFeedback() {
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleRating = (category: string, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = () => {
    if (!selectedFaculty || Object.keys(ratings).length < categories.length) {
      toast({
        title: "Incomplete Feedback",
        description: "Please rate all categories before submitting.",
        variant: "destructive",
      });
      return;
    }
    setSubmitted(true);
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your valuable feedback!",
    });
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
            <CheckCircle className="text-success" size={40} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            Feedback Submitted Successfully!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your feedback helps improve the quality of education.
          </p>
          <Button onClick={() => {
            setSubmitted(false);
            setSelectedFaculty('');
            setRatings({});
            setComments('');
          }}>
            Submit Another Feedback
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Faculty Feedback</h1>
          <p className="text-muted-foreground">Share your feedback to help improve teaching quality</p>
        </div>

        {/* Faculty Selection */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <Label className="text-base font-medium mb-3 block">Select Faculty</Label>
          <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a faculty member" />
            </SelectTrigger>
            <SelectContent>
              {facultyList.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.id}>
                  <div>
                    <span className="font-medium">{faculty.name}</span>
                    <span className="text-muted-foreground ml-2">- {faculty.subject}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Categories */}
        {selectedFaculty && (
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm space-y-6">
            <h3 className="font-serif font-semibold text-lg text-foreground">Rate Performance</h3>
            
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <Label className="text-sm font-medium">{category}</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(category, star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          ratings[category] >= star
                            ? 'fill-warning text-warning'
                            : 'text-muted-foreground/40'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {ratings[category] ? `${ratings[category]}/5` : 'Not rated'}
                  </span>
                </div>
              </div>
            ))}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Additional Comments (Optional)</Label>
              <Textarea
                placeholder="Share any additional feedback or suggestions..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleSubmit} variant="gradient" size="lg" className="w-full">
              <Send size={18} />
              Submit Feedback
            </Button>
          </div>
        )}

        {/* Previous Feedback Info */}
        <div className="bg-muted/50 rounded-xl p-6 border border-border">
          <h3 className="font-serif font-semibold text-lg text-foreground mb-4">About Faculty Feedback</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Your feedback is anonymous and confidential</li>
            <li>• Feedback helps faculty improve their teaching methods</li>
            <li>• Rate honestly based on your actual experience</li>
            <li>• Constructive criticism is encouraged</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
