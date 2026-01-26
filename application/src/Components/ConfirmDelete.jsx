export default function ConfirmDelete({
  isOpen,
  onConfirm,
  onCancel,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0000007d] z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 rounded-lg bg-red-800 text-white hover:bg-red-700 transition"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
