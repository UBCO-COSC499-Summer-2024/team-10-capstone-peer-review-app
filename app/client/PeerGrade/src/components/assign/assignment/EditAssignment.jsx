import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon, Check as CheckIcon, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelect from '@/components/ui/MultiSelect';
import { cn } from "@/utils/utils";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList, CommandEmpty, CommandInput } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { getAssignmentInClass, updateAssignmentInClass } from '@/api/assignmentApi';
import { getCategoriesByClassId, getStudentsByClassId } from '@/api/classApi';
import { getAllRubricsInClass } from '@/api/rubricApi';
import { extendDeadlineForStudent, deleteExtendedDeadlineForStudent } from '@/api/assignmentApi';
import ExtendDeadlinesDialog from './ExtendDeadlinesDialog';

const fileTypeOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'DOC' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
];

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
  const [selectedRubric, setSelectedRubric] = useState("");
  
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxSubmissions: 1,
    categoryId: "",
    dueDate: null,
    rubricId: "",
    allowedFileTypes: [],
    file: null,
  });
  
  const [selectedFileName, setSelectedFileName] = useState('');
  const [categories, setCategories] = useState([]);
  const [rubrics, setRubrics] = useState([]);

  const [extendedDueDates, setExtendedDueDates] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [newDueDate, setNewDueDate] = useState(null);
  const [students, setStudents] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(''); // Student ID to confirm delete
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAssignmentAndData = async () => {
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
          
          setFormData({
            title: assignmentData.title,
            description: assignmentData.description,
            maxSubmissions: assignmentData.maxSubmissions,
            categoryId: assignmentData.categoryId,
            dueDate: new Date(assignmentData.dueDate),
            rubricId: assignmentData.rubricId,
            allowedFileTypes: assignmentData.allowedFileTypes || [],
          });
    
          setSelectedFileName(assignmentData.assignmentFilePath ? assignmentData.assignmentFilePath.split('/').pop() : '');
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
    fetchAssignmentAndData();
  }, [classId, assignmentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFileName(selectedFile.name);
    setFormData(prev => ({ ...prev, file: selectedFile }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.rubricId) newErrors.rubricId = "Rubric is required";
    if (formData.maxSubmissions <= 0) newErrors.maxSubmissions = "Max submissions must be greater than 0";
    if (formData.allowedFileTypes.length === 0) newErrors.allowedFileTypes = "Please select at least one file type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields",
        variant: "destructive",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('classId', classId);
    formDataToSend.append('assignmentId', assignmentId);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('assignmentData', JSON.stringify({
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      maxSubmissions: formData.maxSubmissions,
      rubricId: formData.rubricId,
      allowedFileTypes: formData.allowedFileTypes,
    }));
  
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }
  
    try {
      const response = await updateAssignmentInClass(formDataToSend);
  
      if (response.status === 'Success') {
        toast({
          title: "Data Updated",
          description: "The assignment has been successfully updated.",
          status: "success",
          variant: "info"
        });
        
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
        <h2 className="text-xl font-semibold mb-4">Edit Assignment</h2>
        <form onSubmit={onSubmit} className="space-y-10">
          <div className='flex items-center justify-between'>
            <label htmlFor="title">Title</label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              placeholder="e.g. Assignment #1" 
              className={errors.title ? "border-red-500" : ""}
            />
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
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="e.g. Use 12pt double-spaced font..." 
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="maxSubmissions">Attempts</label>
            <Input 
              id="maxSubmissions" 
              name="maxSubmissions" 
              type="number" 
              value={formData.maxSubmissions} 
              onChange={handleInputChange} 
              className={errors.maxSubmissions ? "border-red-500" : ""}
            />
            {errors.maxSubmissions && <p className="text-red-500 text-sm mt-1">{errors.maxSubmissions}</p>}
          </div>

          <div className='flex flex-col gap-2'>
            <label>Due by:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground",
                    errors.dueDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={formData.dueDate} 
                  onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
            {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
          </div>

          <div>
            <label>Category</label>
            <Select 
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              value={formData.categoryId}
              defaultValue={formData.categoryId} // Add this line
            >
              <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
          </div>

          <div>
            <label>Rubric</label>
            <Select 
              onValueChange={(value) => setFormData(prev => ({ ...prev, rubricId: value }))}
              value={formData.rubricId}
              defaultValue={formData.rubricId} // Add this line
            >
              <SelectTrigger className={errors.rubricId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a rubric" />
              </SelectTrigger>
              <SelectContent>
                {rubrics.map((rubric) => (
                  <SelectItem key={rubric.rubricId} value={rubric.rubricId}>
                    {rubric.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rubricId && <p className="text-red-500 text-sm mt-1">{errors.rubricId}</p>}
          </div>

          <div>
            <label>Allowed File Types</label>
            <MultiSelect
              options={fileTypeOptions}
              value={formData.allowedFileTypes}
              onChange={(value) => setFormData(prev => ({ ...prev, allowedFileTypes: value }))}
              placeholder="Select allowed file types"
              className={errors.allowedFileTypes ? "border-red-500" : ""}
            />
            {errors.allowedFileTypes && <p className="text-red-500 text-sm mt-1">{errors.allowedFileTypes}</p>}
          </div>

          <div>
            <label htmlFor="file-upload">Upload File</label>
            <input
              type="file"
              id="file-upload"
              ref={fileInputRef}
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
            <p className='text-sm text-slate-600 mt-3'>Attach any files related to the assignment (PDFs preferred).</p>
          </div>
          <Button type="submit" className='bg-primary text-white'>Update Assignment</Button>
        </form>
        <ExtendDeadlinesDialog
          assignmentId={assignmentId}
          openExtendDeadlines={openExtendDeadlines}
          setOpenExtendDeadlines={setOpenExtendDeadlines}
          students={students}
          extendedDueDates={extendedDueDates}
          setExtendedDueDates={setExtendedDueDates}
          extendDeadlineForStudent={extendDeadlineForStudent}
          confirmDelete={confirmDelete}
          setConfirmDelete={setConfirmDelete}
          deleteExtendedDeadlineForStudent={deleteExtendedDeadlineForStudent}
        />
      </div>
    </div>
  );
};

export default EditAssignment;