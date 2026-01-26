export default function CaseInfoInputs({
  handleSubmit,
  formData,
  handleChange,
  submitLabel,
  disableCaseNumber,
}) {
  const roles = ["مدعي", "مدعى عليه"];
  return (
    <form className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-[45%]">
          <label className="block mb-1 font-semibold text-blue-300">
            رقم القضية
          </label>
          <input
            type="text"
            name="case_number"
            value={formData.case_number}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
            required
            disabled={disableCaseNumber}
          />
        </div>
        <div className="w-[45%]">
          <label className="block mb-1 font-semibold text-blue-300">لسنة</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
            type="number"
            id="year"
            name="case_year"
            min="1900"
            max={new Date().getFullYear()}
            placeholder={new Date().getFullYear()}
            step="1"
            value={formData.case_year}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-[45%]">
          <label className="block mb-1 font-semibold text-blue-300">
            اسم العميل
          </label>
          <input
            type="text"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          />
        </div>
        <div className="w-[45%]">
          <label className="block mb-1 font-semibold text-blue-300">
            دور العميل
          </label>
          <select
            name="client_role"
            value={formData.client_role}
            onChange={handleChange}
            className="w-full border case_card border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          >
            <option value="" className="text-gray-400">
              اختر الدور
            </option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-[45%]">
          <label className="block mb-1 font-semibold text-blue-300">
            اسم الخصم
          </label>
          <input
            type="text"
            name="client_opponent_name"
            value={formData.client_opponent_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          />
        </div>

        <div className="w-[45%]">
          <label className="block mb-1 font-semibold text-blue-300">
            دور الخصم
          </label>
          <select
            name="client_opponent_role"
            value={formData.client_opponent_role}
            onChange={handleChange}
            className="w-full border case_card border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          >
            <option value="" className="text-gray-400">
              اختر الدور
            </option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-blue-300">
          الرقم القومي
        </label>
        <input
          type="text"
          name="client_national_id"
          value={formData.client_national_id}
          onChange={handleChange}
          className="w-full case_card border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          required
          pattern="[0-9]{14}"
          title="الرقم القومي يجب أن يكون مكوناً من 14 رقم"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-blue-300">
          آخر المستجدات
        </label>
        <input
          type="text"
          name="case_status"
          value={formData.case_status}
          onChange={handleChange}
          className="w-full case_card border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          required
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={formData.client_national_id.length !== 14}
        type="submit"
        className="w-full btn text-primary font-semibold py-2 rounded-lg hover:bg-gray-600 hover:text-gray-50 transition"
      >
        <span className="w-full hover:border-blue-300 hover:border-b-2">
          {submitLabel}
        </span>
      </button>
    </form>
  );
}
