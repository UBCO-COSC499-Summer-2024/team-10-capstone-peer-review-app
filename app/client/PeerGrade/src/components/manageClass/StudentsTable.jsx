import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MinusCircle, FileUp, Plus } from "lucide-react";

const StudentsTable = ({ 
  students, 
  searchTerm, 
  setSearchTerm, 
  handleDeleteStudent, 
  setAddByCSVOpen, 
  setAddDialogOpen, 
  user,
  renderPagination,
  currentPage,
  setCurrentPage
}) => {
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow mb-6">
      <div className="flex flex-row items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Students</h2>
        {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
          <div>
            <Button
              variant="ghost"
              className="bg-accent h-7 w-7 mr-2"
              onClick={() => setAddByCSVOpen(true)}
            >
              <FileUp className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className="bg-accent h-7 w-7"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
      <Input
        type="text"
        placeholder="Search students"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {students.length === 0 ? (
        <div className="text-center py-4">No students found</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.userId}>
                <TableCell className="flex items-center mt-1">
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src={student.avatarUrl} alt={`${student.firstname} ${student.lastname}`} />
                    <AvatarFallback>{getInitials(student.firstname, student.lastname)}</AvatarFallback>
                  </Avatar>
                  {student.firstname} {student.lastname}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
                    <Button
                      variant="outline"
                      className="bg-accent"
                      onClick={() => handleDeleteStudent(student)}
                    >
                      <MinusCircle className="w-5 h-5 mr-2" /> Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {renderPagination(currentPage, setCurrentPage, students.length)}
    </div>
  );
};

export default StudentsTable;