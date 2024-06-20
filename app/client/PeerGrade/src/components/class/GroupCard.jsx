import * as React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GroupCard = ({ classes, groups, classNames, users }) => {
  const [selectedClass, setSelectedClass] = React.useState(classNames[0]);

  const filteredGroups = groups.filter(
    (group) => group.class_id === selectedClass.class_id
  );

  const getGroupMembers = (groupId) => {
    return filteredGroups.filter(group => group.group_id === groupId);
  };

  return (
    <Card className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg">
      <CardHeader>
        <CardTitle>Group Members</CardTitle>
        <CardDescription>Invite your group members to collaborate.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={(value) => setSelectedClass(classNames.find(classItem => classItem.class_id === Number(value)))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={selectedClass.classname} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Classes</SelectLabel>
                {classNames.map(classItem => (
                  <SelectItem key={classItem.class_id} value={classItem.class_id.toString()}>
                    {classItem.classname}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {filteredGroups.map(group => (
          getGroupMembers(group.group_id).map(member => {
            const user = users.find(u => u.user_id === member.student_id);
            return (
              <div key={member.group_id} className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 mr-4">
                    <AvatarImage src={user.avatarUrl} alt={`${user.firstname} ${user.lastname}`} />
                    <AvatarFallback>{user.firstname[0]}{user.lastname[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{`${user.firstname} ${user.lastname}`}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                </div>
                <Button variant="outline">{user.type}</Button>
              </div>
            );
          })
        ))}
      </CardContent>
    </Card>
  );
};

export default GroupCard;
