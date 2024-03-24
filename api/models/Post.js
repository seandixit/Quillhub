const mongoose = require('mongoose')
const {Schema,model} = mongoose;

const PostSchema = new Schema({
    titleCanvasData:String,
    mainCanvasData:String,
    ocrTitleText:String,
    ocrMainText:String,
    date:String,
    author:{type: Schema.Types.ObjectId, ref:'User'},
    //summary:String,
    //content:String,
    //cover:String,     // the first page of content as a jpg
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel; 