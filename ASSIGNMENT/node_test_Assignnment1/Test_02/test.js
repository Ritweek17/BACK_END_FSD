import http from "http";
import fs from "fs";

const PORT = 3000;
const FILE = "students.json";


if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
}



const studentForm = `
<!DOCTYPE html>
<html>
<head>
    <title>Student Record</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            text-align: center;
            padding: 30px;
        }

        form {
            background: white;
            width: 350px;
            margin: 30px auto;
            padding: 25px;
            border-radius: 10px;
        }

        input {
            width: 90%;
            padding: 10px;
            margin: 8px;
        }

        button {
            padding: 10px 25px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>

<body>

    <h1>Student Record Form</h1>

    <form method="POST" action="/add">

        <input
            type="text"
            name="name"
            placeholder="Student Name"
            required
        >

        <input
            type="text"
            name="roll"
            placeholder="Roll Number"
            required
        >

        <input
            type="text"
            name="course"
            placeholder="Course"
            required
        >

        <input
            type="email"
            name="email"
            placeholder="Email"
            required
        >

        <br>

        <button type="submit">Add Student</button>

    </form>

    <a href="/students">View Student Records</a>

</body>
</html>
`;



const server = http.createServer((req, res) => {

    // Home Page
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>Welcome to Student Record System</h1>
            ${studentForm}
        `);
    }



    else if (req.method === "POST" && req.url === "/add") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        
        req.on("end", () => {

            const data = new URLSearchParams(body);

            const student = {
                name: data.get("name"),
                roll: data.get("roll"),
                course: data.get("course"),
                email: data.get("email")
            };


            const students = JSON.parse(
                fs.readFileSync(FILE, "utf-8")
            );


     
            students.push(student);


           
            fs.writeFileSync(
                FILE,
                JSON.stringify(students, null, 2)
            );


         
            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(`
                <h1>Student Added Successfully!</h1>

                <p>Name: ${student.name}</p>
                <p>Roll Number: ${student.roll}</p>
                <p>Course: ${student.course}</p>
                <p>Email: ${student.email}</p>

                <br>

                <a href="/">Add Another Student</a>
                <br><br>
                <a href="/students">View All Students</a>
            `);
        });
    }



    else if (req.method === "GET" && req.url === "/students") {

        const students = JSON.parse(
            fs.readFileSync(FILE, "utf-8")
        );

        let studentList = "";

        students.forEach((student, index) => {

            studentList += `
                <div style="
                    background:white;
                    padding:15px;
                    margin:15px auto;
                    width:400px;
                    border-radius:8px;
                ">
                    <h3>Student ${index + 1}</h3>
                    <p><b>Name:</b> ${student.name}</p>
                    <p><b>Roll:</b> ${student.roll}</p>
                    <p><b>Course:</b> ${student.course}</p>
                    <p><b>Email:</b> ${student.email}</p>
                </div>
            `;
        });


        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Records</title>
            </head>

            <body style="
                font-family:Arial;
                text-align:center;
                background:#f4f4f4;
                padding:30px;
            ">

                <h1>Student Records</h1>

                ${studentList || "<p>No student records found.</p>"}

                <br>

                <a href="/">Back to Form</a>

            </body>
            </html>
        `);
    }


   
    else {

        res.writeHead(404, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>404 - Page Not Found</h1>
            <a href="/">Go to Home</a>
        `);
    }

});


server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});