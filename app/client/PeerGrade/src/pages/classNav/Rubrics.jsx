import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Info, ChevronDown, Eye, FileText, Ruler } from 'lucide-react';
import { useUser } from "@/contexts/contextHooks/useUser";
import { getAllRubricsInClass, getRubricById } from '@/api/rubricApi';

const Rubrics = () => {
  const { classId } = useParams();
  const { user } = useUser();
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await getAllRubricsInClass(classId);
        if (response && response.status === 'Success' && Array.isArray(response.data)) {
          setRubrics(response.data);
        } else {
          setRubrics([]);
        }
      } catch (error) {
        console.error('Error fetching rubrics:', error);
        setRubrics([]);
      }
    };
  
    fetchRubrics();
  }, [classId]);

  const handleRubricClick = async (rubricId) => {
    try {
      const response = await getRubricById(rubricId);
      if (response.data && response.data) {
        setSelectedRubric(response.data);
      } else {
        setSelectedRubric(null);
      }
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching rubric details:', error);
      setSelectedRubric(null);
    }
  };

  return (
    <div className="p-6 bg-muted rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Rubrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rubrics.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No rubrics found</div>
        ) : (
          rubrics.map((rubric) => (
            <Card key={rubric.rubricId} className="hover:shadow-md transition-shadow bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-gray-800">{rubric.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">{rubric.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {rubric.criteria?.length || 0} Criteria
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    {rubric.totalMarks} Points
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleRubricClick(rubric.rubricId)} 
                  className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                  variant="ghost"
                >
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-2xl">{selectedRubric?.title}</DrawerTitle>
            <DrawerDescription>{selectedRubric?.description}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 bg-gray-100 rounded-md mb-4">
            <h4 className="font-semibold mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              How to read this rubric:
            </h4>
            <ul className="text-sm space-y-1">
              <li><Badge variant="outline" className="mr-2 bg-accent text-slate-900">Criteria</Badge> Specific aspects of the assignment being evaluated</li>
              <li><Badge variant="outline" className="mr-2 bg-accent text-slate-900">Ratings</Badge> Descriptions of performance levels for each criterion</li>
              <li><Badge variant="outline" className="mr-2 bg-accent text-slate-900">Points</Badge> Score associated with each rating level</li>
            </ul>
          </div>
          <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Criteria</TableHead>
                  <TableHead>Ratings</TableHead>
                  <TableHead className="w-[100px] text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedRubric && selectedRubric.criteria && selectedRubric.criteria.map((criterion, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{criterion.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {criterion.criterionRatings && criterion.criterionRatings.map((rating, ratingIndex) => (
                          <div key={ratingIndex} className="flex items-center bg-gray-100 rounded p-2">
                            <p className="text-sm mr-2">{rating.description}</p>
                            <Badge variant="secondary">{rating.points}</Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-accent text-slate-900">
                        {criterion.criterionRatings.reduce((sum, rating) => sum + (parseFloat(rating.points) || 0), 0)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DrawerFooter>
            <p className="text-sm text-gray-500">Total Points: {selectedRubric?.totalMarks}</p>
            <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}><ChevronDown className='w-6 h-6'/></Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Rubrics;