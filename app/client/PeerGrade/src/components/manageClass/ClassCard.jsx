import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClassCard = ({ classItem, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const truncateDescription = (text, lines = 3) => {
    return {
      display: '-webkit-box',
      WebkitLineClamp: lines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.5em',
      maxHeight: `${1.5 * lines}em`,
    };
  };

  return (
    <Card
      className="w-full h-[300px] cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
      onClick={() => navigate(`/manage-class/${classItem.classId}`)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{classItem.classname}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow max-h-[200px] justify-between">
        <div className="overflow-hidden">
          <p 
            className="text-sm text-gray-500" 
            style={truncateDescription(classItem.description)}
          >
            {classItem.description}
          </p>
        </div>
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">{classItem.userCount} students</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                <span className="text-sm">{classItem.assignmentCount} assignments</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;