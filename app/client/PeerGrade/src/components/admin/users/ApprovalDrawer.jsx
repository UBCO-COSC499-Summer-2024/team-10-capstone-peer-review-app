import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { DelDialog } from "./DelDialog";

export function ApprovalDrawer({ children }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Instructor Approval Form</DrawerTitle>
            <DrawerDescription>
              Approve or reject the instructor application.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex flex-col space-y-2">
              {/* Add instructor details here */}
              <p>Instructor Name: John Doe</p>
              <p>Email: johndoe@example.com</p>
              <p>Learning Institution: ABC University</p>
              <p>Description: Experienced instructor in Computer Science.</p>
            </div>
          </div>
          <DrawerFooter>
            <Button>Approve</Button>
            <DelDialog>
              <Button variant="outline">Reject</Button>
            </DelDialog>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}