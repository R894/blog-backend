import dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import userRoutes from './routes/user';
import tagRoutes from './routes/tag';
import postRoutes from './routes/post';
import User from './models/user'
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';


dotenv.config();
// Set up passport

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try{
        const user = await User.findById(jwtPayload.userId);
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

const app = express();
passport.initialize();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

main().catch(err => console.log(err));

async function main() {
    const db = process.env.DB_URL;
    if(!db){
        throw new Error("DB_URL process env variable must be defined");
    }

    await mongoose.connect(db);
}

// Login Endpoint
app.post('/login', async (req: Request, res: Response) => {
  const {username, password} = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET process env variable must be defined"); 
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });

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