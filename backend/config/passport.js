import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/userModel.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userModel.findOne({ googleId: profile.id });
        if (!user) {
            // check if email already exists (merge accounts)
            const email = profile.emails?.[0]?.value;
            user = email ? await userModel.findOne({ email }) : null;
            if (user) {
                user.googleId = profile.id;
                if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
                await user.save();
            } else {
                user = await userModel.create({
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value || null,
                    googleId: profile.id,
                    avatar: profile.photos?.[0]?.value || null,
                    password: null,
                    role: 'customer',
                });
            }
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// Required by passport even when using session:false on the callback route
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try { done(null, await userModel.findById(id)); } catch (e) { done(e, null); }
});

export default passport;
