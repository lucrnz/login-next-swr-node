import express, { NextFunction } from "express";
import cors from "cors";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const secret = process.env["JWT_SECRET"]!;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

interface User {
  id: number;
  username: string;
  password: string;
}

type UserWithoutPass = Omit<User, "password">;

const users: User[] = [
  {
    id: 1,
    username: "alice",
    password: "password123",
  }, // password: ""
  {
    id: 2,
    username: "bob",
    password: "secret123",
  }, // password: "secret123"
];

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body as Partial<User>;

  if (!username || !password) {
    return res.status(400).send({ success: false, message: "Bad Request" });
  }

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res
      .status(401)
      .send({ success: false, message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });

  // Set token as HTTP-only cookie
  res.cookie("token", token, { httpOnly: true });

  res.send({ success: true, message: "Logged in" });
});

app.post("/logout", (req: Request, res: Response) => {
  if (req.cookies.token) {
    res.clearCookie("token");
  }
  res.send({ success: true, message: "Logged out" });
});

interface AuthenticatedRequest extends Request {
  user?: UserWithoutPass;
}

function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, secret) as Partial<User>;
    const userId = decoded.id;

    // Find user by ID
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(401).send({ message: "Authentication failed" });
    }

    // User is authenticated, add user object to request and call next middleware
    const { password, ...userData } = user;
    req.user = userData;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Authentication failed" });
  }
}

app.get("/me", authenticate, (req: AuthenticatedRequest, res: Response) =>
  res.send(req.user!)
);

app.get("/foo", authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.send({ message: `Hello, ${req.user!.username}!` });
});

app.get("/", (req: Request, res: Response) => {
  const num = 420;
  res.send(`Hello World ${num}!`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
