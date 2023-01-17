import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { config } from "../config/config";
import { UserDAL } from "../dal/UserDAL";

const jwtStrategy = new Strategy(
  {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (jwtPayload, done) => {
    UserDAL.get(jwtPayload._id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done("user_not_found", false);
      })
      .catch((err) => {
        return done(err, false);
      });
  }
);

passport.use(jwtStrategy);

export const passportMiddleware = passport.use(jwtStrategy);
export const jwtAuthRequired = passportMiddleware.authenticate("jwt", {
  session: false,
});
