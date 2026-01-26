import { mkdir, readdir, stat, unlink, rm } from "fs/promises";
import { writeFileSync } from "fs";
import path from "path";
import CaseModel from "./CaseModel.js";

const getAllCases = async function (req, res) {
  console.log(process.env.CASES_ROOT);
  try {
    const Cases = await CaseModel.find({}).sort({ createdAt: -1 });

    if (!Cases)
      return (
        res.status(404),
        json({ status: "error", message: "لا يوجد قضايا" })
      );

    return res.status(200).json({ status: "success", data: Cases });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "خطأ في الخادم" });
  }
};

const getCaseById = async function (req, res) {
  try {
    if (!req.params.id)
      return res
        .status(403)
        .json({ status: "error", message: "القضية غير موجودة أو تم مسحها" });

    const Case = await CaseModel.findById(req.params.id);
    if (!Case)
      return res
        .status(404)
        .json({ status: "error", message: "القضية غير موجودة أو تم مسحها" });

    return res.status(200).json({ status: "success", data: Case });
  } catch (err) {
    return res.json({ status: "error", message: "خطأ في الخادم" });
  }
};

const getCase = async function (req, res) {
  try {
    const { q } = req.query;
    const caseNumber = Number(q);

    const CasesBySearchQuery = await CaseModel.find({
      $or: [
        { case_id: q },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$case_number" },
              regex: q,
              options: "i",
            },
          },
        },
        { client_name: { $regex: q, $options: "i" } },
        { client_opponent_name: { $regex: q, $options: "i" } },
        { client_national_id: { $regex: q } },
      ],
    });

    if (!CasesBySearchQuery) {
      return res
        .status(404)
        .json({ status: "error", message: "no cases found" });
    }

    return res
      .status(200)
      .json({ status: "success", data: CasesBySearchQuery });
  } catch (err) {
    return res.json({ status: "error", message: "خطأ في الخادم" });
  }
};

const CreateCase = async function (req, res) {
  try {
    const isCaseExist = await CaseModel.findOne({
      case_number: req.body.case_number,
    });

    if (isCaseExist)
      return res
        .status(403)
        .json({ status: "error", message: "رقم القضية موجود مسبقاً" });

    const newCase = new CaseModel(req.body);

    const validator = newCase.validateSync();

    if (validator) {
      const errors = Object.fromEntries(
        Object.entries(validator.errors).map(([k, v]) => [k, v.message]),
      );

      return res.status(403).json({
        status: "error",
        message: `خطأ في بيانات القضية: ${Object.values(errors)}`,
      });
    }

    newCase.save().then(console.log("document saved"));

    return res.status(201).json({
      status: "success",
      message: `تم إنشاء قضية جديدة برقم ${newCase.case_number}`,
    });
  } catch (err) {
    return res.json({ status: "error", message: "خطأ في الخادم" });
  }
};

const deleteCase = async function (req, res) {
  try {
    const caseToDelete = await CaseModel.findById(req.params.id);
    if (!caseToDelete)
      return res
        .status(404)
        .json({ status: "error", message: "القضية غير موجودة أو تم مسحها" });

    await CaseModel.deleteOne({ _id: req.params.id });

    const folderPath = path.join(process.cwd(), "cases_files", req.params.id);

    await rm(folderPath, { recursive: true, force: true });

    return res
      .status(200)
      .json({ status: "success", message: "تم مسح القضية بنجاح" });
  } catch (err) {
    return res.json({ status: "error", message: "خطأ في الخادم" });
  }
};

const updateCase = async function (req, res) {
  try {
    const updatedCase = await CaseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedCase)
      return res
        .status(404)
        .json({ status: "error", message: "القضية غير موجودة أو تم مسحها" });

    return res.status(200).json({
      status: "success",
      message: "تم تعديل القضية بنجاح",
      data: updateCase,
    });
  } catch (err) {
    return res.json({ status: "error", message: "خطأ في الخادم" });
  }
};

const addCaseFiles = async function (req, res) {
  try {
    if (!req.files || !req.body.case_id)
      return res
        .status(403)
        .json({ status: "error", message: "تعذر قراءة الملف!!" });

    const folderPath = `${process.cwd()}/cases_files/${req.body.case_id}`;
    await mkdir(folderPath, { recursive: true });
    req.files.forEach((file) => {
      writeFileSync(
        path.join(folderPath, file.originalname),
        file.buffer,
        (err) => {
          if (err)
            res
              .status(500)
              .json({ status: "error", message: "حدث خطأ أثناء إضافة الملف" });
        },
      );
    });

    res
      .status(201)
      .json({ status: "success", message: "تم إضافة الملف بنجاح!" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: `خطأ في الخادم` });
  }
};

const getCaseFiles = async function (req, res) {
  try {
    const { case_id } = req.params;

    const folderPath = path.join(process.cwd(), "cases_files", case_id);

    const files = await readdir(folderPath);

    const filesData = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const stats = await stat(filePath);

        return {
          name: file,
          size: stats.size,
          type: path.extname(file).toLowerCase(),
          url: `/cases_files/${case_id}/${encodeURIComponent(file)}`,
        };
      }),
    );

    res.json(filesData);
  } catch (err) {
    res.status(404).json({
      message: "No files found for this case",
    });
  }
};

const deleteFile = async function (req, res) {
  try {
    const { case_id, file_name } = req.params;
    if (!case_id || !file_name) return res.json("ابعت ال id يا محترم");

    const folderPath = `${process.cwd()}/cases_files/${case_id}`;
    console.log("folderPath:: ", folderPath);
    const filePath = path.join(folderPath, file_name);
    await unlink(filePath);
    return res.json({ status: "success", message: "تم حذف الملف بنجاح" });
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(500).json({
        status: "error",
        message: `الملف غير موجود`,
      });
    }

    return res.status(500).json({ status: "error", message: `خطأ في الخادم` });
  }
};

export {
  CreateCase,
  addCaseFiles,
  getAllCases,
  getCase,
  getCaseById,
  deleteCase,
  updateCase,
  deleteFile,
  getCaseFiles,
};
