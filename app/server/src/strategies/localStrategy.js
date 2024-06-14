import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

const passportLocalValidation = (passport, prisma) => {
    passport.use(new LocalStrategy({
        usernameField: "email", 
        passwordField: "password" 
    }, async (email, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) { 
                throw new Error("No user with that email"); 
            } if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
               throw new Error("Password incorrect");
            }
        } catch (err) {
            return done(err);
        }
    }));
};

export default passportLocalValidation;