import express from "express";
import axios from "axios";

const app = express();
const port = 8888;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let chats = [];

// Define routes
app.get("/", (req, res) => {
    chats = [];
    res.render("chat", { wholeChats: chats });
});

app.post("/analyze-sentiment", async (req, res) => {
  const text = req.body.text;

  try {
    // Send a POST request to the FastAPI server
    let url = "http://localhost:8000/analyze-sentiment/?text=" + text;
    const response = await axios.post(url);
    const data = response.data;
    chats.push(data);
    console.log(chats);

    res.render("chat", { wholeChats: chats });
  } catch (error) {
    console.error("Error while analyzing sentiment:", error);
    res.status(500).send("An error occurred while analyzing sentiment.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port${port}`);
});
