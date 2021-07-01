const passport = require("passport");
const { UsersService } = require("../services");
const { Strategy, ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY_JWT;

const opts = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const service = new UsersService();
      const user = await service.getUserById(payload.id);
      if (!user) {
        return done(new Error("User not found"));
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      done(error);
    }
  })
);
