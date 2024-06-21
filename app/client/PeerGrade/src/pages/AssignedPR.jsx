import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignment as assignmentsData, iClass as classesData, submission as submissionsData, user as usersData, PeerReview as peerReviewData } from '@/utils/dbData';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PDFViewer from '@/components/assign/PDFViewer';

const AssignedPR = () => {
  const { assignmentId } = useParams();
  const assignment = assignmentsData.find((item) => item.assignment_id === parseInt(assignmentId));

  const [expanded, setExpanded] = useState({});
  const [maxHeight, setMaxHeight] = useState({});

  const contentRefs = useRef([]);

  useEffect(() => {
    const newMaxHeights = {};
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        newMaxHeights[`box${index}`] = `${ref.scrollHeight}px`;
      }
    });
    setMaxHeight(newMaxHeights);
  }, [contentRefs.current]);

	if (!assignment) {
		return <div>Assignment not found</div>;
	}

  const classItem = classesData.find(classItem => classItem.class_id === assignment.class_id);
  const instructor = usersData.find(user => user.user_id === classItem.instructor_id);

  const peerReviews = peerReviewData.filter(review => {
    const submission = submissionsData.find(sub => sub.submission_id === review.submission_id);
    return submission && submission.assignment_id === assignment.assignment_id;
  });

  const toggleExpand = (box) => {
    setExpanded((prev) => ({ ...prev, [box]: !prev[box] }));
  };

  return (
    <div className="w-screen main-container mx-5 p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Link to="/peer-review" className="text-xl">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">{classItem.classname}: {assignment.title}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white p-4 shadow-md mb-6">
            <CardContent className="bg-gray-100 p-4 rounded">{assignment.description}</CardContent>
          </Card>
          {peerReviews.map((review, index) => (
            <Card key={review.review_id} className="bg-white p-4 shadow-md mb-6">
              <CardHeader className="flex justify-center items-center">
                <CardTitle className="text-lg font-bold">Peer Review Document {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-100 p-4 rounded relative">
              <div ref={(el) => (contentRefs.current[index] = el)} className={`transition-all duration-300 ${expanded[`box${index}`] ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
                  <div className="flex justify-between gap-2 p-2">
                    {/* reviewr name if instructor signed in */}
                    <div>
                      <strong>Reviewer:</strong> {usersData.find(user => user.user_id === review.reviewer_id)?.firstname} {usersData.find(user => user.user_id === review.reviewer_id)?.lastname}
                      <p><strong>Review:</strong> {review.review}</p>
                      <p><strong>Rating:</strong> {review.rating}</p>
                    </div>
                    <Button variant="default" size="default">Download</Button>
                  </div>
                </div>
                <div className={`bg-white border border-gray-200 overflow-hidden transition-all duration-300 ${expanded[`box${index}`] ? '' : 'h-32'} flex justify-center items-center`}>
                  {/* Preview content */}
                  <PDFViewer url="https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK" scale="1" />
                </div>
                <div className="flex justify-center mt-2">
                  <Button variant="link" onClick={() => toggleExpand(`box${index}`)}>
                    {expanded[`box${index}`] ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
                
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="bg-gray-100 p-4 rounded">Comment Box</CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="text-center">
              <h2 className="text-xl font-bold mb-4">Average Peer Review Grade</h2>
              <div className="w-24 mx-auto">
                <CircularProgressbar
                  value={90}
                  text={`${90}%`}
                  styles={buildStyles({
                    textColor: "#4A5568",
                    pathColor: "#4A90E2",
                    trailColor: "#D3D3D3"
                  })}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="text-center">
              <h2 className="text-xl font-bold mb-4">Assignment Instructor Grade</h2>
              <div className="w-24 mx-auto">
                <CircularProgressbar
                  value={85}
                  text={`${85}%`}
                  styles={buildStyles({
                    textColor: "#4A5568",
                    pathColor: "#4A90E2",
                    trailColor: "#D3D3D3"
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignedPR;
