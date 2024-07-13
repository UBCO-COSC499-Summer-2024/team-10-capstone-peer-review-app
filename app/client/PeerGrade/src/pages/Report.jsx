import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { getInstructorByClassId } from '@/api/classApi';

const Report = () => {
    const { toast } = useToast();
	const { user, userLoading } = useUser();
	const { classes, isClassLoading } = useClass();
    const [role, setRole] = useState('ADMIN');
    const [instructors, setInstructors] = useState([]);
    const [instructor, setInstructor] = useState('');
    const [subject, setSubject] = useState('');
    const [reportContent, setReportContent] = useState('');
    const [reports, setReports] = useState([]);

    useEffect(() => {
        if (!userLoading && user && user.role === "STUDENT" && role === "INSTRUCTOR" && !isClassLoading && instructors.length === 0) {
            const fetchInstructors = async () => {
                for (const classItem of classes) {
                    const response = await getInstructorByClassId(classItem.classId);
                    if (response.status === "Success") {
                        setInstructors([...instructors, response.data]);
                    }
                }
            };
        
            setInstructors([]);
            fetchInstructors();
        }
    }, [user, userLoading, role, classes, isClassLoading]);    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newReport = {
            role,
            instructor,
            subject,
            reportContent
        };

        // Send the report data to the API
        // Example: sendReport(reportData);

        toast({
            title: "Report Submitted",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(newReport, null, 2)}</code>
                </pre>
            ),
            variant: "positive"
        });

        // Add new report to the list of reports
        setReports([...reports, newReport]);

        // Clear the form
        setRole('');
        setSubject('');
        setReportContent('');
    };

    return (
        <div className="px-6">
            <h1 className="text-3xl font-bold mb-3 ml-3">Send a Report {user.role === "INSTRUCTOR" ? "to Admin" : ""}</h1>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {user.role === "STUDENT" && 
                            <div className="space-y-2">
                                <Label htmlFor="role">Recipient</Label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select recipient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        }
                        {role === "INSTRUCTOR" &&
                        <div className="space-y-2">
                            <Label htmlFor="instructor">Instructor</Label>
                            <Select value={instructor} onValueChange={setInstructor}>
                                <SelectTrigger id="instructor">
                                    <SelectValue placeholder="Select instructor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {instructors.map((instructor, index) => (
                                        <SelectItem key={instructor.userId} value={instructor.userId}>{instructor.firstname} {instructor.lastname}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        }
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input 
                                id="subject" 
                                value={subject} 
                                onChange={(e) => setSubject(e.target.value)} 
                                placeholder="Enter subject" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reportContent">Report Content</Label>
                            <Textarea 
                                id="reportContent" 
                                value={reportContent} 
                                onChange={(e) => setReportContent(e.target.value)} 
                                placeholder="Enter your report content" 
                                rows="6" 
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Submit Report</Button>
                    </CardFooter>
                </form>
            </Card>
            
            <h2 className="text-2xl font-bold mt-6 mb-3 ml-3">Previously Sent Reports</h2>
            <Card>
                <CardContent className="space-y-6">
                {reports.length > 0 ? (
                    reports.map((report, index) => (
                    <div key={index} className="space-y-2 border-b pb-4">
                        <p><strong>Recipient:</strong> {report.role === "ADMIN" ? "Admin" : "Instructor"}</p>
                        {role === "INSTRUCTOR" && <p><strong>Instructor:</strong> {report.instructor}</p>}
                        <p><strong>Subject:</strong> {report.subject}</p>
                        <p><strong>Content:</strong> {report.reportContent}</p>
                    </div>
                    ))
                ) : (
                    <p>No reports have been submitted yet.</p>
                )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Report;
