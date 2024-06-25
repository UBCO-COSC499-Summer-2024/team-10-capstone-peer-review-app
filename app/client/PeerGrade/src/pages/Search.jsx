import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { iClass as classesData, user } from '@/utils/dbData'; // DB CALL
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ChevronUpIcon, ChevronDownIcon, CheckIcon, Dot, Trash2, Pencil } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { Link, useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { cn } from '@/utils/utils';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ClassTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState({ key: 'classname', order: 'asc' });
    const [filter, setFilter] = useState({ term: '', size: '', searchQuery: '', instructorQuery: '' });
    const [openTerm, setOpenTerm] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState({class_id: 1,instructor_id: 1,classname: "ART 101",description: "Introduction to Art.",start: Date.now(),term: "Winter",end: Date.now(),size: 50});
    const itemsPerPage = 5;
    const query = useQuery();
    const queryClassname = query.get('query') || '';

    useEffect(() => {
        if (queryClassname) {
            setFilter((prevFilter) => ({ ...prevFilter, searchQuery: queryClassname }));
        }
    }, [queryClassname]);

    const handleSort = (key) => {
        setSortOrder({
            key,
            order: sortOrder.key === key && sortOrder.order === 'asc' ? 'desc' : 'asc',
        });
    };

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        });
    };

    const handleTrashClick = (selected_class) => {
        setSelectedClass(selected_class);
        setDialogOpen(true);
    };

    const handleDeleteClass = async () => {
        // try {
        //     const response = await fetch(`/api/delete/class/${selectedClass.class_id}`, {
        //         method: 'DELETE',
        //     });
        //     if (response.ok) {
        //         setDialogOpen(false);
        //         // Remove the deleted class from the classesData array
        //         const updatedClasses = classesData.filter(classItem => classItem.class_id !== selectedClass.class_id);
        //         // Update the local state (Assuming classesData is in state)
        //         setClassesData(updatedClasses);
        //     } else {
        //         console.error("Failed to delete the class.");
        //     }
        // } catch (error) {
        //     console.error("Error deleting the class:", error);
        // }
    };

    const filteredClasses = classesData
        .filter(classItem => 
            (filter.searchQuery ? classItem.classname.toLowerCase().includes(filter.searchQuery.toLowerCase()) : true) &&
            (filter.instructorQuery ? (
                user.find(instructor => instructor.user_id === classItem.instructor_id)?.firstname.toLowerCase().includes(filter.instructorQuery.toLowerCase()) ||
                user.find(instructor => instructor.user_id === classItem.instructor_id)?.lastname.toLowerCase().includes(filter.instructorQuery.toLowerCase())
            ) : true) &&
            (filter.term ? classItem.term === filter.term : true) &&
            (filter.size ? classItem.size === parseInt(filter.size) : true)
        )
        .sort((a, b) => {
            const { key, order } = sortOrder;
            if (key === 'classname') {
                return order === 'asc' ? a.classname.localeCompare(b.classname) : b.classname.localeCompare(a.classname);
            } else if (key === 'start') {
                return order === 'asc' ? new Date(a.start) - new Date(b.start) : new Date(b.start) - new Date(a.start);
            } else if (key === 'end') {
                return order === 'asc' ? new Date(a.end) - new Date(b.end) : new Date(b.end) - new Date(a.end);
            } else if (key === 'size') {
                return order === 'asc' ? a.size - b.size : b.size - a.size;
            }
        });

    const getDropdownOptionsTerm = (classes) => {
        const uniqueTerms = Array.from(new Set(classes.map(classItem => classItem.term)));
        return [{ value: '', label: 'All' }, ...uniqueTerms.map(term => ({ value: term, label: term }))];
    };
    const dropdownOptionsTerm = getDropdownOptionsTerm(classesData);  

    const totalPages = Math.ceil(filteredClasses.length / itemsPerPage) === 0 ? 1 : Math.ceil(filteredClasses.length / itemsPerPage);
    const currentClasses = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const currentUser = useSelector((state) => state.user.currentUser);

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return <div>You do not have permission to view this page.</div>;
    }

    return (
        <div className="w-full bg-white shadow-md rounded-lg">
            <div className="p-4">
                <div className="flex space-x-2">
                    <div className="flex w-auto max-w-sm items-center">
                        <label>Term</label>
                        <Popover open={openTerm} onOpenChange={setOpenTerm}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openTerm}
                                    className="w-[200px] justify-between bg-white w-auto mx-3"
                                >
                                    {filter.term
                                        ? dropdownOptionsTerm.find((option) => option.value === filter.term)?.label
                                        : "No term selected"}
                                    {openTerm
                                        ? <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        : <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    }
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0 rounded-md">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            {dropdownOptionsTerm.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    value={option.value}
                                                    onSelect={(currentValue) => {
                                                        setFilter({ ...filter, term: currentValue });
                                                        setOpenTerm(false);
                                                    }}
                                                >
                                                    {option.label}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4 w-auto",
                                                            filter.term === option.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex w-auto max-w-sm items-center">
                        <label className="whitespace-nowrap mr-3">Class Name</label>
                        <Input
                            placeholder="ART 101"
                            value={filter.searchQuery}
                            onChange={(e) => handleFilterChange(e)}
                            name="searchQuery"
                            className="w-auto mr-3"
                        />
                    </div>
                    <div className="flex w-auto max-w-sm items-center">
                        <label className="whitespace-nowrap mr-3">Instructor Name</label>
                        <Input
                            placeholder="John Doe"
                            value={filter.instructorQuery}
                            onChange={(e) => handleFilterChange(e)}
                            name="instructorQuery"
                            className="w-auto "
                        />
                    </div>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left cursor-pointer" onClick={() => handleSort('classname')} data-testid="class-name-header">
                            <div className="flex items-center">
                                Class Name {sortOrder.key === 'classname' 
                                    ? (sortOrder.order === 'asc' 
                                        ? <ArrowUp className="ml-1 h-5 w-5" /> 
                                        : <ArrowDown className="ml-1 h-5 w-5" />) 
                                    : <Dot className="ml-1 h-5 w-5" />}
                            </div>
                        </TableHead>
                        <TableHead className="text-left">Instructor Name</TableHead>
                        <TableHead className="text-left cursor-pointer" onClick={() => handleSort('start')}>
                            <div className="flex items-center">
                                Start Date {sortOrder.key === 'start' 
                                    ? (sortOrder.order === 'asc' 
                                        ? <ArrowUp className="ml-1 h-5 w-5" /> 
                                        : <ArrowDown className="ml-1 h-5 w-5" />) 
                                    : <Dot className="ml-1 h-5 w-5" />}
                            </div>
                        </TableHead>
                        <TableHead className="text-left cursor-pointer" onClick={() => handleSort('end')}>
                            <div className="flex items-center">
                                End Date {sortOrder.key === 'end' 
                                    ? (sortOrder.order === 'asc' 
                                        ? <ArrowUp className="ml-1 h-5 w-5" /> 
                                        : <ArrowDown className="ml-1 h-5 w-5" />) 
                                    : <Dot className="ml-1 h-5 w-5" />}
                            </div>
                        </TableHead>
                        <TableHead className="text-left">Term</TableHead>
                        <TableHead className="text-left cursor-pointer" onClick={() => handleSort('size')}>
                            <div className="flex items-center">
                                Size {sortOrder.key === 'size' 
                                    ? (sortOrder.order === 'asc' 
                                        ? <ArrowUp className="ml-1 h-5 w-5" /> 
                                        : <ArrowDown className="ml-1 h-5 w-5" />) 
                                    : <Dot className="ml-1 h-5 w-5" />}
                            </div>
                        </TableHead>
                        <TableHead className="text-left">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentClasses.map((classItem, index) => (
                        <TableRow key={index}>
                            <TableCell className="p-2"><Link to={`/class/${classItem.class_id}`}>{classItem.classname}</Link></TableCell>
                            <TableCell className="p-2">
                                {user.find(instructor => instructor.user_id === classItem.instructor_id)?.firstname + ' ' + user.find(instructor => instructor.user_id === classItem.instructor_id)?.lastname}
                            </TableCell>
                            <TableCell className="p-2">{new Date(classItem.start).toLocaleDateString()}</TableCell>
                            <TableCell className="p-2">{new Date(classItem.end).toLocaleDateString()}</TableCell>
                            <TableCell className="p-2">{classItem.term}</TableCell>
                            <TableCell className="p-2">{classItem.size}</TableCell>
                            <TableCell className="p-2">
                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100" onClick={() => handleTrashClick(classItem)} data-testid={`delete-button-${classItem.class_id}`}>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-100" data-testid="edit-button">
                                    <Pencil className="h-5 w-5" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between p-4">
                <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Class</DialogTitle>
                    </DialogHeader>
                    Are you sure you want to delete the class {selectedClass.classname}?
                    <DialogFooter>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteClass}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function Search() {
    return (
        <div className="w-full main-container py-6 space-y-6">
            <h1 className="text-2xl font-bold">All Classes</h1>
            <ClassTable />
        </div>
    );
}

export default Search;
