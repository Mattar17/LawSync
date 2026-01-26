import {
  Hash,
  User,
  Users,
  Shield,
  IdCard,
  Clock,
  CirclePlus,
  X,
  FileText,
  ArrowLeft,
  FolderClock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConfirmDelete from "./ConfirmDelete";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function CaseDetails() {
  const { case_id } = useParams();

  const caseDetails = JSON.parse(localStorage.getItem("case_info"));
  if (!caseDetails) return null;

  const Item = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 text-md">
      <Icon size={24} className="text-blue-300 pl-0.5" />
      <p className="text-foreground">
        {label}
        <ArrowLeft className="inline px-1 text-blue-300" size={24}></ArrowLeft>
        {value}
      </p>
    </div>
  );

  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [reloadFiles, setRelaodFiles] = useState(false);

  useEffect(() => {
    fetch(`${VITE_API_URL}/cases/${case_id}/files`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) return;
        setFiles(data);
        console.log(data);
      });
  }, [case_id, reloadFiles]);

  const handleFileUpload = (event) => {
    const FilesUploaded = event.target.files[0];
    console.log(FilesUploaded);
    const newFile = {
      FilesUploaded,
      url: URL.createObjectURL(FilesUploaded),
      newFile: true,
      type: "." + FilesUploaded.type.split("/")[1],
    };
    setNewFiles((prev) => [...prev, newFile]);
  };

  useEffect(() => {
    return () => {
      newFiles.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [newFiles]);

  const handleDeleteFile = (fileName, isNewFile) => {
    if (isNewFile) {
      setNewFiles((prev) =>
        newFiles.filter((file) => file.FilesUploaded.name !== fileName),
      );
      return;
    }

    setIsOpen(true);
    setFileToDelete(fileName);
  };

  const handleSaveNewFiles = () => {
    if (!newFiles.length) return;

    const formData = new FormData();
    formData.append("case_id", case_id);
    newFiles.forEach((file) => {
      formData.append("files", file.FilesUploaded);
    });

    fetch(`${VITE_API_URL}/add-files`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNewFiles([]);
        setRelaodFiles((prev) => !prev);
      });
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  const onConfirm = () => {
    console.log(fileToDelete, case_id);
    fetch(`${VITE_API_URL}/delete-file/${case_id}/${fileToDelete}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setIsOpen(false);
          setRelaodFiles((prev) => !prev);
        }
      });
  };

  useEffect(() => {
    function handlePaste(event) {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/") || item.type === "application/pdf") {
          const file = item.getAsFile();
          console.log("Pasted image file:", file);

          // preview
          const previewUrl = URL.createObjectURL(file);
          console.log("Preview URL:", previewUrl);
          const newFile = {
            FilesUploaded: file,
            url: previewUrl,
            newFile: true,
            type: "." + file.type.split("/")[1],
          };
          setNewFiles((prev) => [...prev, newFile]);
        }
      }
    }
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] case_card rounded-xl shadow-md p-6">
      {isOpen && (
        <ConfirmDelete
          isOpen={isOpen}
          onCancel={onCancel}
          onConfirm={onConfirm}
          message={`هل أنت متأكد من حذف هذا الملف ${fileToDelete}`}
        ></ConfirmDelete>
      )}
      <h2 className="text-lg font-bold text-blue-300">تفاصيل القضية</h2>

      <div className="space-y-3">
        <Item
          icon={Hash}
          label="رقم القضية"
          value={`${caseDetails.case_number} لسنة ${caseDetails.case_year}`}
        />

        <Item icon={User} label="اسم الموكل" value={caseDetails.client_name} />

        <Item
          icon={Users}
          label="الخصم"
          value={caseDetails.client_opponent_name}
        />

        <Item
          icon={Shield}
          label="صفة الموكل"
          value={caseDetails.client_role}
        />

        <Item
          icon={Shield}
          label="صفة الخصم"
          value={caseDetails.client_opponent_role}
        />

        <Item
          icon={IdCard}
          label="الرقم القومي"
          value={caseDetails.client_national_id}
        />

        <Item
          icon={FolderClock}
          label="آخر المستجدات"
          value={caseDetails.case_status}
        />

        {caseDetails.createdAt && (
          <Item
            icon={Clock}
            label="تاريخ الإنشاء"
            value={new Date(caseDetails.createdAt).toLocaleDateString("ar-EG")}
          />
        )}
      </div>
      <h2 className="text-lg font-bold pt-6 text-blue-300">ملفات القضية</h2>
      <div className="grid grid-cols-6 gap-4 pt-4">
        {files &&
          files.map((file) => (
            <div key={file.url} className="border border-gray-600 rounded-lg">
              <FilePreview handleDeleteFile={handleDeleteFile} file={file} />
              <p className="text-xs truncate text-center text-gray-400 font-semibold">
                {file.name}
              </p>
            </div>
          ))}

        {newFiles &&
          newFiles.map((file, index) => (
            <div
              key={`${file.FilesUploaded.name}-${index}`}
              className="h-44 w-full border border-gray-600 rounded-lg relative"
            >
              <FilePreview file={file} handleDeleteFile={handleDeleteFile} />

              <p className="text-xs truncate text-center text-gray-300 font-semibold">
                {file.FilesUploaded.name}
              </p>
            </div>
          ))}

        <div className="w-40 h-44 border rounded-lg flex items-center justify-center text-gray-400 hover:text-[#981316]">
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={(event) => handleFileUpload(event)}
          />
          <label
            htmlFor="fileUpload"
            className="w-full h-full flex items-center"
          >
            <CirclePlus className="mx-auto " size={58} />
          </label>
        </div>
      </div>
      {newFiles.length > 0 && (
        <div className="flex justify-center items-center pt-4">
          <button
            onClick={handleSaveNewFiles}
            className="mx-auto p-2 bg-blue-300 text-gray-700 rounded hover:bg-black/85"
          >
            إضافة الملفات
          </button>
        </div>
      )}
    </div>
  );
}

function FilePreview({ file, handleDeleteFile }) {
  const [fullPreview, setFullPreview] = useState(false);

  const BaseURL = file.newFile ? "" : `${VITE_API_URL}`;
  const fileName = file.newFile ? file.FilesUploaded.name : file.name;

  if ([".jpg", ".png", ".jpeg", ".webp"].includes(file.type)) {
    return (
      <div className="relative w-full h-40 overflow-hidden rounded">
        <button
          className="cursor-pointer absolute top-2 right-2 z-10 text-white bg-black/60 p-1 rounded-full"
          onClick={() => handleDeleteFile(fileName, file.newFile)}
        >
          <X size={16} />
        </button>
        <div
          onClick={() => setFullPreview(true)}
          className="w-full h-full cursor-pointer"
        >
          <img
            src={`${BaseURL}${file.url}`}
            alt={fileName}
            className="w-full h-full object-contain"
          />
        </div>

        {fullPreview && (
          <FileFullPreview onClose={() => setFullPreview(false)}>
            <img
              src={`${BaseURL}${file.url}`}
              alt={fileName}
              className="max-w-[90vw] max-h-[90vh] object-cover rounded"
            />
          </FileFullPreview>
        )}
      </div>
    );
  }

  if (file.type === ".pdf") {
    return (
      <div className="relative w-full h-40 overflow-hidden rounded">
        <button
          className="absolute top-2 right-2 z-20 text-white bg-black/60 p-1 rounded-full"
          onClick={() => handleDeleteFile(fileName)}
        >
          <X size={16} />
        </button>
        <button
          onClick={() => setFullPreview(true)}
          className="relative w-full h-40 rounded overflow-hidden"
        >
          <iframe
            src={`${BaseURL}${file.url}`}
            className="w-full h-full pointer-events-none"
            title={fileName}
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition">
            <FileText size={40} className="text-red-400" />
          </div>
          <div className="absolute inset-0 bg-black/5 hover:bg-black/30 transition" />
        </button>

        {fullPreview && (
          <FileFullPreview onClose={() => setFullPreview(false)}>
            <iframe
              src={`${BaseURL}${file.url}`}
              className="w-[90vw] h-[90vh] rounded"
            />
          </FileFullPreview>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-40 overflow-hidden rounded">
      <button
        className="absolute top-2 right-2 z-10 text-white bg-black/60 p-1 rounded-full"
        onClick={() => handleDeleteFile(fileName)}
      >
        <X size={16} />
      </button>
      <a
        href={`${BaseURL}${file.url}`}
        target="_blank"
        className="text-blue-600 underline"
      >
        {fileName}
      </a>
    </div>
  );
}

function FileFullPreview({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white 
                   hover:text-red-400 transition"
      >
        <X size={32} />
      </button>

      <div className="p-4">{children}</div>
    </div>
  );
}
