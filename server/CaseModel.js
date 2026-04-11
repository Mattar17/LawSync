import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    case_number: {
      type: String,
      required: [true, "رقم القضية مطلوب"],
      unique: true,
    },

    case_year: {
      type: String,
      required: [true, "يجب ادخال هذا الحقل"],
    },

    client_name: {
      type: String,
      required: [true, "اسم الموكل مطلوب"],
      trim: true,
    },

    client_opponent_name: {
      type: String,
      required: [true, "اسم الخصم مطلوب"],
      trim: true,
    },

    client_role: {
      type: String,
      enum: {
        values: ["مدعي", "مدعى عليه", "مستأنف", "مستأنف ضده"],
        message: "صفة الموكل غير صحيحة",
      },
      required: [true, "صفة الموكل مطلوبة"],
    },

    client_opponent_role: {
      type: String,
      enum: {
        values: ["مدعي", "مدعى عليه", "مستأنف", "مستأنف ضده"],
        message: "صفة الخصم غير صحيحة",
      },
      required: [true, "صفة الخصم مطلوبة"],
    },

    client_national_id: {
      type: String,
      required: [true, "الرقم القومي مطلوب"],
      match: [/^[0-9]{14}$/, "الرقم القومي يجب أن يتكون من 14 رقمًا"],
      validate: {
        validator: (v) => v.length === 14,
        message: "الرقم القومي يجب أن يكون 14 رقمًا",
      },
    },
    client_opponent_national_id: {
      type: String,
      required: [true, "الرقم القومي للخصم مطلوب"],
      match: [/^[0-9]{14}$/, "الرقم القومي للخصم يجب أن يتكون من 14 رقمًا"],
      validate: {
        validator: (v) => v.length === 14,
        message: "الرقم القومي للخصم يجب أن يكون 14 رقمًا",
      },
    },
    latest_court_session_date: {
      type: String,
    },
    next_court_session_date: {
      type: String,
    },

    case_status: {
      type: String,
      default: "قضية جديدة",
    },
    case_notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const CaseModel = mongoose.model("Case", caseSchema);
export default CaseModel;
