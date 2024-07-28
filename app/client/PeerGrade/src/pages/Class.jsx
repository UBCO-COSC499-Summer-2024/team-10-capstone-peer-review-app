import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Pencil, CheckCircle, Clock, Trash2, ChevronRight } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
  };

  useEffect(() => {
    if (!userLoading && user) {
      fetchClassData();
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

  const renderContent = () => {
    switch (currentView) {
      case "grades":
        return <Grades classAssignments={assignments} classId={classId} />;
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
            <Alert className="mb-6">
              <AlertTitle>Recent Announcements</AlertTitle>
              <AlertDescription>
                No recent announcements
              </AlertDescription>
            </Alert>
            <Accordion 
            type="single" 
            collapsible
            className="w-full bg-muted p-4 rounded-lg"
            value={openAccordion}
            onValueChange={(value) => setOpenAccordion(value)}
          >
            {categories.map((category) => (
              <AccordionItem value={category.categoryId} key={category.categoryId}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex justify-between w-full">
                    <span>{category.name}</span>
                    {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
                      <div className="flex gap-2">
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
                              className="bg-destructive/60 mr-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4 text-primary" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the category and all its contents.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category.categoryId)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4">
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
							isActive={currentView === "grades"}
							className="cursor-pointer"
							onClick={() => handleViewChange("grades")}
						>
							Grades
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
					<CardContent className="text-center py-6">
					<span className="block text-4xl font-bold">98%</span>
					<span className="text-gray-500">Class Grade</span>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="text-center py-6">
					<span className="block text-4xl font-bold">98%</span>
					<span className="text-gray-500">Avg Peer Grade</span>
					</CardContent>
				</Card>
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
