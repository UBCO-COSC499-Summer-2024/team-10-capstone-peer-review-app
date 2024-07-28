import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon, Check as CheckIcon, Upload } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from "@/utils/utils";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList, CommandEmpty, CommandInput } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { getAssignmentInClass, updateAssignmentInClass } from '@/api/assignmentApi';
import { getCategoriesByClassId, getStudentsByClassId } from '@/api/classApi';
import { getAllRubricsInClass } from '@/api/rubricApi';
import { extendDeadlineForStudent, deleteExtendedDeadlineForStudent } from '@/api/assignmentApi';

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  maxSubmissions: z.number().min(1, "Max submissions is required"),
  categoryId: z.string().min(1, "Category is required"),
  reviewOption: z.string().min(1, "Review option is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  file: z.any().optional(),
});

const EditAssignment = () => {
  const navigate = useNavigate();
  const { classId, assignmentId } = useParams();

  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [selectStudentOpen, setSelectStudentOpen] = useState(false);
  const [selectNewDueDateOpen, setSelectNewDueDateOpen] = useState(false);
  const [openExtendDeadlines, setOpenExtendDeadlines] = useState(false);

  const [value, setValue] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubrics, setSelectedRubrics] = useState([]);

  const [extendedDueDates, setExtendedDueDates] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [newDueDate, setNewDueDate] = useState(null);
  const [students, setStudents] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(''); // Student ID to confirm delete
  
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      maxSubmissions: 1,
      categoryId: "",
      reviewOption: "",
      dueDate: null,
      file: null,
    }
  });

  const dropdown_options = [
    { value: "manual", label: "Manual" },
    { value: "auto", label: "Auto" }
  ];


  useEffect(() => {
    const fetchAssignmentAndCategories = async () => {
      try {
        const [assignmentResponse, categoriesResponse, rubricsResponse] = await Promise.all([
          getAssignmentInClass(classId, assignmentId),
          getCategoriesByClassId(classId),
          getAllRubricsInClass(classId)
        ]);
    
        if (assignmentResponse.status === 'Success' && 
            categoriesResponse.status === 'Success' &&
            rubricsResponse.status === 'Success') {
          const assignmentData = assignmentResponse.data;
          console.log("assignment", assignmentData);
          setCategories(categoriesResponse.data);
          setExtendedDueDates(assignmentData.extendedDueDates || []);
          console.log('rubrics', rubricsResponse.data);
          setRubrics(rubricsResponse.data);
    
          form.reset({
            title: assignmentData.title,
            description: assignmentData.description,
            maxSubmissions: assignmentData.maxSubmissions,
            categoryId: assignmentData.categoryId,
            reviewOption: assignmentData.reviewOption,
            dueDate: new Date(assignmentData.dueDate),
          });
    
          setSelectedCategory(assignmentData.categoryId);
          setSelectedFileName(assignmentData.assignmentFilePath ? assignmentData.assignmentFilePath.split('/').pop() : '');
          
          // Check if assignmentData.rubrics exists before mapping
          if (assignmentData.rubrics && Array.isArray(assignmentData.rubrics)) {
            setSelectedRubrics(assignmentData.rubrics.map(rubric => rubric.rubricId));
          } else {
            setSelectedRubrics([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      }
    };

    const fetchStudents = async () => {
      const response = await getStudentsByClassId(classId);
      if (response.status === 'Success') {
        setStudents(response.data.map(student => ({studentId: student.userId, label: student.firstname + ' ' + student.lastname})));
      }
    };
    fetchStudents();
    fetchAssignmentAndCategories();
  }, [classId, assignmentId, form]);


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFileName(selectedFile.name);
    form.setValue("file", selectedFile);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('classId', classId);
    formData.append('assignmentId', assignmentId);
    formData.append('categoryId', selectedCategory);
    formData.append('assignmentData', JSON.stringify({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      reviewOption: data.reviewOption,
      maxSubmissions: data.maxSubmissions,
    }));
    formData.append('rubrics', JSON.stringify(selectedRubrics));

    if (fileInputRef.current.files[0]) {
      formData.append('file', fileInputRef.current.files[0]);
    }
  
    try {
      const response = await updateAssignmentInClass(formData);
  
      if (response.status === 'Success') {
        toast({
          title: "Assignment Updated",
          description: "The assignment has been successfully updated.",
          variant: "positive",
        });
        
        // Clear the form and reset fields
        form.reset({
          title: "",
          description: "",
          maxSubmissions: 1,
          categoryId: "",
          reviewOption: "",
          dueDate: null,
          file: null,
        });
        
        setSelectedCategory("");
        setSelectedFileName("");
        setValue("");
        
        // Redirect to the assignment page
        navigate(`/class/${classId}/assignment/${assignmentId}`);
      } else {
        toast({
          title: "Error",
          description: response.message,
          status: "error"
        });
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: "There was an error updating the assignment.",
        variant: "destructive",
      });
    }
  };

  const handleAddExtendedDueDate = async () => {
    if (selectedStudent && newDueDate) {
      const response = await extendDeadlineForStudent(assignmentId, selectedStudent.studentId, newDueDate);
      if (response.status === 'Success') {
        if (extendedDueDates.find(entry => entry.userId === selectedStudent.studentId)) {
          setExtendedDueDates(prev => prev.map(entry => entry.userId === selectedStudent.studentId ? { userId: selectedStudent.studentId, newDueDate } : entry));
        } else {
          setExtendedDueDates(prev => [...prev, { userId: selectedStudent.studentId, newDueDate }]);
        }
        setSelectedStudent("");
        setNewDueDate(null);
        toast({
          title: "Extended Due Date Added",
          description: "The due date has been successfully extended for the selected student.",
          variant: "positive",
        });
      }
    }
  };

  const handleDeleteExtendedDueDate = async (studentId) => {
    if (confirmDelete === studentId) {
      setConfirmDelete('');
      const response = await deleteExtendedDeadlineForStudent(studentId, assignmentId);
      if (response.status === 'Success') {
        setExtendedDueDates(prev => prev.filter(entry => entry.userId !== studentId));
        toast({
          title: "Extended Due Date Removed",
          description: "The extended due date has been successfully removed.",
          variant: "positive",
        });
      }
    } else {
      setConfirmDelete(studentId);
    }
  };

  return (
    <div className='flex bg-white justify-left flex-row p-4'>
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className="text-xl font-semibold">Edit Assignment</h2>
          <Button
            variant='outline'
            className='bg-white text-primary'
            onClick={() => {
            setOpenExtendDeadlines(true);
            setConfirmDelete('');
            }}
          >
            Extend Deadlines
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Assignment #1" {...field} />
                  </FormControl>
                  <FormDescription>This is what will show up as the assignment's title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Use 12pt double-spaced font..." {...field} />
                  </FormControl>
                  <FormDescription>This is the text that will show as the assignment's description.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxSubmissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attempts</FormLabel>
                  <FormControl>
                    <Input  {...field} type="number" onBlur={(e) => field.onChange(Number(e.target.value))}/>
                  </FormControl>
                  <FormDescription>Max number of submissions.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reviewOption"
              render={({ field }) => (
                <FormItem style={{ display: 'flex', flexDirection: 'column' }}>
                  <FormLabel>Manual/Auto Review</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between bg-white"
                        >
                          {value
                            ? dropdown_options.find((option) => option.value === value)?.label
                            : "Select option..."}
                          {open
                            ? <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            : <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          }
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 rounded-md">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {dropdown_options.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                  setValue(currentValue === value ? "" : currentValue);
                                  setOpen(false);
                                  field.onChange(currentValue);
                                }}
                              >
                                {option.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    value === option.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Manual - Pick students to assign the peer review to manually. Auto - The system automatically picks students to assign the peer review to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem style={{ display: 'flex', flexDirection: 'column' }}>
                  <FormLabel>Due by:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[200px] font-normal bg-white flex flex-start",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>The assignment will be due at 11:59 PM on the selected date. The assignment will then be open for peer review right after the due date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem style={{ display: 'flex', flexDirection: 'column' }}>
                  <FormLabel>Category</FormLabel>
                  <Popover open={openCat} onOpenChange={setOpenCat}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between bg-white"
                        >
                          {selectedCategory
                            ? categories.find((category) => category.categoryId === selectedCategory)?.name
                            : "Select category..."}
                          {open
                            ? <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            : <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          }
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 rounded-md">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category.categoryId}
                                value={category.categoryId}
                                onSelect={(currentValue) => {
                                  setSelectedCategory(currentValue === selectedCategory ? "" : currentValue);
                                  setOpenCat(false);
                                  field.onChange(currentValue);
                                }}
                              >
                                {category.name}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedCategory === category.categoryId ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select a category for this assignment.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rubrics"
              render={({ field }) => (
                <FormItem style={{ display: 'flex', flexDirection: 'column' }}>
                  <FormLabel>Rubrics</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between bg-white"
                        >
                          Select Rubrics
                          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 rounded-md">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {rubrics.map((rubric) => (
                              <CommandItem
                                key={rubric.rubricId}
                                value={rubric.rubricId}
                                onSelect={(currentValue) => {
                                  setSelectedRubrics(prev => 
                                    prev.includes(currentValue)
                                      ? prev.filter(id => id !== currentValue)
                                      : [...prev, currentValue]
                                  );
                                  field.onChange(selectedRubrics);
                                }}
                              >
                                {rubric.title || 'Untitled Rubric'}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedRubrics.includes(rubric.rubricId) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select rubrics for this assignment.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel htmlFor="file-upload">Upload File</FormLabel>
              <input
                type="file"
                id="file-upload"
                ref={fileInputRef}
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div className="flex items-center">
                <Button type="button" className='bg-white mr-2' variant='outline' onClick={() => fileInputRef.current.click()}>
                  <Upload className='mr-2 h-4 w-4 shrink-0 opacity-50'/>
                  Upload File
                </Button>
                {selectedFileName && <span>{selectedFileName}</span>}
              </div>
              <FormDescription>Attach any PDF files related to the assignment.</FormDescription>
              <FormMessage />
            </FormItem>
            <Button type="submit" className='bg-primary text-white'>Update Assignment</Button>
          </form>
        </Form>
        <Dialog open={openExtendDeadlines} onOpenChange={setOpenExtendDeadlines}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Extend Deadlines</DialogTitle>
              <DialogDescription>
                Extend the deadline for this assignment for particular students here.
                Note: You can re-add the same student to edit the extended due date.
              </DialogDescription>
            </DialogHeader>

            {/* Table of current extended due dates */}
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 px-4 py-2">Student</th>
                  <th className="border border-gray-200 px-4 py-2">New Due Date</th>
                  <th className="border border-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {extendedDueDates.length === 0 && (
                  <tr>
                    <td colSpan="3" className="border border-gray-200 px-4 py-2 text-center">No extended due dates have been made yet.</td>
                  </tr>
                )}
                {extendedDueDates.map((entry, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 px-4 py-2 text-center">{students.find(student => student.studentId === entry.userId)?.label || 'Unknown'}</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">{format(new Date(entry.newDueDate), 'dd/MM/yyyy')}</td>
                    <td className="border border-gray-200 px-4 py-2 flex items-center justify-center">
                      {confirmDelete === entry.userId ?
                      (
                        <Button variant="ghost" className="bg-white text-red-500 border-red-500 border-2 hover:text-red-500 hover:bg-red-100" onClick={() => handleDeleteExtendedDueDate(entry.userId)}>Confirm Deletion</Button>
                      )
                      :
                      (
                        <Button variant="ghost" className="bg-red-500 text-white" onClick={() => handleDeleteExtendedDueDate(entry.userId)}>Delete</Button>
                      )
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col mt-4">
              {/* Student Selection */}
              <div className="mb-2">
                <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700">
                  Select Student
                </label>
                <Popover open={selectStudentOpen} onOpenChange={setSelectStudentOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-white mt-1 border"
                    >
                      {selectedStudent.label ? selectedStudent.label : "Select a student"}
                      {open ? (
                        <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      ) : (
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-5 rounded-md">
                    <Command>
                      <CommandInput placeholder="Search students..." />
                      <CommandList>
                        <CommandEmpty>No available students found.</CommandEmpty>
                        <CommandGroup>
                          {students.map((student) => (
                            <CommandItem
                              key={student.studentId}
                              value={student.label}
                              onSelect={() => setSelectedStudent(student)}
                            >
                              {student.label}
                              <CheckIcon
                                className={`ml-auto h-4 w-4 ${selectedStudent && selectedStudent.studentId === student.studentId ? "opacity-100" : "opacity-0"}`}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Due Date Picker */}
              <div className="mb-2">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  New Due Date
                </label>
                <Popover open={selectNewDueDateOpen} onOpenChange={setSelectNewDueDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 mt-1",
                        !newDueDate && "text-muted-foreground"
                      )}
                    >
                      {newDueDate ? format(newDueDate, "PPP") : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newDueDate}
                      onSelect={setNewDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button className='mt-4' onClick={handleAddExtendedDueDate}>Add Extended Due Date</Button>
            </div>

            <DialogFooter>
              <Button onClick={() => setOpenExtendDeadlines(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EditAssignment;