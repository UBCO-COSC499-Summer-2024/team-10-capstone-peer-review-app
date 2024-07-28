import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon, Check as CheckIcon, Upload } from 'lucide-react';
import MultiSelect from '@/components/ui/MultiSelect';
import RubricCreationForm from '@/components/rubrics/RubricCreationForm';
import { cn } from '@/utils/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { getCategoriesByClassId } from '@/api/classApi';
import { addAssignmentToClass, addAssignmentWithRubric } from '@/api/assignmentApi';
import { getAllRubricsInClass } from '@/api/rubricApi';
import { useUser } from "@/contexts/contextHooks/useUser";

const fileTypeOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'DOC' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
];

const AssignmentCreation = ({ onAssignmentCreated }) => {
  const { classId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maxSubmissions: 1,
    categoryId: '',
    dueDate: null,
    allowedFileTypes: [],
    rubricId: '',
  });
  const [categories, setCategories] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [newRubricData, setNewRubricData] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [resetRubricForm, setResetRubricForm] = useState(false);
  const [isRubricFormOpen, setIsRubricFormOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { user, userLoading } = useUser();


  useEffect(() => {
    const fetchCategoriesAndRubrics = async () => {
      try {
        const [categoriesResponse, rubricsResponse] = await Promise.all([
          getCategoriesByClassId(classId),
          getAllRubricsInClass(classId)
        ]);
        setCategories(categoriesResponse.data);
        setRubrics(rubricsResponse.data);
      } catch (error) {
        console.error("Error fetching categories and rubrics:", error);
      }
    };

    fetchCategoriesAndRubrics();
  }, [classId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFileName(selectedFile.name);
    setFormData(prev => ({ ...prev, file: selectedFile }));
  };

  const handleRubricSelection = (value) => {
    setFormData(prev => ({
      ...prev,
      rubricId: value
    }));
    setNewRubricData(null);  // Clear any new rubric data when selecting an existing rubric
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dueDate || !formData.categoryId || (!formData.rubricId && !newRubricData)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select or create a rubric",
        status: "error"
      });
      return;
    }
  
    try {
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        maxSubmissions: parseInt(formData.maxSubmissions, 10), // Ensure this is a number
        allowedFileTypes: formData.allowedFileTypes,
        rubricId: formData.rubricId,
      };
  
      let response;
      if (newRubricData) {
        const data = {
          classId,
          categoryId: formData.categoryId,
          assignmentData: assignmentData,
          rubricData: newRubricData,
          creatorId: user.userId,
          file: formData.file
        };
        response = await addAssignmentWithRubric(data);
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append('classId', classId);
        formDataToSend.append('categoryId', formData.categoryId);
        formDataToSend.append('assignmentData', JSON.stringify(assignmentData));
        if (formData.file) {
          formDataToSend.append('file', formData.file);
        }
        response = await addAssignmentToClass(formDataToSend);
      }

      console.log('Assignment created:', response);
      toast({
        title: "Success",
        description: "Assignment created successfully",
        status: "success"
      });
      onAssignmentCreated();
      // Reset form
      setFormData({
        title: '',
        description: '',
        maxSubmissions: 1,
        categoryId: '',
        dueDate: null,
        allowedFileTypes: [],
        rubricId: '',
      });
      setSelectedFileName('');
      setNewRubricData(null);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Error",
        description: "There was an error creating the assignment.",
        status: "error"
      });
    }
  };

  const resetRubric = () => {
    setNewRubricData(null);
    setFormData(prev => ({ ...prev, rubricId: '' }));
    setIsRubricFormOpen(false);
  };

  return (
    <div className='w-full flex bg-white justify-left flex-row p-4'>
      <div>
        <h2 className="text-xl font-semibold mb-4">Add a New Assignment</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-10">
          <div>
            <label htmlFor="title">Title</label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Assignment #1" required />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="e.g. Use 12pt double-spaced font..." required />
          </div>

          <div>
            <label htmlFor="maxSubmissions">Attempts</label>
            <Input id="maxSubmissions" name="maxSubmissions" type="number" value={formData.maxSubmissions} onChange={handleInputChange} required />
          </div>

          <div className='flex flex-col gap-2'>
            <label>Due by:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal", !formData.dueDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={formData.dueDate} onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label>Category</label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
              <SelectTrigger>
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
          </div>

          <div className="space-y-4">
            <RubricCreationForm 
              onRubricChange={(newRubricData) => {
                setNewRubricData(newRubricData);
                setFormData(prev => ({ ...prev, rubricId: '' }));
              }} 
              isOpen={isRubricFormOpen}
              setIsOpen={setIsRubricFormOpen}
              disabled={!!formData.rubricId}  // Disable when an existing rubric is selected
            />

            {(newRubricData || formData.rubricId) && (
              <Button
                type="button"
                variant="link"
                className="text-sm hover:bg-slate-100 m-2 p-1"
                onClick={resetRubric}
              >
                Reset Rubric Selection
              </Button>
            )}

            <div className="flex justify-between items-center">
              <label>Select Existing Rubric</label>
            </div>
            <Select 
              value={formData.rubricId}
              onValueChange={handleRubricSelection}
              disabled={newRubricData !== null}
            >
              <SelectTrigger>
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
          </div>

          <div>
            <label>Allowed File Types</label>
            <MultiSelect
              options={fileTypeOptions}
              value={formData.allowedFileTypes}
              onChange={(value) => setFormData(prev => ({ ...prev, allowedFileTypes: value }))}
              placeholder="Select allowed file types"
            />
          </div>

          <div>
            <label htmlFor="file-upload">Upload File</label>
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
            <p className='text-sm text-slate-600 mt-3'>Attach any files related to the assignment (PDFs preferred).</p>

          </div>

          <Button type="submit" className='bg-primary text-white'>Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentCreation;