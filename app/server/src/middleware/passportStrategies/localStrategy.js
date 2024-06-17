import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

const localStrategy = (passport, prisma) => {
    passport.use(new LocalStrategy({
        usernameField: "email", 
        passwordField: "password" 
    }, async (email, password, done) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return done(null, false, { message: 'No user with that email' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
                
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.userId);
    });

    passport.deserializeUser(async (userId, done) => { 
        try {
            const user = await prisma.user.findUnique({ where: { userId } }); 
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};

export default localStrategy;