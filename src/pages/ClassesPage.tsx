import { useState } from "react";
import ClassList from "@/components/classes/ClassList";
import ClassForm from "@/components/classes/ClassForm";
import ClassDetail from "@/components/classes/ClassDetail";
import type { Class } from "@/types";

type ViewState = "list" | "add" | "edit" | "detail";

export default function ClassesPage() {
  const [view, setView] = useState<ViewState>("list");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const handleAdd = () => {
    setSelectedClass(null);
    setView("add");
  };

  const handleEdit = (classData: Class) => {
    setSelectedClass(classData);
    setView("edit");
  };

  const handleViewDetail = (classData: Class) => {
    setSelectedClass(classData);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedClass(null);
  };

  return (
    <div className="space-y-6">
      {view === "list" && (
        <>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Kelas</h1>
            <p className="text-muted-foreground">Kelola data kelas dan tahun ajaran</p>
          </div>
          <ClassList 
            onAdd={handleAdd} 
            onEdit={handleEdit} 
            onViewDetail={handleViewDetail} 
          />
        </>
      )}

      {view === "add" && (
        <ClassForm 
          onSuccess={handleBackToList}
          onCancel={handleBackToList}
        />
      )}

      {view === "edit" && selectedClass && (
        <ClassForm 
          initialData={selectedClass}
          onSuccess={handleBackToList}
          onCancel={handleBackToList}
        />
      )}

      {view === "detail" && selectedClass && (
        <ClassDetail 
          classId={selectedClass.id}
          onBack={handleBackToList}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
