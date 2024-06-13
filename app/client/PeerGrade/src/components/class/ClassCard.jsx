import { User, FileText, CheckSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const ClassCard = ({ classId, className, instructor, numStudents, numAssignments, numPeerReviews }) => {
  return (
    <Link to={`/class/${classId}`}>
      <Card className="w-full flex lg:flex-col items-start justify-between bg-white shadow-md rounded-lg hover:shadow-lg ">
        <CardHeader  className="bg-gray-900 rounded-t-lg text-white w-full">
          <CardTitle className="text-xl font-bold text-colored">{className}</CardTitle>
          <CardDescription className="text-gray-300">{instructor}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-700" />
            <span className="text-gray-700">{numStudents} Students</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-700" />
            <span className="text-gray-700">{numAssignments} Assignments Due</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-gray-700" />
            <span className="text-gray-700">{numPeerReviews} Peer Reviews Left</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClassCard;
