import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const localStrategy = (passport) => {
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
        console.log("Serializing user: ", user);
        console.log("Serializing ID: ", user.userId);
        done(null, user.userId);
    });

    passport.deserializeUser(async (userId, done) => { 
        try {
            const user = await prisma.user.findUnique({ where: { userId } }); 
            console.log("Deserialized user: ", user);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};

export default localStrategy;