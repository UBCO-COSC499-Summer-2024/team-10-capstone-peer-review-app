import { Calendar, ChevronRight } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

const GradeCard = ({
  assignmentId,
  classId,
  assignmentTitle,
  grade,
  totalMarks,
  dueDate,
  onViewGradeDetails,
  isGraded
}) => {
  const percentageGrade = totalMarks > 0 ? ((grade / totalMarks) * 100).toFixed(2) : 0;
  const gradeColor = percentageGrade >= 75 ? "bg-success/30 text-success/80" : percentageGrade >= 50 ? "bg-warning/30 text-warning/80" : "bg-destructive/20 text-destructive/80";

  return (
    <Alert className={cn("mb-4", isGraded && "bg-green-100")}>
      <AlertTitle className="flex justify-between items-center">
        <span>{assignmentTitle}</span>
        <Badge variant="outline" className={gradeColor}>{isGraded ? `${percentageGrade}%` : "Not Graded"}</Badge>
      </AlertTitle>
      <AlertDescription className="flex justify-between items-center mt-2">
        <span className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Due: {dueDate}
        </span>
        <div className="flex gap-2">
          <Link to={`/class/${classId}/assignment/${assignmentId}`}>
            <Button variant="outline" size="sm">
              View Assignment <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button 
            onClick={onViewGradeDetails} 
            variant="outline" 
            size="sm"
          >
            View Grade Details
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default GradeCard;