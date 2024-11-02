import mongoose from "mongoose";


const schema = mongoose.Schema({
    title:String,
    desc:String,
    id:Number
})

const postModel = mongoose.model('post', schema)

export default postModel;