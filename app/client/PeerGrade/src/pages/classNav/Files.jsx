import React from 'react';
import { useParams } from 'react-router-dom';
import { filesData } from '../../lib/data';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from 'lucide-react';

const Files = () => {
  const { classId } = useParams();
  const classFiles = filesData.filter(file => file.classId === classId);

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
        <CardTitle className="text-xl font-bold">Class Files</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">File Name</TableHead>
              <TableHead className="text-left">Type</TableHead>
              <TableHead className="text-left">Uploaded Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classFiles.map((file, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center">
                  <FileText className="mr-2" /> {file.name}
                </TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{file.uploadedDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Files;
