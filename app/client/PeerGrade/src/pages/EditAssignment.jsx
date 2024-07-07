import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon, Check as CheckIcon, Upload } from "lucide-react";

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
import RubricDrawer from '@/components/assign/RubricDrawer';  // Import the new drawer component

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  reviewOption: z.string().min(1, "Review option is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  rubric: z.array(z.object({
    criteria: z.string().min(1, "Criteria is required"),
    ratings: z.array(z.string().min(1, "Rating is required")),
    points: z.string().min(1, "Points is required").regex(/^\d+$/, "Points must be a numeric value"),
  })).min(1, "At least one rubric row is required."),
  file: z.any().optional(),
});

const EditAssignment = () => {
  const { classId, assignmentId } = useParams();
  const [openDrawer, setOpenDrawer] = useState(false);  // State to handle drawer open/close
  const [open, setOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [rubricData, setRubricData] = useState([]);  // State to hold rubric data
  const [assignmentData, setAssignmentData] = useState(null);
  const fileInputRef = useRef(null);  // Define the ref here

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      maxSubmissions: "",
      reviewOption: "",
      dueDate: null,
      rubric: [],
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

  useEffect(() => { 
    const fetchAssignment = async  () => {
      try {
        const fetchedAssignment = await getAssignmentInClass(classId, assignmentId);
        setAssignmentData(fetchedAssignment.data);
        form.setValue("title", assignmentData.title);
        form.setValue("description", assignmentData.description);
        form.setValue("maxSubmissions", assignmentData.maxSubmissions );
        form.setValue("reviewOption", assignmentData.reviewOption || "manual");
        form.setValue("dueDate", new Date(assignmentData.dueDate));
        setRubricData([{ criteria: "", ratings: [""], points: "" }]);
        setSelectedFileName(`Assignment.${assignmentData.assignmentType}`);
      } catch (error) { 
        toast({
          title: "Error",
          description: "Failed to fetch assignment data",
          variant: "destructive",
        });
      }
    };
    fetchAssignment();
  }, [classId, assignmentId, form, toast]);

   const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFileName(selectedFile.name);
    form.setValue("file", selectedFile);
  };

  const onSubmit = async (data) => {
    const simplifiedData = {
      ...data,
      file: selectedFileName,
      rubric: rubricData,
    };

    try {
      await updateAssignmentInClass(classId, assignmentId, simplifiedData);
      toast({
        title: "Assignment updated successfully",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(simplifiedData, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assignment",
        variant: "destructive",
      });
    }
  };

  const handleReviewSelect = (value) => {
    form.setValue("reviewOption", value);
    setOpen(false);
  };

  const handleRubricSubmit = (rubric) => {
    setRubricData(rubric);
    setOpenDrawer(false);
  };

  return (
    <div className='bg-white flex justify-left flex-row p-4'>
      <div className="lg:w-2/3">
        <h2 className="text-xl font-semibold mb-4">Edit Assignment</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input placeholder="e.g. 5" {...field} />
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
                      <FormControl  >
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between bg-white"
                        >
                          {field.value
                            ? dropdown_options.find((option) => option.value === field.value)?.label
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
                                  field.onChange(currentValue === field.value ? "" : currentValue);
                                  setOpen(false);
                                }}
                              >
                                {option.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === option.value ? "opacity-100" : "opacity-0"
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
                  <FormDescription>The assignment will be due at 11:59 PM on the selected date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}  
            />
            <div className='flex gap-2 flex-col w-1/3'>
              <FormLabel>Rubric</FormLabel>
              <Button variant="outline" onClick={() => setOpenDrawer(true)}>
                Edit Rubric
              </Button> 
              <RubricDrawer isOpen={openDrawer} onClose={() => setOpenDrawer(false)} onSubmit={handleRubricSubmit} />
            </div>
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditAssignment;
