"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { systemAPI } from "@/lib/api";
import { SystemInstruction } from "@/types/system";
import { Spinner } from "@/components/common/Spinner";
import { toast } from "@/store/toastStore";
import { useCurrentUser } from "@/store/authStore";
import { UserRoles } from "@/types";
import { FileText, Plus, Edit2, Trash2, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function InstructionsPage() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const user = useCurrentUser();
  const [instructions, setInstructions] = useState<SystemInstruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstruction, setEditingInstruction] =
    useState<SystemInstruction | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [instructionToDelete, setInstructionToDelete] = useState<string | null>(
    null
  );

  // Allow admin/staff to edit instructions? Or just admin?
  const canEdit =
    user?.role === UserRoles.admin || user?.role === UserRoles.superAdmin; // Assuming workspace admins can edit

  const fetchInstructions = async () => {
    try {
      // In a real app, pass workspaceId to listInstructions
      const response = await systemAPI.listInstructions();
      if (response && response.instructions) {
        setInstructions(response.instructions);
      }
    } catch (error) {
      console.error("Failed to fetch instructions:", error);
      toast.error("Error", "Failed to load system instructions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchInstructions();
    }
  }, [workspaceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingInstruction) {
        await systemAPI.updateInstruction(
          editingInstruction.id,
          formData.title,
          formData.content
        );
        toast.success("Success", "Instruction updated successfully");
      } else {
        await systemAPI.createInstruction(formData.title, formData.content);
        toast.success("Success", "Instruction created successfully");
      }
      setIsModalOpen(false);
      setEditingInstruction(null);
      setFormData({
        title: "",
        content: "",
      });
      fetchInstructions();
    } catch (error) {
      console.error("Failed to save instruction:", error);
      toast.error("Error", "Failed to save instruction");
    }
  };

  const handleEdit = (instruction: SystemInstruction) => {
    setEditingInstruction(instruction);
    setFormData({
      title: instruction.title,
      content: instruction.content,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setInstructionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!instructionToDelete) return;

    try {
      await systemAPI.deleteInstruction(instructionToDelete);
      toast.success("Success", "Instruction deleted successfully");
      fetchInstructions();
    } catch (error) {
      console.error("Failed to delete instruction:", error);
      toast.error("Error", "Failed to delete instruction");
    } finally {
      setDeleteConfirmOpen(false);
      setInstructionToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Loading instructions...
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-600" />
            Workspace Instructions
          </h1>
          <p className="mt-2 text-gray-500">
            Manage prompts and behavioral instructions specific to this
            workspace.
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => {
              setEditingInstruction(null);
              setFormData({ title: "", content: "" });
              setIsModalOpen(true);
            }}
            className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-5 h-5" />
            Add Instruction
          </button>
        )}
      </div>

      {instructions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No instructions found
          </h3>
          <p className="text-gray-500 mt-1 mb-6">
            Get started by creating your first instruction.
          </p>
          {canEdit && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-secondary"
            >
              Create Instruction
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructions.map((instruction) => (
            <div
              key={instruction.id}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-50 rounded-xl">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                {canEdit && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(instruction)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(instruction.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {instruction.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3 grow">
                {instruction.content}
              </p>

              <div className="pt-4 border-t border-gray-100 flex items-center text-xs text-gray-400 gap-2">
                <Calendar className="w-3 h-3" />
                Created {new Date(instruction.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingInstruction ? "Edit Instruction" : "New Instruction"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input w-full"
                    placeholder="e.g., Customer Support Persona"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="input w-full font-mono text-sm leading-relaxed"
                    placeholder="Enter the instruction content..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingInstruction
                      ? "Update Instruction"
                      : "Create Instruction"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Instruction"
        description="Are you sure you want to delete this instruction? This action cannot be undone."
        confirmText="Delete Instruction"
        variant="danger"
      />
    </div>
  );
}
