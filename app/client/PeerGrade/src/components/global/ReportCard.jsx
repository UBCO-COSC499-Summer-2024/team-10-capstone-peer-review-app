import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Check, CircleHelp } from 'lucide-react';

const ReportCard = ({ report, isViewedByReceiver }) => {
    const toProperCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <Card className='w-full mr-2'>
            <CardHeader>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.content}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
                {isViewedByReceiver && <p><strong>Sender:</strong> {`${report.sender.firstname} ${report.sender.lastname}`} ({toProperCase(report.sender.role)})</p>}
                {!isViewedByReceiver && <p><strong>Recipient:</strong> {report.receiverRole === "ADMIN" ? "Admin" : `${report.receiver.firstname} ${report.receiver.lastname}`}</p>}
                <p><strong>Sent: </strong> {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</p>
            </CardContent>
            <CardFooter>
                {!report.isResolved ?
                    <div className='flex items-center'>
                        <CircleHelp className='h-5 w-5 text-gray-500 mr-2'/>
                        This report has not been resolved yet.
                    </div>
                    :
                    <div className='flex items-center'>
                        <Check className='h-5 w-5 text-green-500 mr-2'/>
                        This report has already been marked as resolved.
                    </div>
                }
            </CardFooter>
        </Card>
    );
};

export default ReportCard;