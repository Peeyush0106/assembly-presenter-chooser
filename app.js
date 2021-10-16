var loading_show = true;

const firebaseConfig = {
    apiKey: "AIzaSyDE4LcGILX1TGmxT2zFkgsC_1Mh5FwmKzQ",
    authDomain: "assembly-presenter-chooser.firebaseapp.com",
    projectId: "assembly-presenter-chooser",
    storageBucket: "assembly-presenter-chooser.appspot.com",
    messagingSenderId: "965749017601",
    appId: "1:965749017601:web:7324243b2d3b0c5cc2c400",
    measurementId: "G-GWN104CL5R"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var auth = firebase.auth();

var randomCaseNames = ["AARUSH SHIVALE", "AAYANA SARFARE", "Aayush Sawant", "ANSCHEL SANANDA", "Anviti Yadav", "ARYAVEER DESAI", "Ashmit Thete", "ATHARV KUMAR", "AVANI J KODAGI", "Avishi Dhiman", "AYAAN KAPOOR", "Diya Parihar", "Hamza Chaudhary", "ISHAAN Devendra SAWANT", "JINAY CHORDIA", "Lohitaksha Sharma", "MAIRA SHAIKH", "Mayank Marathe", "PARTH RAHUL BHARDWAJ", "PEEYUSH DEEPAKKUMAR AGARWAL", "PREM BHOSALE", "Raaga Praveen Hottigimath", "Ryan Mohapatra", "SAANVI TOMAR", "Saarth Veerkar", "SAKSHI FALAK", "SAMIT SHETTY", "SANJANA HAZRA", "SHAARAV PATWARDHAN", "SHANTANU KHEDKAR", "SHRAVANI KOLHE", "SHREEJAY PATIL", "Shreeya Roshan Kumar", "SOHAM GATTANI", "VAANYA SAXENA", "VIDHI JAIN", "Vishakh Sawalakhe"]

var studentNames = [];
var leftOutStudentNames = [];

for (const m in randomCaseNames) studentNames.push(randomCaseNames[m].toLowerCase());

var leftOutStudentsData = {};
var studentsData = {};
var leftOutStudentNamesSet = false;

setStudentNames();

function setStudentNames() {
    for (const i in studentNames) {
        const studentName = studentNames[i].toLowerCase();
        var li = document.createElement("li");
        li.innerHTML = `
            <label for="checkbox-` + i + `">` + studentName + `</label>
            <input type="checkbox" id="checkbox-` + i + `"></input>
        `;
        document.getElementById("student-list").appendChild(li);
        li.id = "student-" + (parseInt(i) + 1);

        document.getElementById("checkbox-" + parseInt(i)).onclick = function () {
            console.log(document.getElementById("checkbox-" + parseInt(i)).checked);
            if (document.getElementById("checkbox-" + parseInt(i)).checked) {
                leftOutStudentsData = {};
                setStudentData(parseInt(i), studentName);
                setLeftOutStudentData(studentName);
                document.getElementById("student-" + (parseInt(i) + 1)).style.color = "red";
                document.getElementById("student-" + (parseInt(i) + 1)).style.textDecoration = "line-through";
                updateStudentData();
            }
            else {
                document.getElementById("student-" + (parseInt(i) + 1)).style.color = "black";
                document.getElementById("student-" + (parseInt(i) + 1)).style.textDecoration = "none";
            }
            // database.ref("Students/" + studentNames[parseInt(i)]).update({
            //     next: false
            // }).then(() => {
            //     database.ref("Students/" + studentNames[parseInt(i)]).get().then((data) => {
            //         console.log(data.val());
            //     })
            // });
        };
    }
}

setInterval(getStudentData, 500);

function setStudentData(no, studentName) {
    const studentData = {
        done: document.getElementById("checkbox-" + no).checked,
        studentNo: no + 1,
        name: studentName
    };
    studentsData[studentName] = studentData;
    return studentData;
}

function setLeftOutStudentData(studentName) {
    const studentData = studentsData[studentName];
    if (!studentData.done) {
        leftOutStudentsData[studentName] = studentData;
    }
}

var nextStudentEltSet = false;

function getStudentData() {
    database.ref("Students").get().then((data) => {
        if (data.exists()) {
            studentsData = data.val();
            for (var j = 0; j < studentNames.length; j++) {
                const studentName = studentNames[j];
                const studentData = studentsData[studentName];
                if (studentData.done) {
                    document.getElementById("student-" + studentData.studentNo).style.color = "red";
                    document.getElementById("student-" + studentData.studentNo).style.textDecoration = "line-through";
                    var chkbxNo = parseInt(studentData.studentNo) - 1
                    document.getElementById("checkbox-" + chkbxNo).checked = true;
                    if (studentData.next) {
                        studentData.next = false;
                        updateStudentData();
                    }
                }
                if (studentData.next) {
                    document.getElementById("student-" + studentData.studentNo).style.color = "blue";
                    if (!nextStudentEltSet) {
                        var chkbxNo = parseInt(studentData.studentNo) - 1
                        document.getElementById("student-" + studentData.studentNo).innerHTML += `  
                            <label for="checkbox-` + chkbxNo + `"> (next participant) </label>
                        `;
                        nextStudentEltSet = true;
                    }
                }
                setLeftOutStudentData(studentName);
            }
            if (!leftOutStudentNamesSet) {
                for (const p in leftOutStudentsData) {
                    leftOutStudentNames.push(leftOutStudentsData[p].name);
                    console.log("push");
                }
                console.log(leftOutStudentNames);
                leftOutStudentNamesSet = true;
            }
        }
        else {
            updateStudentData();
        }
    });
}

var randomStudentIndex, choosenName;

function getRandomStudent() {
    randomStudentIndex = randomNo(1, leftOutStudentNames.length) - 1
    var lowerCaseName = leftOutStudentNames[randomStudentIndex];
    console.log(lowerCaseName);
    choosenName = lowerCaseName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    document.getElementById("presenter-name").innerHTML = `
    Random Choice: <div style="color: green;">` + choosenName + `</div>
    `;
    document.getElementById("popupForm").style.display = "block";
}

function updateStudentData() {
    database.ref("/").update({
        Students: studentsData
    }).then(() => {
        for (let l = 0; l < studentNames.length; l++) {
            const studentName = studentNames[l];
            setStudentData(l, studentName);
            setLeftOutStudentData(studentName);
        }
        getStudentData();
    });
}

function randomNo(min, max) {
    return Math.floor(Math.random() * max) + min
}


function acceptStudent() {
    for (var j = 0; j < studentNames.length; j++) if (studentsData[studentNames[j]].next) studentsData[studentNames[j]].next = false;
    document.getElementById("student-list").innerHTML = "";
    setStudentNames();
    document.getElementById("popupForm").style.display = "none";
    leftOutStudentsData[leftOutStudentNames[randomStudentIndex]].next = true;

    database.ref("/").update({
        Students: studentsData
    }).then(() => {
        for (let l = 0; l < studentNames.length; l++) {
            const studentName = studentNames[l];
            setStudentData(l, studentName);
            setLeftOutStudentData(studentName);
        }
        getStudentData();
        location.reload();
    });
}

/* We could also have used auth.onStateChanged, but that doesn't get called in disconnections
*/
checkConnectionEveryHalfSeconds();
function checkConnectionEveryHalfSeconds() {
    setTimeout(function () {
        var connectedRef = database.ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val()) {
                loading_show = false;
                document.getElementById("content-for-connected-users").style.display = "block";
            }
            else {
                loading_show = true;
                document.getElementById("content-for-connected-users").style.display = "none";
            }
        });
        checkConnectionEveryHalfSeconds();
    }, 500);
}

function restartRound() {
    database.ref("/").remove().then(location.reload());
}