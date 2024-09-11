const express = require("express");
const router = express.Router();

const auth = require("./controller/Auth");
const task = require("./controller/Task");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../public/user_images");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Define file size limit (e.g., 5MB = 5 * 1024 * 1024 bytes)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 1MB
  },
  fileFilter: (req, file, callback) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return callback(null, true);
    } else {
      callback(new Error("Only images (jpeg, jpg, png) are allowed"));
    }
  },
});

router.use("/login", (req, res) => {
  auth.UserLogin(req, res);
});

router.use("/registration", (req, res) => {
  auth.UserRegistration(req, res);
});

router.use("/forgot_pwd", (req, res) => {
  auth.ForgotPassword(req, res);
});

router.post("/create_task", (req, res) => {
  task.CreateTask(req, res);
});

router.get("/new_task", (req, res) => {
  task.NewTask(req, res);
});

router.get("/recent_task", (req, res) => {
  task.RecentTask(req, res);
});

router.get("/all_task", (req, res) => {
  task.AllTask(req, res);
});

router.get("/task_action", (req, res) => {
  task.TaskAction(req, res);
});

router.post("/update_task", (req, res) => {
  task.UpdateTask(req, res);
});

router.post("/profileUpdate", upload.single("profile_image"), (req, res) => {
  auth.UpdateProfile(req, res);
});

module.exports = router;
