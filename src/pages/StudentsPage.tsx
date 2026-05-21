import { useState } from "react";
import StudentList from "@/components/students/StudentList";
import StudentForm from "@/components/students/StudentForm";
import StudentDetail from "@/components/students/StudentDetail";
import type { Student } from "@/types";

type ViewState = "list" | "add" | "edit" | "detail";

export default function StudentsPage() {
  const [view, setView] = useState<ViewState>("list");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleAdd = () => {
    setSelectedStudent(null);
    setView("add");
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setView("edit");
  };

  const handleViewDetail = (student: Student) => {
    setSelectedStudent(student);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      {view === "list" && (
        <>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Siswa</h1>
            <p className="text-muted-foreground">Kelola data siswa dan QR Code</p>
          </div>
          <StudentList 
            onAdd={handleAdd} 
            onEdit={handleEdit} 
            onViewDetail={handleViewDetail} 
          />
        </>
      )}

      {view === "add" && (
        <StudentForm 
          onSuccess={handleBackToList}
          onCancel={handleBackToList}
        />
      )}

      {view === "edit" && selectedStudent && (
        <StudentForm 
          initialData={selectedStudent}
          onSuccess={handleBackToList}
          onCancel={handleBackToList}
        />
      )}

      {view === "detail" && selectedStudent && (
        <StudentDetail 
          studentId={selectedStudent.id}
          onBack={handleBackToList}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
