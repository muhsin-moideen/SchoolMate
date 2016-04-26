var db = openDatabase('schoolMateDB', '1.0', 'SchoolMate Database', 100 * 1024 * 1024);
var studentId, firstTime = true,
    formRepeat = 0,
    class_id;
var term;
var subs = ['ENGLISH', 'HINDI', 'LANGUAGE', 'EVS', 'MATHS', ''];
var m, i = 0;
var mark_id, mid = [];
var data1 = {};
var data2 = {};


function loadfunc() {
    document.getElementById('userName').innerHTML = localStorage.staffName;
}

function menu(value) {
    document.getElementById('sub').innerHTML = subs[0];
    resetAll();

    switch (value) {
        case "AMonthly":
            document.getElementById('addMon').style.display = "block";
            break;

        case "ATerm":
            document.getElementById('addTrm').style.display = "block";
            break;

        case "VMonthly":
            document.getElementById('viewAll').style.display = "block";
            break;

        case "VTerm":
            document.getElementById('viewOne').style.display = "block";
            break;

    }
}

function resetAll() {
    document.getElementById('viewOne').style.display = "none";
    document.getElementById('viewAll').style.display = "none";
    document.getElementById('addTrm').style.display = "none";
    document.getElementById('addMon').style.display = "none";
    document.getElementById('Tstudent_id').value="";
    document.fmonthly.reset();
    document.fterm.reset();
    document.allDivF.reset();
    document.oneDivF.reset();
        document.getElementById('allTable_Mon').value="";
        document.getElementById('allTable_Term').value="";
        document.getElementById('oneTable_Mon').value="";
        document.getElementById('oneTable_Term').value="";   
}

function addMarks(value) {
    studentId = document.getElementById('student_id').value;
    term = document.getElementById('term').value;

    var flag = true;

    if (value == "monthlyMarks") {
        var formVar = document.getElementById('fmonthly');
        var input = formVar.getElementsByTagName('input');
        for (var j = 0; j < input.length; j++) {
            if (input[j].value == "" || isNaN(input[j].value) == true || parseInt(input[j].value) > 100 ||parseInt(input[j].value) < 1) {
                value = 0;
                flag = false;
                sweetAlert("Oops...", "Please fill relevent data !", "error");
            }
        }
        if (flag)
            value = 1;
    } else if (value == "termMarks") {
        var formVar = document.getElementById('fterm');
        var input = formVar.getElementsByTagName('input');
        for (var j = 0; j < input.length; j++) {
            if (input[j].value == "" || isNaN(input[j].value) == true || parseInt(input[j].value) > 100 ||parseInt(input[j].value) < 1) {
                value = 0;
                flag = false;
                sweetAlert("Oops...", "Please fill Grades !", "error");
            }
        }
        if (flag)
            value = 2;
    }

    if (value == 1) {
        var testno = document.getElementById('testno').value;
        var eng = document.getElementById('eng').value;
        var hin = document.getElementById('hin').value;
        var lang = document.getElementById('lang').value;
        var evs = document.getElementById('evs').value;
        var math = document.getElementById('math').value;
        var it = document.getElementById('it').value;
        var ar = document.getElementById('ar').value;
        var last;

        //to find last test_id
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Monthly_Test', [], function (tx, results) {
                var len = results.rows.length;
                last = results.rows.item(len - 1).Test_Id + 1;
            });
        });

        //find class_id
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM STUDENT_MASTER WHERE S_ID=(?)', [studentId], function (tx, results) {
                class_id = results.rows.item(0).CLASS_ID;

            });
        });

        //to insert data
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO Monthly_Test (Test_Id,S_Id,Class_Id,TEST_NO,Term,English,Hindi,LANGUAGE,EVS,MATHS,IT,Arabic) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [last, studentId, class_id, testno, term, eng, hin, lang, evs, math, it, ar]);
            class_id = "";
            sweetAlert("Success!", "Marks entered succesfully !", "success");
        });

        document.fmonthly.reset();
        document.getElementById('addMon').style.display = "none";
    } else if (value == 2) {

        if (firstTime == true) {
            console.log("first time running");
            //to find last marks_id
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM MARKS_DETAILS', [], function (tx, results) {
                    var len = results.rows.length;
                    mark_id = parseInt(results.rows.item(len - 1).MARK_ID);
                    mark_id++;
                    formRepeat = 0;
                    i = 0;
                    firstTime = false;
                });
            });
            
        }
        if (firstTime == false) {
            console.log("normal running");


            var process = document.getElementById('process').value;
            var portfolio = document.getElementById('portfolio').value;
            var ua = document.getElementById('ua').value;
            var ce = document.getElementById('ce').value;
            var te = document.getElementById('te').value;
            var studentId = document.getElementById('Tstudent_id').value;
            var term = document.getElementById('Tterm').value;

            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO MARKS_DETAILS (MARK_ID,PROCESS,PORTFOLIO,UA,CE,TE) VALUES (?,?,?,?,?,?)', [mark_id, process, portfolio, ua, ce, te]);
                mid[i] = mark_id;
                
                console.log("marks of ",i," inserted");
                console.log("i: ", i);
                i++;
                
            });
            
            
            formRepeat++;
            mark_id++;
            console.log("form re: ",formRepeat);
            console.log("mark id: ",mark_id);
            document.fterm.reset();
            document.getElementById('sub').innerHTML = subs[formRepeat];
            console.log("check formrepeat");
            if (formRepeat == 5) {
                
                //find class_id
                var class_id;
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM STUDENT_MASTER WHERE S_ID=(?)', [studentId], function (tx, results) {
                        class_id = results.rows.item(0).CLASS_ID;
                        console.log("class id: ",class_id);
                    });
                });

                db.transaction(function (tx) {
                    tx.executeSql('INSERT INTO MARKS (S_ID,TERM,CLASS_ID,ENGLISH,HINDI,LANGUAGE,EVS,MATHS) VALUES (?,?,?,?,?,?,?,?)', [studentId, term, class_id, mid[0], mid[1], mid[2], mid[3], mid[4]]);
                    i = 0;
                    class_id = "";
                    sweetAlert("Success!", "Marks entered succesfully !", "success"); 
                });
                document.getElementById('addTrm').style.display = "none";
                formRepeat = 0;

            }
        }

    }
}


function view(value) {

    if (value == "all") {
        document.getElementById('allDiv').style.display = "block";
        document.getElementById('oneDiv').style.display = "none";

    } else if (value == "one") {
        document.getElementById('oneDiv').style.display = "block";
        document.getElementById('allDiv').style.display = "none";
    }
}

function showOne() {
    var term = document.getElementById('termOne').value;
    var sid = document.getElementById('student_idM').value;
    document.getElementById('oneTable_Term').innerHTML = "";
    document.getElementById('oneTable_Mon').innerHTML = "";
    var Mcol = ['Test_Id', 'S_Id', 'Class_Id', 'TEST_NO', 'Term', 'English', 'Hindi', 'LANGUAGE', 'EVS', 'MATHS', 'IT', 'Arabic'];
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Monthly_Test WHERE Term=(?) AND S_Id=(?)', [term, sid], function (tx, results) {
            var tbl = document.getElementById('oneTable_Mon');
            tbl.setAttribute('class', 'table');
            var cap = tbl.createCaption();
            cap.innerHTML = "<b>Monthly Test</b>";
            var thead = tbl.createTHead();
            var tr = thead.insertRow();
            for (var j = 0; j < 12; j++) {
                var th = tr.insertCell();
                th.innerHTML = "<b>" + Mcol[j] + "</b>";
            }
            var tbdy = tbl.createTBody();
            for (var i = 0; i < results.rows.length; i++) {
                var tr = tbdy.insertRow();
                for (var j = 0; j < 12; j++) {
                    var td = tr.insertCell();
                    td.innerHTML = results.rows.item(i)[Mcol[j]];
                }
            }
        });
    });


    //CREATE TABLE
    getData1S();

}

function tableCreateS(data1_len, data2_len) {
    var Tcol = ['S_ID', 'TERM', 'CLASS_ID', 'ENGLISH', 'HINDI', 'LANGUAGE', 'EVS', 'MATHS'];
    var Tcol2 = ['PROCESS', 'PORTFOLIO', 'UA', 'CE', 'TE'];
    var Tcol3 = ['PR', 'PF', 'UA', 'CE', 'TE'];

    var tbl = document.getElementById('oneTable_Term');
    tbl.setAttribute('class', 'table');
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>Term Exam</b>";
    var thead = tbl.createTHead();
    var tr = thead.insertRow();
    for (var j = 0; j < 8; j++) {
        var th = tr.insertCell();
        if (j > 2)
            th.setAttribute('colspan', '5');
        th.innerHTML = "<b>" + Tcol[j] + "</b>";
    }
    var tbdy = tbl.createTBody();
    var tr = tbdy.insertRow();
    var td = tr.insertCell();
    td.setAttribute('colspan', '3');
    for (var j = 0; j < 5; j++) {
        for (i = 0; i < 5; i++) {
            var td = tr.insertCell();
            td.innerHTML = Tcol3[i];
        }
    }

    var j = 0,
        k = 0;
    for (var i = 0; i < data1_len; i++) {
        var tr = tbdy.insertRow();
        var td = tr.insertCell();
        td.innerHTML = data1[i][Tcol[j++]];
        var td = tr.insertCell();
        td.innerHTML = data1[i][Tcol[j++]];
        var td = tr.insertCell();
        td.innerHTML = data1[i][Tcol[j++]];
        for (var fiveSubs = 3; fiveSubs < 8; fiveSubs++) {
            for (k = 0; k < data2_len; k++) {
                if (data1[i][Tcol[fiveSubs]] == data2[k].MARK_ID) {
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].PROCESS;
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].PORTFOLIO;
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].UA;
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].CE;
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].TE;
                }
            }
        }

    }
}

function getData1S() {
    var data1_len;
    var term = document.getElementById('termOne').value;
    var sid = document.getElementById('student_idM').value;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM MARKS WHERE TERM=(?) AND S_ID=(?)', [term, sid], function (tx, results) {
            var len = results.rows.length,
                i;
            data1_len = len;
            for (i = 0; i < len; i++) {
                data1[i] = results.rows.item(i);
            }
            getData2S(data1_len);
        });
    });
}

function getData2S(data1_len) {
    var data2_len;

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM MARKS_DETAILS', [], function (tx, results) {
            var len = results.rows.length,
                i;
            data2_len = len;
            for (i = 0; i < len; i++) {
                data2[i] = results.rows.item(i);
            }
            tableCreateS(data1_len, data2_len);
        });

    });
}

function showAll() {
    var term = document.getElementById('termView').value;
    document.getElementById('allTable_Term').innerHTML = "";
    document.getElementById('allTable_Mon').innerHTML = "";
    var Mcol = ['Test_Id', 'S_Id', 'Class_Id', 'TEST_NO', 'Term', 'English', 'Hindi', 'LANGUAGE', 'EVS', 'MATHS', 'IT', 'Arabic'];
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Monthly_Test WHERE Term=(?)', [term], function (tx, results) {
            var tbl = document.getElementById('allTable_Mon');
            tbl.setAttribute('class', 'table');
            var cap = tbl.createCaption();
            cap.innerHTML = "<b>Monthly Test</b>";
            var thead = tbl.createTHead();
            var tr = thead.insertRow();
            for (var j = 0; j < 12; j++) {
                var th = tr.insertCell();
                th.innerHTML = "<b>" + Mcol[j] + "</b>";
            }
            var tbdy = tbl.createTBody();
            for (var i = 0; i < results.rows.length; i++) {
                var tr = tbdy.insertRow();
                for (var j = 0; j < 12; j++) {
                    var td = tr.insertCell();
                    td.innerHTML = results.rows.item(i)[Mcol[j]];
                }
            }
        });
    });


    //CREATE TABLE
    getData1();

}


function tableCreate(data1_len, data2_len) {
    var Tcol = ['S_ID', 'TERM', 'CLASS_ID', 'ENGLISH', 'HINDI', 'LANGUAGE', 'EVS', 'MATHS'];
    var Tcol2 = ['PROCESS', 'PORTFOLIO', 'UA', 'CE', 'TE'];
    var Tcol3 = ['PR', 'PF', 'UA', 'CE', 'TE'];
    var tbl = document.getElementById('allTable_Term');
    tbl.setAttribute('class', 'table');
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>Term Exam</b>";
    var thead = tbl.createTHead();
    var tr = thead.insertRow();
    for (var j = 0; j < 8; j++) {
        var th = tr.insertCell();
        if (j > 2)
            th.setAttribute('colspan', '5');
        th.innerHTML = "<b>" + Tcol[j] + "</b>";
    }
    var tbdy = tbl.createTBody();
    var tr = tbdy.insertRow();
    var td = tr.insertCell();
    td.setAttribute('colspan', '3');
    for (var j = 0; j < 5; j++) {
        for (i = 0; i < 5; i++) {
            var td = tr.insertCell();
            td.innerHTML = Tcol3[i];
        }
    }
    var j = 0,
        k = 0;
    for (var i = 0; i < data1_len; i++) {
        var tr = tbdy.insertRow();
        var td = tr.insertCell();
        td.innerHTML = data1[i][Tcol[0]];
        var td = tr.insertCell();
        td.innerHTML = data1[i][Tcol[1]];
        var td = tr.insertCell();
        td.innerHTML = data1[i][Tcol[2]];
        for (var fiveSubs = 3; fiveSubs < 8; fiveSubs++) {
            for (k = 0; k < data2_len; k++) {
                if (data1[i][Tcol[fiveSubs]] == data2[k].MARK_ID) {
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].PROCESS;
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].PORTFOLIO;
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].UA;
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].CE;
                    var td = tr.insertCell();
                    td.innerHTML = data2[k].TE;
                }
            }
        }

    }
}

function getData1() {
    var data1_len;
    var term = document.getElementById('termView').value;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM MARKS WHERE TERM=(?)', [term], function (tx, results) {
            var len = results.rows.length,
                i;
            data1_len = len;
            for (i = 0; i < len; i++) {
                data1[i] = results.rows.item(i);
            }
            getData2(data1_len);
        });
    });
}

function getData2(data1_len) {
    var data2_len;

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM MARKS_DETAILS', [], function (tx, results) {
            var len = results.rows.length,
                i;
            data2_len = len;
            for (i = 0; i < len; i++) {
                data2[i] = results.rows.item(i);
            }
            tableCreate(data1_len, data2_len);
        });

    });
}
