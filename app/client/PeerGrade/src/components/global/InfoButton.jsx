// components/InfoButton.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Info } from "lucide-react";

const InfoButton = ({ content }) => {
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full w-10 h-10 p-0 z-50"
        onClick={() => setShowInfoOverlay(true)}
      >
        <Info className="w-6 h-6" />
      </Button>

      <Dialog 
        open={showInfoOverlay} 
        onOpenChange={setShowInfoOverlay}
      >
        <DialogContent className="z-50">
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {typeof content.description === 'function' 
              ? content.description({ user }) 
              : content.description}
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowInfoOverlay(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InfoButton;