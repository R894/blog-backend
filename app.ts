import dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import userRoutes from './routes/user';
import tagRoutes from './routes/tag';
import postRoutes from './routes/post';
import User from './models/user'
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

dotenv.config();

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        };
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
);

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
});


const app = express();
passport.initialize();
app.use(express.json());
const port = process.env.PORT || 3000;

main().catch(err => console.log(err));

async function main() {
    const db = process.env.DB_URL;
    if(!db){
        throw new Error("DB_URL process env variable must be defined")
    }

    await mongoose.connect(db);
}

// Configure routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/tags', tagRoutes);

// If none of the routes match return 404
app.get('*', (req: Request,res: Response) => {
    res.status(404).json({ message: '404: Not found.' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});