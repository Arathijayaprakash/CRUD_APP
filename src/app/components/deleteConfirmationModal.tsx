"use client";
import React from "react";

interface DeleteConfirmationModalProps {
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this item?",
    onConfirm,
    onCancel,
}) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center animate-fadeIn">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600 mb-5">{message}</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
