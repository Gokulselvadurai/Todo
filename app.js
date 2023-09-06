const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const async = require('async');

const app = express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

let url="mongodb+srv://Gokul:gokulS321@cluster0.frbjlht.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url);
const listSchema = new mongoose.Schema({
    task: String
});
const list = mongoose.model("list",listSchema);
const list1 = new list({
    task: "Welcome to todo list!!"
});
const list2 = new list({
    task: "click \"✔\" button to add your task"
});
const list3 = new list({
    task: "<- click check box to delete your task"
});
const list4 = new list({
    task: "click \"📑\" to manage your task"
});

const taskSchema = new mongoose.Schema({
    name: {
        type: String
      },
    item: [listSchema]
});
const tasks = mongoose.model("tasks",taskSchema);

list.find({}).then((List)=>{
    if(List.length===0){
        list.create([list1,list2,list3,list4]);
    }
})
const categoryScheme = new mongoose.Schema({
    name: {
        type: String
      }
});
const category = mongoose.model("category",categoryScheme);

app.get("/",async (req, res)=>{
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    // making the day in string format with options
    let day = today.toLocaleDateString("en-US",options);
    let List = await list.find({});
    let categoryList = await category.find({});
    res.render("list",{topic: day, tasks: List, manage: categoryList, host:"Home"});
    
    //render used to send ejs files
});

app.get("/:param",async(req,res)=>{
    let param = req.params.param;
    let categoryList = await category.find({});
    const list5 = new list({
        task: "Here you note your new tasks."
    });
    
    tasks.find({name:param})
        .then((foundlist)=>{
            if(foundlist.length==0){
                const newlist = new tasks({
                    name:param,
                    item:[list5]
                });
                newlist.save();
                res.redirect("/"+_.kebabCase(param));
            }
            else{
                res.render("list",{topic: param, tasks: foundlist[0].item,manage: categoryList,host:param});
            }
        })
        .catch((err)=>{
            console.log(err);
        })
});

app.post("/",(req,res)=>{
    let arg = req.body;
    const listn = new list({
        task: arg.newItem
    });
    if (arg.direct==="Home"){
        listn.save();
        res.redirect("/");
    }
    else{
        tasks.findOne({name:arg.direct})
            .then((list)=>{
                list.item.push(listn);
                list.save();
            })
            .catch((err)=>{
                console.log(err);
            })
        res.redirect("/"+_.kebabCase(arg.direct));
    }
});

app.post("/delete",async (req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    if(name==="Home"){
        list.findByIdAndRemove(id).then((result)=>{
            
        })
        .catch((err)=>{
            console.log(err);
        });
        res.redirect("/");
    }
    else{
        var found = await tasks.findOneAndUpdate({name:name},{$pull: {item:{_id:id}}});
        res.redirect("/"+name);
    }
    
});

app.post("/add",(req,res)=>{
    let buff = req.body.new;
    const newcategory = new category({
        name: buff
    });
    newcategory.save();
    console.log(req.body);
    res.redirect("/");
});

app.listen(3000,()=>{
    console.log("Server stated on port 3000")
});