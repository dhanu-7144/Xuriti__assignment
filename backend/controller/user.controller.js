import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 


export const signup = async (req, res) => {
    try {
      const {
        username,
        password,
        confirmpassword
      } = req.body;

      const hashpassword=await bcrypt.hash(password,10);

      const date = new Date();
      const user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      else if(password.length<8)
      {
        return res.status(400).json({ message: "Password need to be 8 characters long" });
      }
      else if(password!==confirmpassword){
        return res.status(400).json({ message: "Passwords dont match" });
      } else  {
        const createdUser = new User({
          username: username,
          password: hashpassword,
          date:date.toLocaleDateString(),
          time:date.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        });
        await createdUser.save();

        const token=jwt.sign({_id:createdUser._id},process.env.JWT_SECRET,{
          expiresIn:"90d",
        });

        res.status(201).json({
          message: "User created successfully",
          user: {
            _id: createdUser._id,
            username: createdUser.username,
            date:createdUser.date,
            time:createdUser.time,
          },token,
        });

      }
    } catch (error) {
      console.log("error:" + error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };



  export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (user) {
        const isvalidpassword = await bcrypt.compare(password,user.password);
        if (isvalidpassword) {
          const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:"90d",
          });
          res.status(200).json({
            message: "Login Successful",
            user: {
              _id: user._id,
              username: user.username,
            },token,
          });
        } else {
          return res.status(400).json({ message: "Invalid password" });
        }
      } else {
        return res.status(400).json({ message: "Invalid username " });
      }
    } catch (error) {
      console.log("Error:" + error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };



  export const getusers = async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json(error);
    }
  };
  