// ManageClass.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import AddClassModal from "@/components/manageClass/AddClassDialog";
import ClassCard from "@/components/manageClass/ClassCard";
import { getEnrollRequestsForClass } from "@/api/enrollmentApi";

const ManageClass = () => {
  const { user } = useUser();
  const { classes } = useClass();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState({});

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      const approvals = {};
      for (const classItem of classes) {
        const requests = await getEnrollRequestsForClass(classItem.classId);
        if (requests.status === "Success") {
          approvals[classItem.classId] = requests.data.filter(
            (request) => request.status === "PENDING"
          ).length;
        }
      }
      setPendingApprovals(approvals);
    };

    fetchPendingApprovals();
  }, [classes]);

  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Classes</h1>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center"
        >
          <Plus className="mr-2 w-5 h-5" />
          Add a class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.classId}
            classItem={classItem}
            pendingApprovals={pendingApprovals[classItem.classId] || 0}
          />
        ))}
      </div>

      <AddClassModal
        show={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
};

export default ManageClass;