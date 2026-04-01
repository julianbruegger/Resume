"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Certification } from "@/types/resume";
import { useDataClient } from "@/lib/data-client";

type FormValues = Omit<Certification, "id" | "order">;

const emptyForm: FormValues = {
  name: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  url: "",
};

export default function CertificationsPage() {
  const client = useDataClient();
  const [entries, setEntries] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const addForm = useForm<FormValues>({ defaultValues: emptyForm });
  const editForm = useForm<FormValues>({ defaultValues: emptyForm });

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    setLoading(true);
    try {
      const data = await client.certifications.list();
      setEntries(data);
    } catch {
      showToast("error", "Failed to load certifications.");
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
      await client.certifications.create(values);
      showToast("success", "Certification added.");
      addForm.reset(emptyForm);
      setShowAddForm(false);
      await loadEntries();
    } catch {
      showToast("error", "Failed to add certification.");
    }
  }

  function startEdit(entry: Certification) {
    setEditingId(entry.id);
    editForm.reset({
      name: entry.name,
      issuer: entry.issuer ?? "",
      issueDate: entry.issueDate ?? "",
      expiryDate: entry.expiryDate ?? "",
      credentialId: entry.credentialId ?? "",
      url: entry.url ?? "",
    });
  }

  async function handleEdit(values: FormValues) {
    if (!editingId) return;
    try {
      await client.certifications.update(editingId, values);
      showToast("success", "Certification updated.");
      setEditingId(null);
      await loadEntries();
    } catch {
      showToast("error", "Failed to update certification.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this certification? This cannot be undone.")) return;
    try {
      await client.certifications.remove(id);
      showToast("success", "Certification deleted.");
      await loadEntries();
    } catch {
      showToast("error", "Failed to delete certification.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add professional certifications, licenses, and credentials.
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
            + Add Certification
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
              <p className="text-sm text-gray-500">No certifications yet.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-sm font-medium text-blue-600 hover:underline"
              >
                Add your first certification
              </button>
            </div>
          )}

          {/* Entry cards */}
          {entries.map((entry) => (
            <div key={entry.id}>
              {editingId === entry.id ? (
                <div className="bg-white rounded-lg shadow-sm border border-blue-300 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Edit Certification</h3>
                  <CertificationForm
                    form={editForm}
                    onSubmit={editForm.handleSubmit(handleEdit)}
                    onCancel={() => setEditingId(null)}
                    submitLabel="Save Changes"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{entry.name}</p>
                      {entry.issuer && (
                        <p className="text-sm text-gray-600">{entry.issuer}</p>
                      )}
                      <div className="flex flex-wrap gap-x-3 mt-0.5">
                        {entry.issueDate && (
                          <p className="text-xs text-gray-400">Issued: {entry.issueDate}</p>
                        )}
                        {entry.expiryDate && (
                          <p className="text-xs text-gray-400">Expires: {entry.expiryDate}</p>
                        )}
                      </div>
                      {entry.credentialId && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          ID: {entry.credentialId}
                        </p>
                      )}
                      {entry.url && (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-0.5 inline-block"
                        >
                          View credential
                        </a>
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
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Add Certification</h3>
              <CertificationForm
                form={addForm}
                onSubmit={addForm.handleSubmit(handleAdd)}
                onCancel={() => {
                  addForm.reset(emptyForm);
                  setShowAddForm(false);
                }}
                submitLabel="Add Certification"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-form component
// ---------------------------------------------------------------------------
interface CertificationFormProps {
  form: ReturnType<typeof useForm<FormValues>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}

function CertificationForm({ form, onSubmit, onCancel, submitLabel }: CertificationFormProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Certification Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Certification Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", { required: "Certification name is required" })}
          type="text"
          placeholder="AWS Certified Solutions Architect"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      {/* Issuing Organization */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Issuing Organization
        </label>
        <input
          {...register("issuer")}
          type="text"
          placeholder="Amazon Web Services"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Issue Date & Expiry Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
          <input
            {...register("issueDate")}
            type="text"
            placeholder="YYYY-MM"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            {...register("expiryDate")}
            type="text"
            placeholder="YYYY-MM"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Credential ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
        <input
          {...register("credentialId")}
          type="text"
          placeholder="ABC123XYZ"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Credential URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
        <input
          {...register("url")}
          type="url"
          placeholder="https://verify.example.com/cert/ABC123"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
