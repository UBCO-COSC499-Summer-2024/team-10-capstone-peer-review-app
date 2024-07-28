import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon, Check as CheckIcon, Upload } from 'lucide-react';

import { cn } from '@/utils/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { getCategoriesByClassId } from '@/api/classApi';
import { addAssignmentToClass } from '@/api/assignmentApi';
import { getAllRubricsInClass } from '@/api/rubricApi';

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

const AssignmentCreation = ({ onAssignmentCreated }) => {
  const { classId } = useParams();
  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [value, setValue] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [rubrics, setRubrics] = useState([]);
  const [selectedRubric, setSelectedRubric] = useState("");
  
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
    {
      value: "manual",
      label: "Manual",
    },
    {
      value: "auto",
      label: "Auto",
    }
  ];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFileName(selectedFile.name);
    form.setValue("file", selectedFile);
  };

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

  const onSubmit = async (data) => {
    console.log('Form submitted:', data);  // Add logging to check form data
    console.log('selectedCategory:', selectedCategory);
    console.log('selectedRubric:', selectedRubric);
   
    const formData = new FormData();
    formData.append('classId', classId);
    formData.append('categoryId', selectedCategory);
    formData.append('assignmentData', JSON.stringify({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      reviewOption: data.reviewOption,
      maxSubmissions: data.maxSubmissions,
      rubricId: selectedRubric, // Add this line
    }));

    if (fileInputRef.current.files[0]) {
      formData.append('file', fileInputRef.current.files[0]);
    }

    try {
      const response = await addAssignmentToClass(formData);

      if (response.status === 'Success') {
        toast({
          title: "Assignment Created",
          description: "The assignment has been successfully created.",
          variant: "positive"
        });
        form.reset();
        setSelectedFileName('');
        setSelectedCategory('');
        setSelectedRubric('');
        
        // Call the callback function to refresh assignments
        onAssignmentCreated();
      } else {
        toast({
          title: "Error",
          description: response.message,
          status: "error"
        });
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Error",
        description: "There was an error creating the assignment.",
        status: "error"
      });
    }
  };

  return (
    <div className='flex bg-white justify-left flex-row p-4'>
      <div>
        <h2 className="text-xl font-semibold mb-4">Add a New Assignment</h2>
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
              name="rubricId"
              render={({ field }) => (
                <FormItem style={{ display: 'flex', flexDirection: 'column' }}>
                  <FormLabel>Rubric</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between bg-white"
                        >
                          {selectedRubric
                            ? rubrics.find(rubric => rubric.rubricId === selectedRubric)?.title || 'Untitled Rubric'
                            : "Select Rubric"}
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
                                  setSelectedRubric(currentValue);
                                  field.onChange(currentValue);
                                }}
                              >
                                {rubric.title || 'Untitled Rubric'}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedRubric === rubric.rubricId ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select a rubric for this assignment.</FormDescription>
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
            <Button type="submit" className='bg-primary text-white'>Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AssignmentCreation;
