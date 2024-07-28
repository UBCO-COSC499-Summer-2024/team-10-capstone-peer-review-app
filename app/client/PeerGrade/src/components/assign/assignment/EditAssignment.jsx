import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon, Check as CheckIcon, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelect from '@/components/ui/MultiSelect';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/utils/utils";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
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
import { getCategoriesByClassId } from '@/api/classApi';
import { getAllRubricsInClass } from '@/api/rubricApi';

const fileTypeOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'DOC' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
];


const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  maxSubmissions: z.number().min(1, "Max submissions is required"),
  categoryId: z.string().min(1, "Category is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  rubricId: z.string().min(1, "Rubric is required"), // Add this line
  file: z.any().optional(),
  allowedFileTypes: z.array(z.string()).min(1, "At least one file type must be selected"),

});

const EditAssignment = () => {
  const navigate = useNavigate();
  const { classId, assignmentId } = useParams();
  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [value, setValue] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubric, setSelectedRubric] = useState("");
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);

  
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      maxSubmissions: 1,
      categoryId: "",
      dueDate: null,
      file: null,
      rubricId: "", // Add this line
      allowedFileTypes: [],
    }
  });


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
          setCategories(categoriesResponse.data);
          setRubrics(rubricsResponse.data);
          
          // Convert allowed file types to the format expected by MultiSelect
          const allowedFileTypes = assignmentData.allowedFileTypes.map(type => ({
            value: type,
            label: type.toUpperCase()
          }));
          
          setSelectedFileTypes(allowedFileTypes);

          form.reset({
            title: assignmentData.title,
            description: assignmentData.description,
            maxSubmissions: assignmentData.maxSubmissions,
            categoryId: assignmentData.categoryId,
            dueDate: new Date(assignmentData.dueDate),
            rubricId: assignmentData.rubricId, // Add this line
            allowedFileTypes: assignmentData.allowedFileTypes || [],

          });
    
          setSelectedCategory(assignmentData.categoryId);
          setSelectedFileName(assignmentData.assignmentFilePath ? assignmentData.assignmentFilePath.split('/').pop() : '');
          setSelectedFileTypes(assignmentData.allowedFileTypes || []);

          // Set the selected rubric
          if (assignmentData.rubricId) {
            setSelectedRubric(assignmentData.rubricId);
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
      maxSubmissions: data.maxSubmissions,
      rubricId: selectedRubric, 
      allowedFileTypes: data.allowedFileTypes,  // Use data.allowedFileTypes instead of selectedFileTypes
    }));
  
    if (fileInputRef.current.files[0]) {
      formData.append('file', fileInputRef.current.files[0]);
    }
  
    try {
      const response = await updateAssignmentInClass(formData);
  
      if (response.status === 'Success') {
        toast({
          title: "Data Updated",
          description: "The assignment has been successfully updated.",
          status: "success",
          variant: "info"
        });
        
        // Navigate to the assignment page
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
        status: "error"
      });
    }
  };

  return (
    <div className='flex bg-white justify-left flex-row p-4'>
      <div>
        <h2 className="text-xl font-semibold mb-4">Edit Assignment</h2>
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
              name="rubricId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rubric</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rubric" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rubrics.map((rubric) => (
                        <SelectItem key={rubric.rubricId} value={rubric.rubricId}>
                          {rubric.title || 'Untitled Rubric'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select a rubric for this assignment.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="allowedFileTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed File Types</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={fileTypeOptions}
                      value={field.value}
                      onChange={(value) => {
                        setSelectedFileTypes(value);
                        field.onChange(value);
                      }}
                      placeholder="Select allowed file types"
                    />
                  </FormControl>
                  <FormDescription>Select the file types that students can submit for this assignment.</FormDescription>
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
              <FormDescription>Attach any files related to the assignment (PDFs preferred).</FormDescription>
              <FormMessage />
            </FormItem>
            <Button type="submit" className='bg-primary text-white'>Update Assignment</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditAssignment;