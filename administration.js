var db = openDatabase('schoolMateDB', '1.0', 'SchoolMate Database', 100 * 1024 * 1024);

function loadfunc() {
    document.getElementById('userName').innerHTML = localStorage.staffName;
}

function Umenu(value) {
    document.getElementById('staffDetails').style.display = "none";
    document.getElementById('studentDetails').style.display = "none";

    document.getElementById('userDetails').style.display = "block";
    UresetAll();
    switch (value) {
        case "addUser":
            document.getElementById('userInfo').style.display = "block";
            break;
        case "viewAllUser":
            document.getElementById('UviewAll').style.display = "block";
            viewUser();
            break;

        case "viewUser":
            document.getElementById('UviewOne').style.display = "block";
            break;
    }
}

function UresetAll() {
    document.getElementById('UviewAll').style.display = "none";
    document.userInfo.reset();
    document.getElementById('userInfo').style.display = "none";
    document.getElementById('UviewAll').style.display = "none";
    document.getElementById('userTable').innerHTML = "";
    document.getElementById('UviewOne').style.display = "none";
    document.Uoneform.reset();

}

function Smenu(value) {
    document.getElementById('staffDetails').style.display = "none";
    document.getElementById('studentDetails').style.display = "block";

    document.getElementById('userDetails').style.display = "none";
    resetAll();
    switch (value) {
        case "addSt":
            document.getElementById('studentInfo').style.display = "block";
            break;
        case "viewAllStudent":
            document.getElementById('viewAll').style.display = "block";
            viewStudent();
            break;

        case "viewStudent":
            document.getElementById('viewOne').style.display = "block";
            break;
    }
}

function resetAll() {
    document.getElementById('viewAll').style.display = "none";
    document.studentInfo.reset();
    document.getElementById('studentInfo').style.display = "none";
    document.getElementById('viewAll').style.display = "none";
    document.getElementById('studentTable').innerHTML = "";
    document.getElementById('viewOne').style.display = "none";
    document.oneform.reset();
    document.getElementById('editStudent').style.display = "none";
    document.getElementById('addst').style.display = "block";
}

function Stmenu(value) {
    document.getElementById('staffDetails').style.display = "block";
    document.getElementById('userDetails').style.display = "none";
    document.getElementById('studentDetails').style.display = "none";

    StresetAll();
    switch (value) {

        case "addStaff":
            document.getElementById('staffInfo').style.display = "block";
            break;
        case "viewAllStaff":
            document.getElementById('SviewAll').style.display = "block";
            viewStaff();
            break;
        case "viewStaff":
            document.getElementById('SviewOne').style.display = "block";
            break;
    }
}

function StresetAll() {
    document.getElementById('SviewAll').style.display = "none";
    document.staffInfo.reset();
    document.getElementById('staffInfo').style.display = "none";
    document.getElementById('SviewAll').style.display = "none";
    document.getElementById('staffTable').innerHTML = "";
    document.getElementById('SviewOne').style.display = "none";
    document.Soneform.reset();
    document.getElementById('addstaf').style.display = "block";
    document.getElementById('editStaf').style.display = "none";
}

function addStudent() {

    var formVar = document.getElementById('studentInfo');
    var input = formVar.getElementsByTagName('input');
    var flag = true;
    for (var i = 0; i < input.length; i++) {
        if (input[i].value == "") {
            sweetAlert("Oops...", "Please fill all fields !", "error");
            flag = false;
            break;
        } else if (i == 1) {
            switch (input[i].value) {
                case "1A":
                case "1B":
                case "2A":
                case "2B":
                case "3A":
                case "3B":
                case "4A":
                case "4B":
                    break;
                default:
                    sweetAlert("Oops...", "Please enter valid class ID !", "error");
                    flag = false;

            }
        }
        if (i == 0 && isNaN(input[i].value) == false) {
            sweetAlert("Oops...", "Please enter a valid Name !", "error");
            flag = false;
            break;
        } else if ((i == 0 || i == 2 || i == 3 || i == 5) && isNaN(input[i].value) == false) {
            sweetAlert("Oops...", "Please enter a valid Text !", "error");
            flag = false;
            break;
        } else if ((i == 6) && isNaN(input[i].value) == true) {
            sweetAlert("Oops...", "Please Enter related values !", "error");
            flag = false;
            break;
        } else if (i == 6 && parseInt(input[i].value.length) != 10) {
            sweetAlert("Oops...", "Please Enter valid mobile number !", "error");
            flag = false;
            break;
        } else if (i == 7) {
            var d = input[i].value;
            var m = d.substring(d.indexOf("/") + 1, d.lastIndexOf("/"));
            var dt = d.substring(0, d.indexOf("/"));
            var y = d.substring(d.lastIndexOf("/") + 1, d.length);
            var today = new Date;
            var year = today.getFullYear();
            var mon = today.getMonth() + 1;
            var day = today.getDate();
            m = parseInt(m);
            dt = parseInt(dt);
            y = parseInt(y);
            if ((isNaN(dt) == true) || (isNaN(m) == true) || (isNaN(y) == true)) {
                sweetAlert("Oops...", "Please Enter a valid date (eg: 1/12/2016) !", "error");
                flag = false;
                break;

            }

            if ((y > year) || (dt > 31) || (m > 12) || ((m == 2) && (dt > 29)) || (y < 1970) || (y == year && m > mon) || (y == year && m == mon && dt > day) || (y > (year - 3))) {
                sweetAlert("Oops...", "Please Enter a valid date (eg: 1/12/2016) !", "error");
                flag = false;
                break;

            }
        }
    }


    if (flag) {
        var studentName = document.getElementById('studentName').value,
            classId = document.getElementById('classId').value,
            mName = document.getElementById('mName').value,
            fName = document.getElementById('fName').value,
            address = document.getElementById('address').value,
            religion = document.getElementById('religion').value,
            contactNo = document.getElementById('contactNo').value,
            dob = document.getElementById('dob').value,
            status = "ACTIVE";
        var studentId;



        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO STUDENT_MASTER (NAME,CLASS_ID,MOTHER_NAME,FATHER_NAME,ADDRESS,RELIGION,CONTACT,DOB,STATUS) VALUES (?,?,?,?,?,?,?,?,?)', [studentName, classId, mName, fName, address, religion, contactNo, dob, status]);

            tx.executeSql('SELECT * FROM STUDENT_MASTER WHERE NAME=(?) AND CONTACT=(?)', [studentName, contactNo], function (tx, results) {
                studentId = results.rows.item(0).S_ID;
                swal("Student ID: " + studentId, "Record Updated Successfully !!", "success");
            });
            document.studentInfo.reset();
            document.getElementById('studentInfo').style.display = "none";

        });
    }
}



function updateStudent(value) {
    if (document.getElementById('ustudentId').value == "")
        sweetAlert("Oops...", "Please Enter a student ID to update !", "error");
    else if (value == 1) {
        document.getElementById('editStudent').style.display = "block";
        document.getElementById('addst').style.display = "none";
        var studentId = document.getElementById('ustudentId').value;
        document.getElementById('studentInfo').style.display = "block";
        document.getElementById('viewOne').style.display = "none";
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM STUDENT_MASTER WHERE S_ID=(?)', [studentId], function (tx, results) {
                document.getElementById('studentName').value = results.rows.item(0).NAME;
                document.getElementById('classId').value = results.rows.item(0).CLASS_ID;
                document.getElementById('mName').value = results.rows.item(0).MOTHER_NAME;
                document.getElementById('fName').value = results.rows.item(0).FATHER_NAME;
                document.getElementById('address').value = results.rows.item(0).ADDRESS;
                document.getElementById('religion').value = results.rows.item(0).RELIGION;
                document.getElementById('contactNo').value = results.rows.item(0).CONTACT;
                document.getElementById('dob').value = results.rows.item(0).DOB;

                var d = document.getElementById('studentName').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('classId').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('mName').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('fName').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('address').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('religion').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('contactNo').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('dob').parentNode;
                d.className += ' input--filled';
                document.getElementById('editStudent').style.display = "block";
                document.getElementById('addst').style.display = "none";

            });
        });
    } else if (value == 2) {
        var f = true;
        var formVar = document.getElementById('studentInfo');
        var input = formVar.getElementsByTagName('input');
        var flag = true;
        for (var i = 0; i < input.length; i++) {
            if (input[i].value == "") {
                sweetAlert("Oops...", "Please fill all fields !", "error");
                flag = false;
                break;
            } else if (i == 1) {
                switch (input[i].value) {
                    case "1A":
                    case "1B":
                    case "2A":
                    case "2B":
                    case "3A":
                    case "3B":
                    case "4A":
                    case "4B":
                        break;
                    default:
                        sweetAlert("Oops...", "Please enter valid class ID !", "error");
                        f = false;

                }
            }
            if (i == 0 && isNaN(input[i].value) == false) {
                sweetAlert("Oops...", "Please enter a valid Name !", "error");
                f = false;
                break;
            } else if ((i == 0 || i == 2 || i == 3 || i == 5) && isNaN(input[i].value) == false) {
                sweetAlert("Oops...", "Please enter a valid Text !", "error");
                f = false;
                break;
            } else if ((i == 6) && isNaN(input[i].value) == true) {
                sweetAlert("Oops...", "Please Enter related values !", "error");
                f = false;
                break;
            } else if (i == 6 && parseInt(input[i].value.length) != 10) {
                sweetAlert("Oops...", "Please Enter valid mobile number !", "error");
                f = false;
                break;
            } else if (i == 7) {
                var d = input[i].value;
                var m = d.substring(d.indexOf("/") + 1, d.lastIndexOf("/"));
                var dt = d.substring(0, d.indexOf("/"));
                var y = d.substring(d.lastIndexOf("/") + 1, d.length);
                var today = new Date;
                var year = today.getFullYear();
                var mon = today.getMonth() + 1;
                var day = today.getDate();
                m = parseInt(m);
                dt = parseInt(dt);
                y = parseInt(y);
                if ((isNaN(dt) == true) || (isNaN(m) == true) || (isNaN(y) == true)) {
                    sweetAlert("Oops...", "Please Enter a valid date (eg: 1/12/2016) !", "error");
                    f = false;
                    break;

                }

                if ((y > year) || (dt > 31) || (m > 12) || ((m == 2) && (dt > 29)) || (y < 1970) || (y == year && m > mon) || (y == year && m == mon && dt > day) || (y > (year - 3))) {
                    sweetAlert("Oops...", "Please Enter a valid date (eg: 1/12/2016) !", "error");
                    f = false;
                    break;

                }
            }
        }

        if (f == true) {
            var studentName = document.getElementById('studentName').value,
                classId = document.getElementById('classId').value,
                mName = document.getElementById('mName').value,
                fName = document.getElementById('fName').value,
                address = document.getElementById('address').value,
                religion = document.getElementById('religion').value,
                contactNo = document.getElementById('contactNo').value,
                dob = document.getElementById('dob').value,
                status = "ACTIVE";
            var studentId = document.getElementById('ustudentId').value;



            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM STUDENT_MASTER WHERE S_ID=(?)', [studentId]);
                tx.executeSql('INSERT INTO STUDENT_MASTER (S_ID,NAME,CLASS_ID,MOTHER_NAME,FATHER_NAME,ADDRESS,RELIGION,CONTACT,DOB,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?)', [studentId, studentName, classId, mName, fName, address, religion, contactNo, dob, status]);


                document.studentInfo.reset();
                document.getElementById('studentInfo').style.display = "none";
                document.getElementById('ustudentId').value == "";
            });
            document.getElementById('editStudent').style.display = "none";
            document.getElementById('addst').style.display = "block";
        }
    }
}

function delStudent() {
    if (document.getElementById('ustudentId').value == "")
        sweetAlert("Oops...", "Please Enter a student ID to delete !", "error");
    else {
        var studentId = document.getElementById('ustudentId').value;
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this record!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function () {
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM STUDENT_MASTER WHERE S_ID=(?)', [studentId]);
                document.getElementById('viewOne').style.display = "none";
                swal("Deleted!", "Record has been deleted.", "success");

            });

        });
    }


}


function tableCreate() {
    var col = ['S_ID', 'NAME', 'CLASS_ID', 'MOTHER_NAME', 'FATHER_NAME', 'ADDRESS', 'RELIGION', 'CONTACT', 'DOB'];
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM STUDENT_MASTER', [], function (tx, results) {
            var tbl = document.getElementById('studentTable');
            tbl.setAttribute('class', 'table');
            var cap = tbl.createCaption();
            cap.innerHTML = "<b>Student Information</b>";
            var thead = tbl.createTHead();
            var tr = thead.insertRow();
            for (var j = 0; j < 9; j++) {
                var th = tr.insertCell();
                th.innerHTML = "<b>" + col[j] + "</b>";
            }
            var tbdy = tbl.createTBody();
            for (var i = 0; i < results.rows.length; i++) {
                var tr = tbdy.insertRow();
                for (var j = 0; j < 9; j++) {
                    var td = tr.insertCell();
                    td.innerHTML = results.rows.item(i)[col[j]];
                }
            }
        });
    });
}

function viewStudent() {

    tableCreate();


}


function addStaff() {

    var formVar = document.getElementById('staffInfo');
    var input = formVar.getElementsByTagName('input');
    var flag = true;
    for (var i = 0; i < input.length; i++) {
        if (input[i].value == "") {
            sweetAlert("Oops...", "Please fill all fields !", "error");
            flag = false;
            break;
        } else if (i == 0 && isNaN(input[i].value) == false) {
            sweetAlert("Oops...", "Please enter valid name !", "error");
            flag = false;
            break;
        } else if ((i == 4 || i == 5) && input[i].value < 1) {
            sweetAlert("Oops...", "Please enter valid numbers !", "error");
            flag = false;
            break;
        } else if ((i == 2 || i == 4 || i == 5) && isNaN(input[i].value)) {
            sweetAlert("Oops...", "Please fill relevent information !", "error");
            flag = false;
            break;
        }
        if (i == 2 && input[i].value.length != 10) {
            sweetAlert("Oops...", "Please enter 10 digits of phone number !", "error");
            flag = false;
            break;
        }
    }
    if (flag) {
        var staffName = document.getElementById('staffName').value;
        var address = document.getElementById('addres').value;
        var contactNo = document.getElementById('contactN').value;
        var status = "ACTIVE"
        var hra = document.getElementById('hra').value;
        var basicPay = document.getElementById('basicPay').value;

        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO Staff (Staff_Name,Address,CONTACT,Status,Basic,HRA) VALUES (?,?,?,?,?,?)', [staffName, address, contactNo, status, basicPay, hra]);
            document.staffInfo.reset();

            tx.executeSql('SELECT * FROM Staff WHERE Staff_Name=(?) AND CONTACT=(?)', [staffName, contactNo], function (tx, results) {
                staffId = results.rows.item(0).Staff_Id;
                swal("Staff ID: " + staffId, "Record Updated Successfully !!", "success");
                document.getElementById('staffInfo').style.display = "none";
            });
        });
    }
}




function updateStaff(value) {
    if (document.getElementById('ustaffId').value == "")
        sweetAlert("Oops...", "Please enter staff ID to be updated !", "error");
    else if (value == 1) {
        var staffId = document.getElementById('ustaffId').value;
        document.getElementById('staffInfo').style.display = "block";
        document.getElementById('addstaf').style.display = "none";
        document.getElementById('editStaf').style.display = "block";
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Staff WHERE Staff_Id=(?)', [staffId], function (tx, results) {
                document.getElementById('staffName').value = results.rows.item(0).Staff_Name;
                document.getElementById('addres').value = results.rows.item(0).Address;
                document.getElementById('contactN').value = results.rows.item(0).CONTACT;
                document.getElementById('hra').value = results.rows.item(0).HRA;
                document.getElementById('basicPay').value = results.rows.item(0).Basic;

                var d = document.getElementById('staffName').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('addres').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('contactN').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('hra').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('basicPay').parentNode;
                d.className += ' input--filled';
                document.getElementById('SviewOne').style.display = "none";
                document.getElementById('editStaf').style.display = "block";
                document.getElementById('addstaf').style.display = "none";
            });
        });
    } else if (value == 2) {
        var formVar = document.getElementById('staffInfo');
        var input = formVar.getElementsByTagName('input');
        var f = true;
        for (var i = 0; i < input.length; i++) {
            if (input[i].value == "") {
                sweetAlert("Oops...", "Please fill all fields !", "error");
                f = false;
                break;
            } else if (i == 0 && isNaN(input[i].value) == false) {
                sweetAlert("Oops...", "Please enter valid name !", "error");
                f = false;
                break;
            } else if ((i == 4 || i == 3) && input[i].value < 1) {
                sweetAlert("Oops...", "Please enter valid numbers !", "error");
                f = false;
                break;
            } else if ((i == 2 || i == 4 || i == 5) && isNaN(input[i].value)) {
                sweetAlert("Oops...", "Please fill relevent information !", "error");
                f = false;
                break;
            }
            if (i == 2 && input[i].value.length != 10) {
                sweetAlert("Oops...", "Please enter 10 digits of phone number !", "error");
                f = false;
                break;
            }
        }
        if (f == true) {
            var staffId = document.getElementById('ustaffId').value;
            var staffName = document.getElementById('staffName').value;
            var address = document.getElementById('addres').value;
            var contactNo = document.getElementById('contactN').value;
            var status = "ACTIVE";
            var hra = document.getElementById('hra').value;
            var basicPay = document.getElementById('basicPay').value;

            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM Staff WHERE Staff_Id=(?)', [staffId]);
                tx.executeSql('INSERT INTO Staff (Staff_Id,Staff_Name,Address,CONTACT,Status,Basic,HRA) VALUES (?,?,?,?,?,?,?)', [staffId, staffName, address, contactNo, status,basicPay ,hra ]);
                document.staffInfo.reset();
                swal("Success !!", "Record Updated Successfully !!", "success");
                document.getElementById('ustaffId').value = "";
            });
            document.getElementById('SviewOne').style.display = "block";
            document.getElementById('addstaf').style.display = "block";
            document.getElementById('editStaf').style.display = "none";
            document.getElementById('staffInfo').style.display = "none";
        }
    }

}

function delStaff() {
    if (document.getElementById('ustaffId').value == "")
        sweetAlert("Oops...", "Please enter staff ID to be updated !", "error");
    else {
        var staffId = document.getElementById('ustaffId').value;
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this record!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        }, function () {
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM Staff WHERE Staff_Id=(?)', [staffId]);
                document.getElementById('SviewOne').style.display = "none";
            });
            swal("Deleted!", "Record has been deleted.", "success");
        });
    }


}

function viewStaff() {
    document.getElementById('SviewAll').style.display = "block";
    document.getElementById('staffTable').innerHTML = "";
    var col = ['Staff_Id', 'Staff_Name', 'Address', 'CONTACT', 'Status', 'Basic', 'HRA'];
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Staff', [], function (tx, results) {
            var tbl = document.getElementById('staffTable');
            tbl.setAttribute('class', 'table');
            var cap = tbl.createCaption();
            cap.innerHTML = "<b>Student Information</b>";
            var thead = tbl.createTHead();
            var tr = thead.insertRow();
            for (var j = 0; j < 7; j++) {
                var th = tr.insertCell();
                th.innerHTML = "<b>" + col[j] + "</b>";
            }
            var tbdy = tbl.createTBody();
            for (var i = 0; i < results.rows.length; i++) {
                var tr = tbdy.insertRow();
                for (var j = 0; j < 7; j++) {
                    var td = tr.insertCell();
                    td.innerHTML = results.rows.item(i)[col[j]];
                }
            }
        });
    });
}


function addUser() {
    var formVar = document.getElementById('userInfo');
    var input = formVar.getElementsByTagName('input');
    var flag = true;
    var newflag = false;
    for (var i = 0; i < input.length; i++) {
        if (input[i].value == "") {
            sweetAlert("Oops...", "Please fill all fields !", "error");
            flag = false;
            break;

        } else if (i == 0 && isNaN(input[i].value) == true) {
            sweetAlert("Oops...", "Staff ID not valid !", "error");
            flag = false;
            break;
        }
    }
    if (flag) {
        var staffId = document.getElementById('STAFF_ID').value;
        var staffName = document.getElementById('UNAME').value;
        var access = document.getElementById('ACCESS').value;
        var staffData = {};
        var len;
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Staff', [], function (tx, results) {
                len = results.rows.length;
                for (var i = 0; i < len; i++) {
                    if (results.rows.item(i).Staff_Id == staffId) {
                        newflag = true;
                        break;
                    }


                }
                addUser2(newflag);
            });

        });
    }
}

function addUser2(newflag) {
    var staffId = document.getElementById('STAFF_ID').value;
    var staffName = document.getElementById('UNAME').value;
    var access = document.getElementById('ACCESS').value;
    if (newflag == true) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO LOGIN (STAFF_ID,UNAME,PASS,ACCESS) VALUES (?,?,?,?)', [staffId, staffName, staffName, access]);
            document.userInfo.reset();
            swal("Success !!", "Record Updated Successfully !!", "success");
            document.getElementById('userDetails').style.display = "none";
        });

    } else {
        sweetAlert("Oops...", "Staff ID not Found !", "error");
    }

}

function viewUser() {
    document.getElementById('UviewAll').style.display = "block";
    document.getElementById('userTable').innerHTML = "";
    var col = ['LOGIN_ID', 'STAFF_ID', 'UNAME', 'ACCESS'];
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM LOGIN', [], function (tx, results) {
            var tbl = document.getElementById('userTable');
            tbl.setAttribute('class', 'table');
            var cap = tbl.createCaption();
            cap.innerHTML = "<b>User Information</b>";
            var thead = tbl.createTHead();
            var tr = thead.insertRow();
            for (var j = 0; j < 4; j++) {
                var th = tr.insertCell();
                th.innerHTML = "<b>" + col[j] + "</b>";
            }
            var tbdy = tbl.createTBody();
            for (var i = 0; i < results.rows.length; i++) {
                var tr = tbdy.insertRow();
                for (var j = 0; j < 4; j++) {
                    var td = tr.insertCell();
                    td.innerHTML = results.rows.item(i)[col[j]];
                }
            }

        });
    });
}

function delUser() {
    var staffId = document.getElementById('uuserId').value;
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this record!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    }, function () {
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM LOGIN WHERE STAFF_ID=(?)', [staffId]);
            document.getElementById('SviewOne').style.display = "none";
        });
        document.getElementById('userDetails').style.display = "none";

        swal("Deleted!", "Record has been deleted.", "success");
    });

}
