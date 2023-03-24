const hello = () => {
    console.log("Hello GitHub!");
};
hello();

// const http = require("http")
// const fs = require("fs")



// const server = http.createServer((req,res)=>{
//    const stream = fs.createReadStream("sample.txt");
//    stream.pipe()
//     // fs.readFile("sample.txt",(err,data)=>{
//     //     res.end(data)
//     // })
// })
// server.listen(4000)


// fs.readFile("sample.txt",(err,data)=>{
//     if (err) throw err;
//     console.log(data.toString())
// })

// fs.appendFile("sample.txt","after updating file",(err)=>{
//     if(err) throw err;
//     console.log("file appended")
// })
// fs.rename("sample.txt","test.txt",(err)=>{
//     if(err) throw err;
//     console.log("changed file name")
// })
// fs.unlink("test.txt",(err)=>{
//     if(err) throw err;
//     console.log("file deleted")
// })