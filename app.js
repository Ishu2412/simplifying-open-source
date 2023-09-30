import express from "express";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import session from "express-session";
import fetch from "node-fetch";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
// Configure session middleware
app.use(
  session({
    secret: "77633b33f5ba24d85c8e0b53275873f8deead17b",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth 2.0 strategy configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: "Iv1.b7d448bd3fc4d84e", // Replace with your GitHub OAuth App's Client ID
      clientSecret: "77633b33f5ba24d85c8e0b53275873f8deead17b", // Replace with your GitHub OAuth App's Client Secret
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Store user profile information or perform other actions as needed
      return done(null, { profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Define routes
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

// Redirect to GitHub for authentication when the button is clicked
app.get("/auth/github", passport.authenticate("github"));

// GitHub callback route after authentication
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, retrieve user data and latest commits here
    const { profile, accessToken } = req.user;

    // Fetch user data
    fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((userData) => {
        // Fetch latest commits
        fetch(`https://api.github.com/user/repos?per_page=5`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((repositories) => {
            // Render the data in the 'index' view
            console.log(userData);
            console.log(repositories);
            res.render("index", { user: userData, repositories });
          })
          .catch((error) => {
            console.error("Error fetching repositories:", error);
            res.status(500).send("Internal server error");
          });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        res.status(500).send("Internal server error");
      });
  }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
