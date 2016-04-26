var db = openDatabase('schoolMateDB', '1.0', 'SchoolMate Database', 100 * 1024 * 1024);
var class_id;
var studentData = {},
    TstudentData = {};
var len, Tlen;
var marks = [],
    Tmarks = [];


function enterTerm() {
    var sclass = document.getElementById('tclass').value;
    var ssec = document.getElementById('tsec').value;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Class WHERE section=(?) AND class=(?)', [ssec, sclass], function (tx, results) {
            class_id = results.rows.item(0).Class_Id;
            console.log("class id: ", class_id);
            enterTerm2(class_id);
        });
    });
}

function enterTerm2(class_id) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM STUDENT_MASTER WHERE CLASS_ID=(?)', [class_id], function (tx, results) {
            Tlen = results.rows.length;
            for (var i = 0; i < Tlen; i++) {
                TstudentData[i] = results.rows.item(i);
            }
            console.log("number of students: ", Tlen);
            enterTerm3();
        });
    });
}

function enterTerm3() {
    document.getElementById('termTable').innerHTML = "";
    var Tcol = ['Student ID', 'Name', 'PROCESS', 'PORTFOLIO', 'UA', 'CE', 'TE'];
    var tbl = document.getElementById('termTable');
    tbl.setAttribute('class', 'table');
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>MOnthly Exam</b>";

    var thead = tbl.createTHead();
    var tr = thead.insertRow();

    for (var j = 0; j < 7; j++) {
        var th = tr.insertCell();
        th.innerHTML = "<b>" + Tcol[j] + "</b>";
    }

    var tbdy = tbl.createTBody();

    for (var i = 0; i < Tlen; i++) {
        var tr = tbdy.insertRow();
        var th = tr.insertCell();
        th.innerHTML = TstudentData[i].S_ID;
        var th = tr.insertCell();
        th.innerHTML = TstudentData[i].NAME;
        var th = tr.insertCell();
        th.innerHTML = "<input type='number' id='in" + i + "'>";
        var th = tr.insertCell();
        th.innerHTML = "<input type='number' id='in" + (i + 1) + "'>";
        var th = tr.insertCell();
        th.innerHTML = "<input type='number' id='in" + (i + 2) + "'>";
        var th = tr.insertCell();
        th.innerHTML = "<input type='number' id='in" + (i + 3) + "'>";
        var th = tr.insertCell();
        th.innerHTML = "<input type='number' id='in" + (i + 4) + "'>";
    }
}

function enterMonthly() {
    var sclass = document.getElementById('sclass').value;
    var ssec = document.getElementById('ssec').value;
    var sterm = document.getElementById('sterm').value;
    var testno = document.getElementById('testno').value;
    var ssub = document.getElementById('ssub').value;


    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Class WHERE section=(?) AND class=(?)', [ssec, sclass], function (tx, results) {
            class_id = results.rows.item(0).Class_Id;
            console.log("class id: ", class_id);
            enterMonthly2(class_id);
        });
    });

}

function enterMonthly2(class_id) {

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM STUDENT_MASTER WHERE CLASS_ID=(?)', [class_id], function (tx, results) {
            len = results.rows.length;
            for (var i = 0; i < len; i++) {
                studentData[i] = results.rows.item(i);
            }
            console.log("number of students: ", len);
            enterMonthly3();
        });
    });
}

function enterMonthly3() {
    document.getElementById('monthlyTable').innerHTML = "";
    var Tcol = ['Student ID', 'Name', 'Marks'];
    var tbl = document.getElementById('monthlyTable');
    tbl.setAttribute('class', 'table');
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>MOnthly Exam</b>";

    var thead = tbl.createTHead();
    var tr = thead.insertRow();

    for (var j = 0; j < 3; j++) {
        var th = tr.insertCell();
        th.innerHTML = "<b>" + Tcol[j] + "</b>";
    }

    var tbdy = tbl.createTBody();

    for (var i = 0; i < len; i++) {
        var tr = tbdy.insertRow();
        var th = tr.insertCell();
        th.innerHTML = studentData[i].S_ID;
        var th = tr.insertCell();
        th.innerHTML = studentData[i].NAME;
        var th = tr.insertCell();
        th.innerHTML = "<input type='number' id='in" + i + "'>";
    }

}

function addterm() {
    var formt = document.getElementById('termForm');
    var input = formt.getElementsByTagName('input');
    for (var i = 0; i < input.length; i++) {
        console.log("input ", i, " value: ", input[i].value);
        Tmarks[i] = input[i].value;
    }
    addterm2();
}

function addterm2() {
    var sterm = document.getElementById('tterm').value;
    var ssub = document.getElementById('tsub').value;
    var flag = null;

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM MARKS WHERE Class_Id=(?) AND Term=(?)', [class_id, sterm], function (tx, results) {
            if (results.rows.length == 0) {
                console.log("no exists");
                flag = false;
            } else {
                console.log("exists");
                flag = true;
            }
            addterm3(flag);
        });

    });
}

function addterm3(flag) {
    console.log("flag is ", flag);
    var sterm = document.getElementById('tterm').value;
    var ssub = document.getElementById('tsub').value;
    var last;
    db.transaction(function (tx) {
        for (var i = 0, j = 0; i < Tlen; i++, j += 5) {
            console.log("insert for student ",i);
            tx.executeSql('INSERT INTO MARKS_DETAILS (PROCESS, PORTFOLIO, UA, CE, TE) VALUES (?,?,?,?,?)', [Tmarks[j], Tmarks[j + 1], Tmarks[j + 2], Tmarks[j + 3], Tmarks[j + 4]]);
            tx.executeSql('SELECT * FROM MARKS_DETAILS ', function (tx, results) {
                var l = results.rows.length;
                last = results.rows.item(l - 1);
                console.log("last is: ",last);
            });
            
            addterm4(last, i,flag);
        }
    });


}

function addterm4(last, i,flag) {
    var sterm = document.getElementById('tterm').value;
    var ssub = document.getElementById('tsub').value;
    var qry, insqry;
    switch (ssub) {
        case 'English':
            qry = "UPDATE MARKS SET ENGLISH=(?) WHERE CLASS_ID=(?) AND TERM=(?) AND S_ID=(?)";
            insqry = "INSERT INTO MARKS (S_ID,CLASS_ID,TERM,ENGLISH) VALUES (?,?,?,?)";
            break;
        case 'Hindi':
            qry = "UPDATE MARKS SET HINDI=(?) WHERE CLASS_ID=(?) AND TERM=(?) AND S_ID=(?)";
            insqry = "INSERT INTO MARKS (S_ID,CLASS_ID,TERM,HINDI) VALUES (?,?,?,?)";

            break;
        case 'LANGUAGE':
            qry = "UPDATE MARKS SET LANGUAGE=(?) WHERE CLASS_ID=(?) AND TERM=(?) AND S_ID=(?)";
            insqry = "INSERT INTO MARKS (S_ID,CLASS_ID,TERM,LANGUAGE) VALUES (?,?,?,?)";

            break;
        case 'EVS':
            qry = "UPDATE MARKS SET EVS=(?) WHERE CLASS_ID=(?) AND TERM=(?) AND S_ID=(?)";
            insqry = "INSERT INTO MARKS (S_ID,CLASS_ID,TERM,EVS) VALUES (?,?,?,?)";

            break;
        case 'MATHS':
            qry = "UPDATE MARKS SET MATHS=(?) WHERE CLASS_ID=(?) AND TERM=(?) AND S_ID=(?)";
            insqry = "INSERT INTO MARKS (S_ID,CLASS_ID,TERM,MATHS) VALUES (?,?,?,?)";

            break;

    }
    console.log("i is: ",i);
    console.log("student i: ",TstudentData[i].S_ID);
    if (flag == true) {
        db.transaction(function (tx) {
            tx.executeSql(qry, [last, class_id, sterm, TstudentData[i].S_ID]);
        });
    } else if (flag == false) {
        db.transaction(function (tx) {
            tx.executeSql(insqry, [TstudentData[i].S_ID, class_id, sterm, last]);
        });
    }
}

function addmonthly() {


    var formv = document.getElementById('monthlyForm');
    var input = formv.getElementsByTagName('input');
    for (var i = 0; i < input.length; i++) {
        console.log("input ", i, " value: ", input[i].value);
        marks[i] = input[i].value;
    }
    addmonthly2();

}

function addmonthly2() {
    var sterm = document.getElementById('sterm').value;
    var testno = document.getElementById('testno').value;
    var ssub = document.getElementById('ssub').value;
    var flag = null;

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Monthly_Test WHERE Class_Id=(?) AND TEST_NO=(?) AND Term=(?)', [class_id, testno, sterm], function (tx, results) {
            if (results.rows.length == 0) {
                console.log("no exists");
                flag = false;
            } else {
                console.log("exists");
                flag = true;
            }
            addmonthly3(flag);
        });

    });

}

function addmonthly3(flag) {
    console.log("flag is ", flag);
    var sterm = document.getElementById('sterm').value;
    var testno = document.getElementById('testno').value;
    var ssub = document.getElementById('ssub').value;
    var qry, insqry;

    switch (ssub) {
        case 'English':
            qry = "UPDATE Monthly_Test SET English=(?) WHERE Class_Id=(?) AND TEST_NO=(?) AND Term=(?) AND S_Id=(?)";
            insqry = "INSERT INTO Monthly_Test (S_Id,Class_Id,TEST_NO,Term,English) VALUES (?,?,?,?,?)";
            break;
        case 'Hindi':
            qry = "UPDATE Monthly_Test SET Hindi=(?) WHERE Class_Id=(?) AND TEST_NO=(?) AND Term=(?) AND S_Id=(?)";
            insqry = "INSERT INTO Monthly_Test (S_Id,Class_Id,TEST_NO,Term,Hindi) VALUES (?,?,?,?,?)";

            break;
        case 'LANGUAGE':
            qry = "UPDATE Monthly_Test SET LANGUAGE=(?) WHERE Class_Id=(?) AND TEST_NO=(?) AND Term=(?) AND S_Id=(?)";
            insqry = "INSERT INTO Monthly_Test (S_Id,Class_Id,TEST_NO,Term,LANGUAGE) VALUES (?,?,?,?,?)";

            break;
        case 'EVS':
            qry = "UPDATE Monthly_Test SET EVS=(?) WHERE Class_Id=(?) AND TEST_NO=(?) AND Term=(?) AND S_Id=(?)";
            insqry = "INSERT INTO Monthly_Test (S_Id,Class_Id,TEST_NO,Term,EVS) VALUES (?,?,?,?,?)";

            break;
        case 'MATHS':
            qry = "UPDATE Monthly_Test SET MATHS=(?) WHERE Class_Id=(?) AND TEST_NO=(?) AND Term=(?) AND S_Id=(?)";
            insqry = "INSERT INTO Monthly_Test (S_Id,Class_Id,TEST_NO,Term,MATHS) VALUES (?,?,?,?,?)";

            break;
        case 'IT':
            qry = "UPDATE Monthly_Test SET IT=(?) WHERE Class_Id=(?) AND TEST_NO=(?) AND Term=(?) AND S_Id=(?)";
            insqry = "INSERT INTO Monthly_Test (S_Id,Class_Id,TEST_NO,Term,IT) VALUES (?,?,?,?,?)";

            break;
        case 'Arabic':
            qry = "UPDATE Monthly_Test SET Arabic=(?) WHERE Class_Id=(?) AND TEST_NO=(?) AND Term=(?) AND S_Id=(?)";
            insqry = "INSERT INTO Monthly_Test (S_Id,Class_Id,TEST_NO,Term,Arabic) VALUES (?,?,?,?,?)";

            break;

    }
    if (flag == true) {
        db.transaction(function (tx) {
            for (var i = 0; i < len; i++) {
                tx.executeSql(qry, [marks[i], class_id, testno, sterm, studentData[i].S_ID]);
            }
        });
    } else if (flag == false) {
        db.transaction(function (tx) {
            for (var i = 0; i < len; i++) {
                tx.executeSql(insqry, [studentData[i].S_ID, class_id, testno, sterm, marks[i]]);
            }
        });
    }
}
