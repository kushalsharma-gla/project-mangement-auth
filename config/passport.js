import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

export const configurePassport = (passport) => {
  // Local Strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      // Find user by username
      const user = await User.findOne({ username });
      
      // If user not found
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      
      // Check password
      const isMatch = await user.comparePassword(password);
      
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid username or password' });
      }
    } catch (error) {
      return done(error);
    }
  }));
  
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};