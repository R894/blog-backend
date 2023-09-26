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
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


dotenv.config();

// Set up passport
passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try{
        const user = await User.findById(jwtPayload.sub);
        if (user) {
          return done(null, user);
        } else {
            return done(null, false);
        }
      }catch(error){
        return done(error, false);
      }
    }
  )
)


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

// Login Endpoint
app.post('/login', (req: Request, res: Response) => {
  passport.authenticate('local', { session: false }, (err: any, user: any) => {
      if (err || !user) {
          return res.status(401).json({ message: 'Authentication failed' });
      }

      // Generate a JWT token with user ID as the payload
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable must be defined');
      }
      
      const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
      });

      res.json({ token });
  })(req, res);
});

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