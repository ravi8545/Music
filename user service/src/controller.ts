import TryCatch from "./TryCatch.js";
import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = TryCatch(async (req, res) => {

    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
        res.status(400).json({
            message: "User already exists"
        });
        return;
    }
    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        name,
        email,
        password: hashPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.status(201).json({
        message: "User registered successfully",
        token,
        user
    });

});

export const loginUser = TryCatch(async (req, res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        res.status(404).json({
            message: "User does not exist"
        });
        return;
    }
   const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        res.status(400).json({
            message: "Invalid credentials"
        });
        return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.status(200).json({
        message: "User logged in successfully",
        token,
        user
    });                
}) 

export const myProfile=TryCatch(async (req: AuthenticatedRequest, res)=>{
    const user = req.user;

    res.json(user);

})

export const saveToPlaylist = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.user?._id);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    const songId = req.params.id as string;

    if (user.playlist.includes(songId)) {
        const index = user.playlist.indexOf(songId);
        user.playlist.splice(index, 1);
        await user.save();
        res.json({ message: "Removed from playlist", playlist: user.playlist });
    } else {
        user.playlist.push(songId);
        await user.save();
        res.json({ message: "Added to playlist", playlist: user.playlist });
    }
});