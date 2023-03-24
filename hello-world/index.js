const hello = () => {
    console.log("Hello GitHub!");
};
hello();

const fs = require("fs")
fs.writeFile("sample.txt","Welcome to Node.js fs module.",
(err)=>{
    if(err) throw err;
    console.log("file created")
})