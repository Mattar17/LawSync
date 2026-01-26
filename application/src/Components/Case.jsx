import { Link } from "react-router-dom";
import {
  Hash,
  User,
  BadgeCheck,
  Users,
  Shield,
  IdCard,
  FolderClock,
  Clock,
  EllipsisVertical,
  ArrowLeft,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ConfirmDelete from "./ConfirmDelete";

const api_url = import.meta.env.VITE_API_URL;

export default function Case({ caseDetails, handleCasesChanged }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isModalOpen, setIsModelOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSettingsClick = () => {
    setSettingsOpen((prev) => !prev);
  };

  const handleCancel = () => {
    setIsModelOpen(false);
  };

  const handleConfirm = () => {
    const caseId = caseDetails._id;
    console.log(caseId);

    fetch(`${api_url}/delete-case/${caseId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") handleCasesChanged();
        handleSettingsClick();
      });
  };

  const handleDeleteClick = () => {
    setIsModelOpen(true);
  };

  return (
    <div
      key={caseDetails.case_id}
      className="relative case_card border-border rounded-xl shadow-sm p-5 text-[15px] text-right flex flex-col justify-between"
    >
      <div ref={dropdownRef}>
        <button onClick={handleSettingsClick} className="cursor-pointer">
          <EllipsisVertical size={18} className="mb-2 text-muted-foreground" />
        </button>

        {settingsOpen && (
          <div className="case_card z-50 w-36 absolute top-10 right-0 flex flex-col gap-1.5 items-start text-foreground p-2 rounded-md border border-border shadow-md">
            <NavLink
              to={`/case/update/${caseDetails._id}`}
              className="menu w-full px-2 py-1 hover:bg-gray-900 rounded"
            >
              تعديل القضية
            </NavLink>
            <button
              onClick={handleDeleteClick}
              className="menu w-full text-right px-2 py-1 text-destructive hover:bg-gray-900 rounded cursor-pointer"
            >
              حذف القضية
            </button>
            <ConfirmDelete
              isOpen={isModalOpen}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              message={`هل أنت متأكد من حذف القضية رقم ${caseDetails.case_number}`}
            />
          </div>
        )}
      </div>

      {/* Case Info */}
      <div className="space-y-2">
        <InfoRow
          icon={Hash}
          label="رقم القضية"
          value={`${caseDetails.case_number} لسنة ${caseDetails.case_year}`}
        />

        <InfoRow
          icon={User}
          label="اسم الموكل"
          value={caseDetails.client_name}
        />

        <InfoRow
          icon={BadgeCheck}
          label="صفة الموكل"
          value={caseDetails.client_role}
        />

        <InfoRow
          icon={Users}
          label="اسم الخصم"
          value={caseDetails.client_opponent_name}
        />

        <InfoRow
          icon={Shield}
          label="صفة الخصم"
          value={caseDetails.client_opponent_role}
        />

        <InfoRow
          icon={IdCard}
          label="الرقم القومي"
          value={caseDetails.client_national_id}
        />

        <InfoRow
          icon={FolderClock}
          label="آخر المستجدات"
          value={caseDetails.case_status}
        />

        <InfoRow
          icon={Clock}
          label="تاريخ الإنشاء"
          value={new Date(caseDetails.createdAt).toLocaleDateString("ar-EG")}
        />
      </div>

      {/* Details Link */}
      <div className="mt-4">
        <button
          onClick={() =>
            localStorage.setItem("case_info", JSON.stringify(caseDetails))
          }
        >
          <Link
            to={`/case/${caseDetails._id}`}
            className="text-blue-300 font-semibold hover:underline hover:text-primary/80"
          >
            المزيد من التفاصيل
          </Link>
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={18} className="shrink-0 text-blue-300 ml-1" />
      <p className="text-secondary">
        {label}
        <ArrowLeft className="inline px-1 text-blue-300" size={24}></ArrowLeft>
        {value}
      </p>
    </div>
  );
}
