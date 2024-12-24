const { JWT_KEY } = require("../../config/keys");
//const JWT_KEY = process.env.JWT_KEY;
const User = require("../models/User");

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // we take token from header
  secretOrKey: JWT_KEY,
};

module.exports = (passport) => {
  // describe why we're exporting passport func and logic inside
  passport.use(
    new JWTStrategy(options, async (payload, done) => {
      // then we need to find user in DB model
      try {
        const user = await User.findById(payload.userId).select("name id");

        if (user) {
          done(null, user); // nodejs convenction - first need to handle error and if we do not have an error we need to pass null
        } else {
          done(null, false);
        }
      } catch (e) {
        console.log(e);
      }
    })
  );
};
