const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const errorHendler = require("../utils/errorHendler");

const JWT_KEY = process.env.JWT_KEY;

module.exports.signin = async (req, res) => {
  console.log("Gelen istek (signin):", req.body); // Gelen isteği logla

  const candidate = await User.findOne({
    $or: [{ email: req.body.email }, { name: req.body.name }],
  });

  console.log("Bulunan kullanıcı (signin):", candidate); // Kullanıcıyı logla

  if (candidate) {
    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );

    console.log("Şifre doğru mu (signin):", isValidPassword); // Şifre kontrolünü logla

    if (isValidPassword) {
      const token = jwt.sign(
        {
          name: candidate.name,
          userId: candidate._id,
        },
        JWT_KEY,
        { expiresIn: 3600 * 24 * 3 }
      );

      console.log("Oluşturulan token (signin):", token); // Token'ı logla

      return res.status(200).json({
        token: `Bearer ${token}`,
        name: candidate.name,
      });
    } else {
      return res.status(404).json({
        message: "Password is incorrect, try again",
      });
    }
  } else {
    return res.status(404).json({
      message: "User was not found",
    });
  }
};

module.exports.signup = async (req, res) => {
  console.log("Gelen istek (signup):", req.body); // Gelen isteği logla

  const candidate = await User.findOne({
    $or: [{ email: req.body.email }, { name: req.body.name }],
  });

  console.log("Var olan kullanıcı kontrolü (signup):", candidate); // Var olan kullanıcıyı logla

  if (candidate) {
    if (candidate.email === req.body.email) {
      return res.status(409).json({
        message: "Email already exist, please signIn",
      });
    } else {
      return res.status(409).json({
        message: "This name already exist, please choose another one.",
      });
    }
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password,
    });
    console.log("Oluşturulan yeni kullanıcı (signup):", user); // Yeni kullanıcıyı logla

    try {
      await user.save();
      res.status(201).json({
        user,
        message: "User was created",
      });
    } catch (e) {
      console.error("Kullanıcı kaydetme hatası (signup):", e); // Hata durumunda hatayı logla
      errorHendler(res, e);
    }
  }
};

module.exports.validateToken = (req, res) => {
  console.log("Gelen istek (validateToken):", req.headers); // Gelen isteği ve header'ları logla
  const token = req.headers.authorization;

  if (!token) {
    console.log("Token bulunamadı (validateToken)"); // Token bulunamadıysa logla
    return res.status(401).json({
      message: "No token provided",
    });
  }

  jwt.verify(token.split(" ")[1], JWT_KEY, (err, decoded) => {
    if (err) {
      console.error("Token doğrulama hatası (validateToken):", err); // Hata durumunda hatayı logla
      return res.status(403).json({
        message: "Invalid token",
      });
    }
    console.log("Çözülen token bilgileri (validateToken):", decoded); // Çözülen token bilgilerini logla
    return res.status(200).json({
      message: "Token is valid",
    });
  });
};
