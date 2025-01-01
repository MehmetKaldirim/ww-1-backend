const errorHendler = require("../utils/errorHendler");
const Record = require("../models/Record");

module.exports.getImage = async (req, res) => {
  try {
    const filePath = `./server/middleware/uploads/${req.params.filename}`; // Dosya yolu
    res.sendFile(filePath, { root: "." }, (err) => {
      if (err) {
        console.error("[getImage] Error sending file:", err);
        res.status(404).json({ message: "Image not found" });
      } else {
        console.log("[getImage] File sent successfully:", filePath);
      }
    });
  } catch (e) {
    console.error("[getImage] Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    console.log("[getAll] Fetching all records for user:", req.user.id);
    const records = await Record.find({ user: req.user.id });
    console.log("[getAll] Records fetched:", records);
    res.status(200).json(records);
  } catch (e) {
    console.error("[getAll] Error fetching records:", e);
    errorHendler(res, e);
  }
};

module.exports.newRecord = async (req, res) => {
  const { user, body, file } = req;
  const data = req.file ? JSON.parse(body.data) : body;
  console.log("[newRecord] Request file:", req.file);
  console.log("[newRecord] Request body:", req.body);

  try {
    console.log("[newRecord] Checking for existing record for user:", user.id);
    const existingRecord = await Record.findOne({
      user: user.id,
      date: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    console.log("[newRecord] Existing record:", existingRecord);

    let imgsrcValue; // Define variable for imgsrc

    if (file && file.path) {
      console.log("[newRecord] File exists, extracting path:", file.path);
      const match = file.path.match(/\/uploads\/(.*)/); // Capture path after /uploads/
      imgsrcValue = match ? match[1] : "./../uploads/placeHolderImg.png";
      console.log("[newRecord] Image source set to:", imgsrcValue);
    } else {
      imgsrcValue = "./../uploads/placeHolderImg.png"; // Default value if no file
      console.log(
        "[newRecord] No file provided, using placeholder image:",
        imgsrcValue
      );
    }

    if (existingRecord) {
      console.log("[newRecord] Updating existing record with new data");
      existingRecord.description = data.description;
      existingRecord.mintemp = data.mintemp;
      existingRecord.maxtemp = data.maxtemp;
      existingRecord.wind = data.wind;
      existingRecord.weatherData = data.weatherData;
      existingRecord.imgsrc = imgsrcValue;
      await existingRecord.save();
      console.log("[newRecord] Record updated successfully:", existingRecord);
      return res.status(200).json({
        data: existingRecord,
        message: "Record was updated!",
      });
    }

    console.log("[newRecord] Creating new record");
    const record = new Record({
      user: user.id,
      imgsrc: imgsrcValue,
      description: data.description,
      mintemp: data.mintemp,
      maxtemp: data.maxtemp,
      wind: data.wind,
      weatherData: data.weatherData,
    });
    await record.save();
    console.log("[newRecord] New record created successfully:", record);
    return res.status(201).json({
      data: record,
      message: "Record was created!",
    });
  } catch (e) {
    console.error("[newRecord] Error saving record:", e);
    errorHendler(res, e);
  }
};

module.exports.getById = async (req, res) => {
  try {
    console.log("[getById] Fetching record by ID:", req.params.id);
    const record = await Record.findById(req.params.id);
    console.log("[getById] Record fetched:", record);
    res.status(200).json(record);
  } catch (e) {
    console.error("[getById] Error fetching record:", e);
    errorHendler(res, e);
  }
};

module.exports.updRecord = async (req, res) => {
  const updated = {
    user: req.user.id,
    description: req.body.description,
  };

  if (req.file) {
    console.log(
      "[updRecord] File provided, updating imgsrc with path:",
      req.file.path
    );
    updated.imgsrc = req.file.path;
  }

  try {
    console.log(
      "[updRecord] Updating record by ID:",
      req.params.id,
      "with data:",
      updated
    );
    const record = await Record.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    );
    console.log("[updRecord] Record updated successfully:", record);
    res.status(201).json(record);
  } catch (e) {
    console.error("[updRecord] Error updating record:", e);
    errorHendler(res, e);
  }
};

module.exports.deleteRecord = async (req, res) => {
  try {
    console.log("[deleteRecord] Deleting record by ID:", req.params.id);
    await Record.deleteOne({ _id: req.params.id });
    console.log("[deleteRecord] Record deleted successfully");
    res.status(200).json("Record was removed");
  } catch (e) {
    console.error("[deleteRecord] Error deleting record:", e);
    errorHendler(res, e);
  }
};
