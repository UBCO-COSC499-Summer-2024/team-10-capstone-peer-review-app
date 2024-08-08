// The component for displaying a class card in the Manage class page for instructors

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Eye, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const ClassCard = ({ classItem, pendingApprovals }) => {
  const navigate = useNavigate();

  // Truncate the description if it's longer than 100 characters
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Card className="w-full h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-primary">{classItem.classname}</CardTitle>
          {pendingApprovals > 0 && (
            <Badge variant="outline" className="ml-2 bg-warning/30 ">
              {pendingApprovals} Pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">
          {truncateDescription(classItem.description)}
        </p>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-primary" />
            <span>{classItem.userCount} students</span>
          </div>
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-1 text-primary" />
            <span>{classItem.assignmentCount} assignments</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 mr-2 hover:bg-primary/80 hover:text-primary-foreground bg-primary text-primary-foreground"
          onClick={() => navigate(`/class/${classItem.classId}`)}
        >
          <Eye className="w-4 h-4 mr-2" /> View Class
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 ml-2 hover:bg-primary/50 bg-slate-200 hover:text-primary-foreground"
          onClick={() => navigate(`/manage-class/${classItem.classId}`)}
        >
          <Settings className="w-4 h-4 mr-2" /> Manage Class
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassCard;