import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
// import postModel from "./Schema/postSchema.js";x
import userModel from "./Schema/userSchem.js";
import bcrypt from "bcrypt";
import cors from "cors";
// const PORT = 5000;


const PORT = process.env.PORT || 3030;
const DBRUI = process.env.MONGODB_URI;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// const DBRUI =
//   "mongodb+srv://ibrahimjan31898:ibrahimjan31898@cluster0.kckny.mongodb.net/";

mongoose.connect(DBRUI);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
    status: true,
  });
});

// // Create Post
// app.post('/api/post', async (req, res) => {

//     const { title, desc, id } = req.body

//     if (!title || !desc || !id) {
//         res.json({
//             message: "Required Fields are missing",
//         });
//         return;
//     }

//     const postObj = {
//         title,
//         desc,
//         id,
//     };

//     const response = await postModel.create(postObj);

//     res.json({
//         message: "Post Created",
//         data: response,
//     })

//     res.send("create post")
// })

// //  Post Get
// app.get('/api/post', async (req, res) => {

//     const getData = await postModel.find({});
//     // const getData = await postModel.findOne({});
//     // const getData = await postModel.findById({});
//     // const getData = await postModel.findByIdandDelete({});
//     // const getData = await postModel.findByIdandUpdate({});

//     res.json({
//         message: "Posts fetched",
//         data: getData,
//     })
//     res.send("get post")
// })

// // Post Update
// app.put('/api/post', async (req, res) => {
//     const {title, desc, id} = req.body;
//     console.log(title, desc ,id);

//     const updatePost =  await postModel.findByIdAndUpdate(id, { title, desc});

//     res.json({
//         message: "Post updated",
//         data: updatePost,
//     })
//     // res.send("update post")
// })

// // Delete a post
// app.delete('/api/post/:id', async (req, res) => {
//     const params = req.params.id;
//      await postModel.findByIdAndDelete(params);

//     res.json({
//         message: "Post deleted",
//         data: params,
//     })
// })

// --------------------------- SignUp APi ---------------------------------

app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.json({
      message: "All fields are required",
      status: false,
    });
    return;
  }

  const emailExist = await userModel.findOne({ email });

  console.log(emailExist);

  if (emailExist !== null) {
    res.json({
      message: "Email already exist",
      status: false,
    });
    return;
  }

  // npm i bcrypt run before running
  const hashPassword = await bcrypt.hash(password, 10);

  console.log("hasPassword", hashPassword);

  let usertObj = {
    firstName,
    lastName,
    email,
    password: hashPassword,
  };

  const response = await userModel.create(usertObj);

  res.json({
    message: "User Created Successfully",
    data: response,
  });
});

// --------------------------- Login APi ---------------------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({
      message: "All fields are required",
      status: false,
    });
    return;
  }

  const emailExist = await userModel.findOne({ email });

  if(!emailExist) {
    res.json({
      message: "Invalid Email and Password",
      status: false,
    });
    return;
  }

  const matchPassword = await bcrypt.compare(password, emailExist.password);
  if(!matchPassword) {
    res.json({
        message: "Invalid Email and Password",
        status: false,
    });
    return;
  }

//   const matchPassword = await bcrypt.compare(password, "$2b$10$AuUHeZ3QMgrA2WP/ZkdlJemHvG6wl/ea7hR8l9bW9BlIYdY3gUqQu");
//   if(!matchPassword) {
//     res.json({
//         message: "Invalid Email and Password",
//         status: false,
//     });
//     return;
//   }


  res.json({
    message: "Logged In Successfully",
    status: true,
    user: emailExist,
  });
});

// -------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
