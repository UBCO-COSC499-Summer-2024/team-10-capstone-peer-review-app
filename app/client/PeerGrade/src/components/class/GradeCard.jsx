// The component for displaying a grade card

import { Calendar, ChevronRight } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

const GradeCard = ({
  reviewId,
  assignmentId,
  classId,
  assignmentTitle,
  grade,
  totalMarks,
  dueDate,
  onViewGradeDetails,  // Changed from viewDetailsLink
  isGraded
}) => {
  console.log("GradeCard: ", reviewId, assignmentId, classId, assignmentTitle, grade, totalMarks, dueDate, onViewGradeDetails, isGraded);
  const percentageGrade = totalMarks > 0 ? ((grade / totalMarks) * 100).toFixed(2) : 0;
  const gradeColor = percentageGrade >= 75 ? "bg-success/30 " : percentageGrade >= 50 ? "bg-warning/30 " : "bg-destructive/20 ";

  return (
    <Alert className={cn("mb-4")}>
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
            onClick={() => onViewGradeDetails(reviewId)}  // Changed this line
            variant="outline" 
            size="sm"
          >
            View Grade
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default GradeCard;