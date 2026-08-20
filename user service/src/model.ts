import mongoose, {Document,Schema} from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    playlist: string[];
}


