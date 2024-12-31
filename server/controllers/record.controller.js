const errorHendler = require("../utils/errorHendler");

const Record = require("../models/Record");

module.exports.getAll = async (req, res) => {
  try {
    const records = await Record.find({ user: req.user.id });
    res.status(200).json(records);
  } catch (e) {
    errorHendler(res, e);
  }
};

module.exports.newRecord = async (req, res) => {
  const { user, body, file } = req;
  const data = req.file ? JSON.parse(body.data) : body;
  console.log("Request file:", req.file);
  console.log("Request body:", req.body);
  try {
    const existingRecord = await Record.findOne({
      user: user.id,
      date: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    let imgsrcValue; // imgsrc için değişken tanımla

    if (file && file.path) {
      // file ve path'in varlığını kontrol et
      const match = file.path.match(/(?<=src\/).*/);
      imgsrcValue = match ? match[0] : "./../uploads/placeHolderImg.png"; // Eşleşme yoksa varsayılan değer
    } else {
      imgsrcValue = "./../uploads/placeHolderImg.png"; // file yoksa varsayılan değer
    }
    if (existingRecord) {
      existingRecord.description = data.description;
      existingRecord.mintemp = data.mintemp;
      existingRecord.maxtemp = data.maxtemp;
      existingRecord.wind = data.wind;
      existingRecord.weatherData = data.weatherData;
      existingRecord.imgsrc = imgsrcValue; // imgsrc değerini ata
      await existingRecord.save();
      return res.status(200).json({
        data: existingRecord,
        message: "Record was updated!",
      });
    }
    const record = new Record({
      user: user.id,
      imgsrc: imgsrcValue, // imgsrc değerini ata
      description: data.description,
      mintemp: data.mintemp,
      maxtemp: data.maxtemp,
      wind: data.wind,
      weatherData: data.weatherData,
    });
    await record.save();
    return res.status(201).json({
      data: record,
      message: "Record was created!",
    });
  } catch (e) {
    console.error("Error saving record:", e);
    errorHendler(res, e);
  }
};

module.exports.getById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    res.status(200).json(record);
  } catch (e) {
    errorHendler(res, e);
  }
};

module.exports.updRecord = async (req, res) => {
  const updated = {
    user: req.user.id,
    description: req.body.description,
  };

  if (req.file) {
    updated[imgsrc] = req.file.path;
  }

  try {
    const record = await Record.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    );
    res.status(201).json(record);
  } catch (e) {
    errorHendler(res, e);
  }
};

module.exports.deleteRecord = async (req, res) => {
  try {
    await Record.deleteOne({ _id: req.params.id });
    res.status(200).json("Record was removed");
  } catch (e) {
    errorHendler(res, e);
  }
};
