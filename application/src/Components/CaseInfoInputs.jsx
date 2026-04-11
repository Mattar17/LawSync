import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { caseSchema } from "../validationSchema/caseSchema";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

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
    watch,
    setValue,
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
          className="space-y-2 text-md"
          noValidate
        >
          <div className="flex justify-between gap-6">
            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-blue-300">
                رقم القضية
              </label>
              <input
                {...register("case_number")}
                disabled={disableCaseNumber}
                className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2 focus:ring-0 focuse:border-gray-200 transition"
              />
              {errors.case_number && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.case_number.message}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-blue-300">
                لسنة
              </label>
              <input
                {...register("case_year")}
                type="text"
                placeholder={new Date().getFullYear()}
                className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
              />
              {errors.case_year && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.case_year.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-6">
            <div className="w-1/2 border-2 border-[#6a6a6a66] rounded-lg p-4">
              <h3 className="font-semibold text-gray-50 mb-4">بيانات الموكل</h3>

              <hr className="my-2 border-[#6a6a6a66]"></hr>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold text-blue-300">
                    اسم العميل
                  </label>
                  <input
                    {...register("client_name")}
                    type="text"
                    className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
                  />
                  {errors.client_name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.client_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-blue-300">
                    دور العميل
                  </label>
                  <select
                    {...register("client_role")}
                    className="case_card w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
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

                <div>
                  <label className="block mb-1 font-semibold text-blue-300">
                    الرقم القومي
                  </label>
                  <input
                    {...register("client_national_id")}
                    type="text"
                    className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
                  />
                  {errors.client_national_id && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.client_national_id.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-1/2 border-2 border-[#6a6a6a66] rounded-lg p-4">
              <h3 className="font-semibold text-gray-50 mb-4">بيانات الخصم</h3>

              <hr className="my-2 border-[#6a6a6a66]"></hr>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold text-blue-300">
                    اسم الخصم
                  </label>
                  <input
                    {...register("client_opponent_name")}
                    type="text"
                    className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
                  />
                  {errors.client_opponent_name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.client_opponent_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-blue-300">
                    دور الخصم
                  </label>
                  <select
                    {...register("client_opponent_role")}
                    className="case_card w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
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

                <div>
                  <label className="block mb-1 font-semibold text-blue-300">
                    الرقم القومي
                  </label>
                  <input
                    {...register("client_opponent_national_id")}
                    type="text"
                    className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
                  />
                  {errors.client_opponent_national_id && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.client_opponent_national_id.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between gap-6">
            <div className="flex-1 relative">
              <label className="block mb-1 font-semibold text-blue-300">
                تاريخ الجلسة الماضية
              </label>
              <DatePicker
                selected={watch("latest_court_session_date")}
                onChange={(date) => setValue("latest_court_session_date", date)}
                wrapperClassName="w-full"
                className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
              />
              {errors.latest_court_session_date && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.latest_court_session_date.message}
                </p>
              )}
            </div>

            <div className="flex-1 relative">
              <label className="block mb-1 font-semibold text-blue-300">
                تاريخ الجلسة القادمة
              </label>
              <div className="w-full flex justify-between gap-6">
                <DatePicker
                  selected={watch("next_court_session_date")}
                  onChange={(date) => setValue("next_court_session_date", date)}
                  wrapperClassName="w-full"
                  className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
                />
              </div>
              {errors.next_court_session_date && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.next_court_session_date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-blue-300">
              آخر المستجدات
            </label>
            <input
              {...register("case_status")}
              type="text"
              className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
            />
            {errors.case_status && (
              <p className="text-red-600 text-sm mt-1">
                {errors.case_status.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-blue-300">
              ملاحظات إضافية
            </label>
            <textarea
              {...register("case_notes")}
              className="w-full border-2 border-[#6a6a6a66] rounded-lg p-2"
              rows="3"
            />
            {errors.case_notes && (
              <p className="text-red-600 text-sm mt-1">
                {errors.case_notes.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn font-semibold py-2 mt-2 rounded-lg transition"
          >
            {submitLabel}
          </button>
        </form>
      )}
    </div>
  );
}
