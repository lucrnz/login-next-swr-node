import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const num = 420;
  res.send(`Hello World ${num}!`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
