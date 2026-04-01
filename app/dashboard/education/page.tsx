"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Education } from "@/types/resume";
import { useDataClient } from "@/lib/data-client";

type FormValues = Omit<Education, "id" | "order">;

const emptyForm: FormValues = {
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  current: false,
  gpa: "",
  description: "",
};

export default function EducationPage() {
  const client = useDataClient();
  const [entries, setEntries] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Add form
  const addForm = useForm<FormValues>({ defaultValues: emptyForm });
  const addCurrent = addForm.watch("current");

  // Edit form
  const editForm = useForm<FormValues>({ defaultValues: emptyForm });
  const editCurrent = editForm.watch("current");

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    setLoading(true);
    try {
      const data = await client.education.list();
      setEntries(data);
    } catch {
      showToast("error", "Failed to load education entries.");
    } finally {
      setLoading(false);
    }
  }

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleAdd(values: FormValues) {
    try {
      await client.education.create(values);
      showToast("success", "Education entry added.");
      addForm.reset(emptyForm);
      setShowAddForm(false);
      await loadEntries();
    } catch {
      showToast("error", "Failed to add education entry.");
    }
  }

  function startEdit(entry: Education) {
    setEditingId(entry.id);
    editForm.reset({
      school: entry.school,
      degree: entry.degree ?? "",
      field: entry.field ?? "",
      startDate: entry.startDate ?? "",
      endDate: entry.endDate ?? "",
      current: entry.current,
      gpa: entry.gpa ?? "",
      description: entry.description ?? "",
    });
  }

  async function handleEdit(values: FormValues) {
    if (!editingId) return;
    try {
      await client.education.update(editingId, values);
      showToast("success", "Education entry updated.");
      setEditingId(null);
      await loadEntries();
    } catch {
      showToast("error", "Failed to update education entry.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this education entry? This cannot be undone.")) return;
    try {
      await client.education.remove(id);
      showToast("success", "Education entry deleted.");
      await loadEntries();
    } catch {
      showToast("error", "Failed to delete education entry.");
    }
  }

  function formatDateRange(entry: Education) {
    const start = entry.startDate ?? "";
    const end = entry.current ? "Present" : (entry.endDate ?? "");
    if (!start && !end) return null;
    return [start, end].filter(Boolean).join(" — ");
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Education</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add your academic background, degrees, and certifications.
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => {
              addForm.reset(emptyForm);
              setShowAddForm(true);
              setEditingId(null);
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add Education
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 rounded-md px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Empty state */}
          {entries.length === 0 && !showAddForm && (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
              <p className="text-sm text-gray-500">No education entries yet.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-sm font-medium text-blue-600 hover:underline"
              >
                Add your first education entry
              </button>
            </div>
          )}

          {/* Entry cards */}
          {entries.map((entry) => (
            <div key={entry.id}>
              {editingId === entry.id ? (
                <div className="bg-white rounded-lg shadow-sm border border-blue-300 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Edit Education</h3>
                  <EducationForm
                    form={editForm}
                    currentChecked={editCurrent}
                    onSubmit={editForm.handleSubmit(handleEdit)}
                    onCancel={() => setEditingId(null)}
                    submitLabel="Save Changes"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{entry.school}</p>
                      {(entry.degree || entry.field) && (
                        <p className="text-sm text-gray-600">
                          {[entry.degree, entry.field].filter(Boolean).join(", ")}
                        </p>
                      )}
                      {formatDateRange(entry) && (
                        <p className="text-xs text-gray-400 mt-0.5">{formatDateRange(entry)}</p>
                      )}
                      {entry.gpa && (
                        <p className="text-xs text-gray-500 mt-0.5">GPA: {entry.gpa}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => startEdit(entry)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm border border-blue-300 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Add Education</h3>
              <EducationForm
                form={addForm}
                currentChecked={addCurrent}
                onSubmit={addForm.handleSubmit(handleAdd)}
                onCancel={() => {
                  addForm.reset(emptyForm);
                  setShowAddForm(false);
                }}
                submitLabel="Add Entry"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared sub-form component
// ---------------------------------------------------------------------------
interface EducationFormProps {
  form: ReturnType<typeof useForm<FormValues>>;
  currentChecked: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}

function EducationForm({ form, currentChecked, onSubmit, onCancel, submitLabel }: EducationFormProps) {
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* School */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          School <span className="text-red-500">*</span>
        </label>
        <input
          {...register("school", { required: "School is required" })}
          type="text"
          placeholder="Massachusetts Institute of Technology"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.school && <p className="mt-1 text-xs text-red-600">{errors.school.message}</p>}
      </div>

      {/* Degree & Field */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
          <input
            {...register("degree")}
            type="text"
            placeholder="Bachelor of Science"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
          <input
            {...register("field")}
            type="text"
            placeholder="Computer Science"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            {...register("startDate")}
            type="text"
            placeholder="YYYY-MM"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            {...register("endDate")}
            type="text"
            placeholder="YYYY-MM"
            disabled={currentChecked}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
      </div>

      {/* Currently Attending */}
      <div className="flex items-center gap-2">
        <input
          {...register("current")}
          id="edu-current"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="edu-current" className="text-sm text-gray-700">
          Currently attending
        </label>
      </div>

      {/* GPA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
        <input
          {...register("gpa")}
          type="text"
          placeholder="3.8"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Honours, activities, relevant coursework..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
