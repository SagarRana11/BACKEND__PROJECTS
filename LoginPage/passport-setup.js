const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); // Adjust the path as needed
const { v4: uuidv4 } = require('uuid');

passport.use(new GoogleStrategy({
    clientID: '957284783356-lrddef6a5lgav3bnvp205j2osn1fplvd.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                username: profile.displayName,
                email: email,
                password: uuidv4(), // Generate a random password
                isVerified: true, // Since it's OAuth, we consider the email verified
            });
        }

        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});