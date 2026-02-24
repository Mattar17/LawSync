import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { caseSchema } from "../validationSchema/caseSchema";
import { useEffect } from "react";

export default function CaseInfoInputs({
  submitCase,
  submitLabel,
  formData,
  disableCaseNumber,
}) {
  const roles = ["مدعي", "مدعى عليه"];
  console.log("Received formData in CaseInfoInputs:", formData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(caseSchema),
    mode: "onBlur",
  });

  console.log("Received formData in CaseInfoInputs:", formData);

  useEffect(() => {
    console.log("Received formData in CaseInfoInputs:", formData);
    if (formData) reset(formData);
  }, [formData, reset]);

  const onSubmit = (data) => {
    console.log("VALID DATA:", data);
    submitCase(data);
  };

  return (
    <div>
      {!formData ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="flex items-center justify-between">
            <div className="w-[45%]">
              <label className="block mb-1 font-semibold text-blue-300">
                رقم القضية
              </label>
              <input
                {...register("case_number")}
                disabled={disableCaseNumber}
                className="w-full border rounded-lg p-2 focus:ring-1"
              />
              {errors.case_number && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.case_number.message}
                </p>
              )}
            </div>

            <div className="w-[45%]">
              <label className="block mb-1 font-semibold text-blue-300">
                لسنة
              </label>
              <input
                {...register("case_year")}
                type="text"
                placeholder={new Date().getFullYear()}
                className="w-full border rounded-lg p-2 focus:ring-1"
              />
              {errors.case_year && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.case_year.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="w-[45%]">
              <label className="block mb-1 font-semibold text-blue-300">
                اسم العميل
              </label>
              <input
                {...register("client_name")}
                type="text"
                className="w-full border rounded-lg p-2 focus:ring-1"
              />
              {errors.client_name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.client_name.message}
                </p>
              )}
            </div>

            <div className="w-[45%]">
              <label className="block mb-1 font-semibold text-blue-300">
                دور العميل
              </label>
              <select
                {...register("client_role")}
                className="case_card w-full border rounded-lg p-2 focus:ring-1"
              >
                <option value="">اختر الدور</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.client_role && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.client_role.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="w-[45%]">
              <label className="block mb-1 font-semibold text-blue-300">
                اسم الخصم
              </label>
              <input
                {...register("client_opponent_name")}
                type="text"
                className="w-full border rounded-lg p-2 focus:ring-1"
              />
              {errors.client_opponent_name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.client_opponent_name.message}
                </p>
              )}
            </div>

            <div className="w-[45%]">
              <label className="block mb-1 font-semibold text-blue-300">
                دور الخصم
              </label>
              <select
                {...register("client_opponent_role")}
                className="case_card w-full border rounded-lg p-2 focus:ring-1"
              >
                <option value="">اختر الدور</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.client_opponent_role && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.client_opponent_role.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-blue-300">
              الرقم القومي للموكل
            </label>
            <input
              {...register("client_national_id")}
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-1"
            />
            {errors.client_national_id && (
              <p className="text-red-600 text-sm mt-1">
                {errors.client_national_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-blue-300">
              الرقم القومي للخصم
            </label>
            <input
              {...register("client_opponent_national_id")}
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-1"
            />
            {errors.client_opponent_national_id && (
              <p className="text-red-600 text-sm mt-1">
                {errors.client_opponent_national_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-blue-300">
              تاريخ الجلسة الماضية
            </label>
            <input
              {...register("latest_court_session_date")}
              type="date"
              className="w-full border rounded-lg p-2 focus:ring-1"
            />
            {errors.latest_court_session_date && (
              <p className="text-red-600 text-sm mt-1">
                {errors.latest_court_session_date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-blue-300">
              تاريخ الجلسة القادمة
            </label>
            <input
              {...register("next_court_session_date")}
              type="date"
              className="w-full border rounded-lg p-2 focus:ring-1"
            />
            {errors.next_court_session_date && (
              <p className="text-red-600 text-sm mt-1">
                {errors.next_court_session_date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-blue-300">
              آخر المستجدات
            </label>
            <input
              {...register("case_status")}
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-1"
            />
            {errors.case_status && (
              <p className="text-red-600 text-sm mt-1">
                {errors.case_status.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn font-semibold py-2 rounded-lg transition"
          >
            {submitLabel}
          </button>
        </form>
      )}
    </div>
  );
}
