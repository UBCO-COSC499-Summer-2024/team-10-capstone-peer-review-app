import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Info, Pencil, CheckCircle, Clock, Trash2, ChevronRight } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Grades from "./classNav/Grades";
import Groups from "./classNav/Groups";
import Assignments from "./classNav/Assignments";
import People from "./classNav/People";
import Rubrics from "./classNav/Rubrics";
import AssignmentCreation from "../components/assign/assignment/AssignmentCreation";
import EditClass from "../components/class/EditClass";
import { useUser } from "@/contexts/contextHooks/useUser";
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { getCategoriesByClassId } from "@/api/classApi";
import { createCategory, updateCategory, deleteCategory } from "@/api/categoryApi";
import { useToast } from "@/components/ui/use-toast";
import { useClass } from "@/contexts/contextHooks/useClass";
import CreateRubric from "../components/rubrics/CreateRubric";
import InfoButton from '../components/global/InfoButton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import reviewAPI from "@/api/reviewAPI";


const Class = () => {
  const { classId } = useParams();
  const [currentView, setCurrentView] = useState("home");
  const [assignments, setAssignments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rubricCreated, setRubricCreated] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(false);
  const [classAverage, setClassAverage] = useState(0);
  const [avgPeerGrade, setAvgPeerGrade] = useState(0);
  const [reviews, setReviews] = useState([]);
  const { toast } = useToast();
  const { user, userLoading } = useUser();
  const { classes } = useClass();

  const classItem = classes.find((classItem) => classItem.classId === classId);

  const fetchClassData = async () => {
    try {
      const [fetchedAssignments, fetchedCategories] = await Promise.all([
        getAllAssignmentsByClassId(classId),
        getCategoriesByClassId(classId)
      ]);
      setAssignments(fetchedAssignments.data);
      setCategories(fetchedCategories.data);
    } catch (error) {
      console.error("Failed to fetch class data", error);
      toast({
        title: "Error",
        description: "Failed to fetch class data",
        variant: "destructive"
      });
    }
  };

  const fetchReviews = async () => {
    try {
      let response;
      if (user.role === "STUDENT") {
        response = await reviewAPI.getReviewsReceived();
      } else if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
        response = await reviewAPI.getReviewsAssigned();
      }
      setReviews(response.data);
      calculateGrades(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive"
      });
    }
  };;
  
  const calculateGrades = (reviews) => {
    let totalInstructorPoints = 0;
    let totalPeerPoints = 0;
    let totalInstructorMaxPoints = 0;
    let totalPeerMaxPoints = 0;
  
    // Filter reviews for the current class
    const classReviews = reviews.filter(review => review.submission.assignment.classId === classId);
  
    classReviews.forEach(review => {
      const earnedPoints = review.reviewGrade;
      const maxPoints = review.submission.assignment.rubric.totalMarks;
  
      if (review.isPeerReview) {
        totalPeerPoints += earnedPoints;
        totalPeerMaxPoints += maxPoints;
      } else {
        totalInstructorPoints += earnedPoints;
        totalInstructorMaxPoints += maxPoints;
      }
    });
  
    const instructorGradePercentage = totalInstructorMaxPoints > 0
      ? (totalInstructorPoints / totalInstructorMaxPoints) * 100
      : 0;
  
    const peerGradePercentage = totalPeerMaxPoints > 0
      ? (totalPeerPoints / totalPeerMaxPoints) * 100
      : 0;
  
    setClassAverage(instructorGradePercentage.toFixed(2));
    setAvgPeerGrade(peerGradePercentage.toFixed(2));
  };

  const getGradeColorClass = (grade) => {
    if (grade < 50) return "text-red-700";
    if (grade < 75) return "text-amber-600";
    return "text-green-500";
  };

  const handleAddCategory = async () => {
    try {
      const response = await createCategory(classId, newCategoryName);
      if (response.status === "Success") {
        toast({
          title: "Success",
          description: "Category created successfully",
          variant: "info",
        });
        setIsAddCategoryOpen(false);
        setNewCategoryName("");
        fetchClassData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await updateCategory(editingCategory.categoryId, editingCategory.name);
      if (response.status === "Success") {
        toast({
          title: "Success",
          description: "Category updated successfully",
          variant: "info",
        });
        setEditingCategory(null);
        fetchClassData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirmDeleteCategory) {
      setConfirmDeleteCategory(false);
      try {
        const response = await deleteCategory(categoryId);
        if (response.status === "Success") {
          toast({
            title: "Success",
            description: "Category deleted successfully",
            variant: "default",
          });
          fetchClassData();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete category",
          variant: "destructive",
        });
      }
    } else {
      setConfirmDeleteCategory(true);
    }
  };

  useEffect(() => {
    if (!userLoading && user) {
      fetchClassData();
      fetchReviews();
    }
  }, [classId, user, userLoading, currentView]);

  useEffect(() => {
    if (rubricCreated && currentView === "rubrics") {
      fetchClassData();
      setRubricCreated(false);
    }
  }, [rubricCreated, currentView]);

  useEffect(() => {
	if (categories.length > 0 && openAccordion === null) {
	  setOpenAccordion(categories[0].categoryId);
	}
  }, [categories]);

  const handleViewChange = (view) => {
    setCurrentView(view);
    fetchClassData();
  };

  const handleRubricCreated = (newRubric) => {
    setRubricCreated(true);
    if (currentView === "rubrics") {
      fetchClassData();
    }
  };

  if (!classItem) {
    return <div>Class not found</div>;
  }

  const globalInfoContent = {
    title: "About the Classroom",
    description: (
      <>
        <p>This is the main classroom page. Here you can:</p>
        <ul className="list-disc list-inside mt-2">
          <li>View and manage assignments</li>
          <li>See class participants</li>
          <li>Manage groups</li>
          <li>Create and edit rubrics</li>
          <li>Edit class details (for instructors)</li>
        </ul>
        <p className="mt-2">Use the navigation menu to switch between different views.</p>
        
        {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
          <>
            <p className="mt-4 font-semibold">Instructor Tools:</p>
            <ul className="list-disc list-inside mt-2">
              <li>
                <strong>Create Assignment:</strong> Use this button to add new assignments to the class.
              </li>
              <li>
                <strong>Add Category:</strong> Organize assignments by creating new categories.
              </li>
              <li>
                <strong>Create Rubric:</strong> Design grading rubrics for assignments to standardize evaluation.
              </li>
            </ul>
            <p className="mt-2">
              These tools are located on the right side of the page for quick access and management of class content.
            </p>
          </>
        )}
      </>
    )
  };

  const renderContent = () => {
    switch (currentView) {
      case "people":
        return <People classId={classId} />;
      case "groups":
        return <Groups classId={classId} />;
      case "assignments":
        return <Assignments classId={classId} />;
      case "assignmentCreation":
        return <AssignmentCreation onAssignmentCreated={() => {
          fetchClassData();
          handleViewChange("files");
        }} />;
      case "edit":
        return <EditClass classItem={classItem} />;
      case "rubrics":
        return <Rubrics key={rubricCreated} classId={classId} />;
      default:
        return (
          <>
            <Accordion 
            type="single" 
            collapsible
            className="w-full bg-muted px-6 py-2 rounded-lg space-y-2"
            value={openAccordion}
            onValueChange={(value) => setOpenAccordion(value)}
          >
            {categories.map((category) => (
              <AccordionItem value={category.categoryId} key={category.categoryId} className='border-none'>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex justify-between w-full">
                    <span>{category.name}</span>
                    {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategory(category);
                          }}
                        >
                          <Pencil className="h-4 w-4 text-primary" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mr-2 hover:bg-red-100 hover:text-red-500"
                              onClick={(e) => {
                                setConfirmDeleteCategory(false);
                                e.stopPropagation();
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className={confirmDeleteCategory ? "text-white bg-red-500 border-red-800" : ""}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you {confirmDeleteCategory ? "really " : ""}sure you want to delete this category?</AlertDialogTitle>
                              <AlertDialogDescription className={confirmDeleteCategory ? "text-white" : ""}>
                                This action cannot be undone. This will permanently delete the category and all its contents.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className={confirmDeleteCategory ? "text-black" : ""}>Cancel</AlertDialogCancel>
                              <Button onClick={() => handleDeleteCategory(category.categoryId)}>
                                Delete
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4">
                      {category.assignments.length === 0 && <div className="text-center">There are no assignments here.</div>}
                      {category.assignments.map((assignment) => (
                        <Link
                          key={assignment.assignmentId}
                          to={`/class/${classId}/assignment/${assignment.assignmentId}`}
                          className="block"
                        >
                          <Alert 
                            variant="default" 
                            className="hover:bg-accent cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <AlertTitle className="text-base font-medium flex items-center gap-2">
                                  {assignment.title}
                                  {assignment.status === 'Completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                </AlertTitle>
                                <AlertDescription className="text-sm text-muted-foreground mt-1">
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </AlertDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <ChevronRight className='h-5 w-5' />
                              </div>
                            </div>
                          </Alert>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <InfoButton content={globalInfoContent} user={user} />
          </>
        );
    }
  };
	
	  return (
		<div className="w-full px-6">
		  <div className="flex flex-col gap-1 mt-5 mb-6 rounded-lg">
			<h1 className="text-3xl font-bold">{classItem.classname}</h1>
			<span className="ml-1 text-sm text-gray-500 mb-2">
			  {classItem.description}
			</span>
	
			<Menubar className="flex gap-2">
					<MenubarMenu>
						<MenubarTrigger
							isActive={currentView === "home"}
							className="cursor-pointer"
							onClick={() => handleViewChange("home")}
						>
							Home
						</MenubarTrigger>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger
							isActive={currentView === "assignments"}
							className="cursor-pointer"
							onClick={() => handleViewChange("assignments")}
						>
							Assignments
						</MenubarTrigger>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger
							isActive={currentView === "people"}
							className="cursor-pointer"
							onClick={() => handleViewChange("people")}
						>
							People
						</MenubarTrigger>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger
							isActive={currentView === "groups"}
							className="cursor-pointer"
							onClick={() => handleViewChange("groups")}
						>
							Groups
						</MenubarTrigger>
					</MenubarMenu>
					{(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
						<MenubarMenu>
							<MenubarTrigger
								isActive={currentView === "edit"}
								className="cursor-pointer"
								onClick={() => handleViewChange("edit")}
							>
								Edit
							</MenubarTrigger>
						</MenubarMenu>
					)}
					{(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
						<MenubarMenu>
							<MenubarTrigger
								isActive={currentView === "rubrics"}
								className="cursor-pointer"
								onClick={() => handleViewChange("rubrics")}
							>
								Rubrics
							</MenubarTrigger>
						</MenubarMenu>
					)}
				</Menubar>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
          {renderContent()}
          {/* Add Category Dialog */}
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
              <DialogFooter>
                <Button onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <Input
                value={editingCategory?.name || ""}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                placeholder="Enter new category name"
              />
              <DialogFooter>
                <Button onClick={() => setEditingCategory(null)}>Cancel</Button>
                <Button onClick={handleEditCategory}>Update Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
				<div className="space-y-3">
				{(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") &&
					currentView !== "assignmentCreation" && (
					<>
					<Button
						variant="outline"
						onClick={() => handleViewChange("assignmentCreation")}
						className="w-full bg-white"
					>
						Create Assignment
					</Button>
          {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
            <Button
              variant="outline"
              onClick={() => setIsAddCategoryOpen(true)}
              className="w-full bg-muted"
            >
              Add Category
            </Button>
          )}
					<CreateRubric 
            classId={classId} 
            assignments={assignments} 
            onRubricCreated={handleRubricCreated} 
          />					
					</>
					)}
         <Card>
          <CardContent className="text-center py-6 relative">
            <div className="flex flex-col gap-2">
              <span className={`text-4xl font-bold ${getGradeColorClass(parseFloat(classAverage))}`}>
                {classAverage}%
              </span>
              <span className="text-gray-500">
                {user.role === "STUDENT" ? "Average Class Grade" : "Average Grade of All Students "}
              </span>
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" className="absolute top-2 right-2">
                  <Info className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <h3 className="font-semibold mb-2">Grade Color Legend</h3>
                <p className="text-sm bg-destructive/20 p-1 mb-1">Below 50%: Needs Improvement</p>
                <p className="text-sm bg-warning/20 p-1 mb-1">50% - 74%: Satisfactory</p>
                <p className="text-sm bg-success/20 p-1">75% and above: Excellent</p>
              </HoverCardContent>
            </HoverCard>
          </CardContent>
        </Card>
        {user.role === "STUDENT" && (
          <Card>
            <CardContent className="text-center py-6 relative">
              <span className={`block text-4xl font-bold ${getGradeColorClass(parseFloat(avgPeerGrade))}`}>
                {avgPeerGrade}%
              </span>
              <span className="text-gray-500">Avg Peer Grade</span>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="sm" className="absolute top-2 right-2">
                    <Info className="h-4 w-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <h3 className="font-semibold mb-2">Grade Color Legend</h3>
                  <p className="text-sm bg-destructive/20 p-1 mb-1">Below 50%: Needs Improvement</p>
                  <p className="text-sm bg-warning/20 p-1 mb-1">50% - 74%: Satisfactory</p>
                  <p className="text-sm bg-success/20 p-1">75% and above: Excellent</p>
                </HoverCardContent>
              </HoverCard>
            </CardContent>
          </Card>
        )}
				<Card>
					<CardHeader>
					<CardTitle>To Do</CardTitle>
					</CardHeader>
					<CardContent>
					<Alert>
						<AlertDescription>No tasks due</AlertDescription>
					</Alert>
					</CardContent>
				</Card>
				</div>
			</div>
			</div>
		);
		};

		export default Class;
