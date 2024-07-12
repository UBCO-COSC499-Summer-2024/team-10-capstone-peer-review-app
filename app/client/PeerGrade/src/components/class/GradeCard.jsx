import { Calendar, CheckCircle, AlertCircle, Star } from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const GradeCard = ({
  assignmentId,
  classId,
  className,
  assignmentTitle,
  grade,
  dueDate
}) => {
  const gradeColor = grade >= 75 ? "bg-green-100 text-green-800" : grade >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";

  return (
    <Alert className="mb-4">
      <AlertTitle className="flex justify-between items-center">
        <span>{assignmentTitle}</span>
        <Badge className={gradeColor}>{grade}%</Badge>
      </AlertTitle>
      <AlertDescription className="flex justify-between items-center mt-2">
        <span className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Due: {dueDate}
        </span>
        <Link to={`/class/${classId}/assignment/${assignmentId}`} className="text-primary hover:text-primary-foreground">
          <button className="border border-gray-300 rounded-md px-2 py-1">Details</button>
        </Link>
      </AlertDescription>
    </Alert>
  );
};

export default GradeCard;
