import React, { useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon, Check as CheckIcon, Upload, Plus, MinusCircle } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  reviewOption: z.string().min(1, "Review option is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  rubric: z.array(z.object({
    criteria: z.string().min(1, "Criteria is required"),
    ratings: z.string().min(1, "Ratings is required"),
    points: z.string().min(1, "Points is required").regex(/^\d+$/, "Points must be a numeric value"),
  })).min(1, "At least one rubric row is required."),
  file: z.any().optional(),
});

const AssignmentCreation = () => {
  const { classId } = useParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      reviewOption: "",
      dueDate: null,
      rubric: [{ criteria: "", ratings: "", points: "" }],
      file: null,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rubric"
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

  const onSubmit = (data) => {
    const simplifiedData = {
      ...data,
      file: selectedFileName,
    };

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(simplifiedData, null, 2)}</code>
        </pre>
      ),
    });

    // fetch('http://localhost:3000/api/auth/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     email: email,
    //     password: password
    //   })
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log(data);
    //   if (data.error && data.error.status === "Error") {
    //     setError(data.message);
    //   } else {
    //     toast({ title: "Welcome", description: "You have successfully logged in!", variant: "positive" });
    //     dispatch(setCurrentUser(data.user));
    //     if(data.user.role=="ADMIN") {
    //     navigate('/admin');
    //     } else navigate('/dashboard');
    //   }
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    //   setError('An error occurred while logging in');
    // });

    // Update the assignment with the new data
    console.log('Updated assignment data:', simplifiedData);
  };

  const addRow = useCallback(() => {
    append({ criteria: "", ratings: "", points: "" });
  }, [append]);

  const removeRow = useCallback((index) => {
    remove(index);
  }, [remove]);

  return (
    <div className='flex justify-left flex-row p-4'>
      <div>
        <h2 className="text-xl font-semibold mb-4">Add a New Assignment</h2>
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
            <div>
              <FormLabel>Rubric</FormLabel>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criteria</TableHead>
                    <TableHead>Ratings</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rubric.${index}.criteria`}
                          render={({ field }) => (
                            <FormControl>
                              <Input {...field} placeholder="Criteria" />
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rubric.${index}.ratings`}
                          render={({ field }) => (
                            <FormControl>
                              <Input {...field} placeholder="Ratings" />
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rubric.${index}.points`}
                          render={({ field }) => (
                            <FormControl>
                              <Input {...field} placeholder="Points" type="number" className="hide-arrows"/>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell className='flex flex-row space-x-2'>
                        {fields.length > 1 && (
                          <Button type="button" variant="outline" onClick={() => removeRow(index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {index === fields.length - 1 && (
                          <Button type="button" variant="outline" onClick={addRow}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <Button type="submit" className='bg-primary text-white'>Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AssignmentCreation;
