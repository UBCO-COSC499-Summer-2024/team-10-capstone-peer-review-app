import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cn } from "@/lib/utils"

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon, Check as CheckIcon, Upload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"

const AssignmentCreation = () => {
  const { classId } = useParams();
  const [reviewOption, setReviewOption] = React.useState('Manual');
  const [date, setDate] = React.useState(null);
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")


  const handleOption = (option) => {
    setReviewOption(option);
  };

  const dropdown_options = [
    {
      value: "manual",
      label: "Manual",
    },
    {
      value: "auto",
      label: "Auto",
    }
  ]

  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFileName(selectedFile.name);
    // Do something with the selected file, like upload it
    if (onChange) onChange(selectedFile);
  };

  return (
    <div className='flex justify-left flex-row p-4'>
      <div className="lg:w-2/3">
              <h2 className="text-xl font-semibold mb-4">Add a New Assignment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <Input type="text" placeholder="e.g. Assignment #1" />
                  <p className="text-xs text-gray-500 mt-1">This is what will show up as the assignment's title.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <Textarea placeholder="e.g. Use 12pt double-spaced font..." />
                  <p className="text-xs text-gray-500 mt-1">This is the text that will show as the assignment's description.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manual/Auto Review</label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between bg-white"
                      >
                        {value
                          ? dropdown_options.find((option) => option.value === value)?.label
                          : "Select option..."}
                        {open && 
                          <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> || 
                          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        }
                      </Button>
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
                                  setValue(currentValue === value ? "" : currentValue)
                                  setOpen(false)
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
                  <p className="text-xs text-gray-500 mt-1">Manual - Pick students to assign the peer review to manually. Auto - The system automatically picks students to assign the peer review to.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due by:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-auto font-normal bg-white flex inline-block flex-start",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-gray-500 mt-1">The assignment will be due at 11:59 PM on the selected date. The assignment will then be open for peer review right after the due date.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rubric Details</label>
                  <Textarea />
                  <p className="text-xs text-gray-500 mt-1">This is the text that will contain the assignment's rubric details.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload File</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <div className="flex items-center">
                    <Button className='bg-white mr-2' variant='outline' onClick={() => fileInputRef.current.click()}>
                      <Upload className='mr-2 h-4 w-4 shrink-0 opacity-50'/>
                      Upload File
                    </Button>
                    {selectedFileName && (
                      <span className='text-gray-500'>{selectedFileName}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload the files for the assignment here.</p>
                </div>
                <Button>
                  Submit
                </Button>
              </div>
            </div>
    </div>
  );
}

export default AssignmentCreation;
