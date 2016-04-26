var db = openDatabase('schoolMateDB', '1.0', 'SchoolMate Database', 100 * 1024 * 1024);
var lineChartData = {};
var piedata = {};

function loadFunc() {
    var staffName;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM LOGIN WHERE STAFF_ID=(?)', [localStorage.staffid], function (tx, results) {
            staffName = results.rows.item(0).UNAME;
            document.getElementById('userName').innerHTML = staffName;
            localStorage.staffName = staffName;
            loadGraph();
            loadPieGraph();
        });
    });
}

function loadPieGraph() {
    var piedata = {};
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Stock ', [], function (tx, results) {
            var len = results.rows.length,
                i;
            piedata[0] = results.rows.item(len - 1);
            piedata[1] = results.rows.item(len - 2);

            processPieData(piedata);
        });
    });
}

function processPieData(piedata) {
    var used, rem;
    rem = piedata[0].Rice_Remaining;
    used = piedata[0].Rice_Utilized;
    if (used == null)
        used = piedata[1].Rice_Utilized;
    piedata = [
        {
            value: used,
            color: "#C62828"
	},
        {
            value: rem,
            color: "#1976D2"
	}
]
    var pie = document.getElementById("canvasStock").getContext("2d")
    new Chart(pie).Pie(piedata, options);
}


function loadGraph() {
    var classData = {};
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Class ', [], function (tx, results) {
            var len = results.rows.length,
                i;
            for (i = 0; i < len; i++) {
                classData[i] = results.rows.item(i);
            }
            loadGraph2(classData, len);
        });
    });

}

function loadGraph2(classData, len) {
    var monthlyData = {};
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Monthly_Test ', [], function (tx, results) {
            var len1 = results.rows.length,
                i;
            for (i = 0; i < len1; i++) {
                monthlyData[i] = results.rows.item(i);
            }
            processMarksGraph(classData, len, monthlyData, len1);
        });
    });
}

function processMarksGraph(classData, len, monthlyData, len1) {
    var sum = [];
    var classStrength=[];
    for (var i = 0; i < len; i++) {
        sum[i] = 0;
        classStrength[i]=0;
        for (var j = 0; j < len1; j++) {
            if (classData[i].Class_Id == monthlyData[j].Class_Id) {
                classStrength[i]+=1;
                sum[i] += parseInt(monthlyData[j].English + monthlyData[j].Hindi + monthlyData[j].LANGUAGE + monthlyData[j].EVS + monthlyData[j].MATHS) / 5;
            }
        }
    }
    lineChartData = {
        labels: [classData[0].class + " " + classData[0].section,
             classData[1].class + " " + classData[1].section,
            classData[2].class + " " + classData[2].section,
            classData[3].class + " " + classData[3].section,
            classData[4].class + " " + classData[4].section,
            classData[5].class + " " + classData[5].section,
            classData[6].class + " " + classData[6].section,
            classData[7].class + " " + classData[7].section, ],
        datasets: [
            {
                fillColor: "#1f7f5c",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                label: "#1f7f5c",
                scaleLineColor: "white",
                scaleFontSize: 14,
                scaleShowGridLines: false,
                data: [sum[0] / classStrength[0], sum[1] / classStrength[1], sum[2] / classStrength[2], sum[3] / classStrength[3], sum[4] / classStrength[4], sum[5] / classStrength[5], sum[6] / classStrength[6], sum[7] / classStrength[7]]
    }
  ]

    }
    var ctx = document.getElementById("canvasPerformance").getContext("2d")
    new Chart(ctx).Line(lineChartData, options);
}

function getDetails() {
    var details = [];
    var col = ['S_ID', 'NAME', 'CLASS_ID', 'MOTHER_NAME', 'FATHER_NAME', 'ADDRESS', 'RELIGION', 'CONTACT', 'DOB'];

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM STUDENT_MASTER WHERE S_ID=(?)', [localStorage.search], function (tx, results) {
            for (var i = 0; i < 9; i++) {
                details[i] = results.rows.item(0)[col[i]];
            }
            getDetails2(details);
        });
    });
}

function getMonthly() {
    document.getElementById('sMonthly').innerHTML = "";
    var monthly = [];
    var col = ['TEST_NO', 'Term', 'English', 'Hindi', 'LANGUAGE', 'EVS', 'MATHS', 'IT', 'Arabic'];

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Monthly_Test WHERE S_ID=(?)', [localStorage.search], function (tx, results) {
            var len = results.rows.length;
            for (var j = 0; j < len; j++) {
                monthly[j] = new Array(9);
            }
            for (var j = 0; j < len; j++) {
                for (var i = 0; i < 9; i++) {
                    monthly[j][i] = results.rows.item(j)[col[i]];
                }
            }
            getMonthly2(monthly, len);
        });
    });
}

function getMonthly2(monthly, len) {
    var col = ['TEST NO', 'Term', 'English', 'Hindi', 'LANGUAGE', 'EVS', 'MATHS', 'IT', 'Arabic'];
    var tbl = document.getElementById('sMonthly');
    tbl.setAttribute('class', 'table')
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>Monthly Test</b>";
    var tbdy = tbl.createTBody();

    var tr = tbdy.insertRow();
    for (var j = 0; j < 9; j++) {
        var th = tr.insertCell();
        th.innerHTML = "<b>" + col[j] + "</b>";
    }
    for (var j = 0; j < len; j++) {
        var tr = tbdy.insertRow();
        for (i = 0; i < 9; i++) {
            var td = tr.insertCell();
            td.innerHTML = monthly[j][i];
        }
    }
}

function getDetails2(details) {
    document.getElementById('sComplete').innerHTML = "";
    var col = ['Student ID', 'NAME', 'CLASS ID', 'MOTHER NAME', 'FATHER NAME', 'ADDRESS', 'RELIGION', 'CONTACT', 'DOB'];

    var tbl = document.getElementById('sComplete');
    tbl.setAttribute('class', 'infotable');
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>Student Information</b>";
    var tbdy = tbl.createTBody();


    for (var j = 0; j < 9; j++) {
        var tr = tbdy.insertRow();
        var th = tr.insertCell();
        th.innerHTML = "<b>" + col[j] + "</b>";
        var th = tr.insertCell();
        th.innerHTML = details[j];
    }

}

function studInfo() {
    if (document.getElementById('search_text').value == "")
        sweetAlert("Oops...", "Please Enter Student name or Student ID !", "error");
    else {
        document.getElementById('column2').style.display = "none";
        document.getElementById('studComplete').style.display = "block";
        localStorage.search = "";
        var text = document.getElementById('search_text').value;
        var flag = false;
        if (isNaN(text) == false) {} else {
            text = text.toUpperCase();
        }
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM STUDENT_MASTER ', [], function (tx, results) {
                var len = results.rows.length,
                    i;
                for (i = 0; i < len; i++) {
                    var temp = results.rows.item(i).NAME;
                    temp = temp.toUpperCase();
                    if (results.rows.item(i).S_ID == text || temp == text) {
                        localStorage.search = results.rows.item(i).S_ID;
                        flag = true;
                        break;
                    }
                }
                if (flag == false)
                    sweetAlert("Oops...", "Student not found !!", "error");
                else {
                    studInfo2();
                    getDetails();
                    getMonthly();
                }
            });
        });
    }
}

function studInfo2() {
    document.getElementById('sMarks').innerHTML = "";
    var dataInfo = {};
    var dataMarkMain = [{}];

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM STUDENT_MASTER WHERE S_ID=(?)', [localStorage.search], function (tx, results) {
            dataInfo = results.rows.item(0);

        });
    });
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM MARKS WHERE S_ID=(?)', [localStorage.search], function (tx, results) {
            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                dataMarkMain[i] = results.rows.item(i);
            }

            studInfo3(dataInfo, dataMarkMain, len);
        });
    });
}

function studInfo3(dataInfo, dataMarkMain, len) {
    var dataMarks = {};
    var mlen;

    var Tcol = ['S_ID', 'TERM', 'CLASS_ID', 'ENGLISH', 'HINDI', 'LANGUAGE', 'EVS', 'MATHS'];

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM MARKS_DETAILS', [], function (tx, results) {
            var len1 = results.rows.length;
            for (var i = 0; i < len1; i++) {
                dataMarks[i] = results.rows.item(i);
            }
            mlen = len1;
            processTermData(dataInfo, dataMarkMain, len, dataMarks, mlen);
        });

    });
}

function processTermData(dataInfo, dataMarkMain, len, dataMarks, mlen) {
    var finalData = [];
    var k;
    for (var x = 0; x < len; x++) {
        finalData[x] = new Array(6);
    }
    var finalDataLen = 0;
    var Tcol2 = ['PROCESS', 'PORTFOLIO', 'UA', 'CE', 'TE'];
    for (var i = 0; i < len; i++) {
        k = 1;
        for (var j = 0; j < mlen; j++) {
            if (dataMarkMain[i].ENGLISH == dataMarks[j].MARK_ID) {
                finalData[finalDataLen][k++] = dataMarks[j].PROCESS;
                finalData[finalDataLen][k++] = dataMarks[j].PORTFOLIO;
                finalData[finalDataLen][k++] = dataMarks[j].UA;
                finalData[finalDataLen][k++] = dataMarks[j].CE;
                finalData[finalDataLen][k++] = dataMarks[j].TE;
            }
        }
        for (var j = 0; j < mlen; j++) {
            if (dataMarkMain[i].HINDI == dataMarks[j].MARK_ID) {
                finalData[finalDataLen][k++] = dataMarks[j].PROCESS;
                finalData[finalDataLen][k++] = dataMarks[j].PORTFOLIO;
                finalData[finalDataLen][k++] = dataMarks[j].UA;
                finalData[finalDataLen][k++] = dataMarks[j].CE;
                finalData[finalDataLen][k++] = dataMarks[j].TE;
            }
        }
        for (var j = 0; j < mlen; j++) {
            if (dataMarkMain[i].LANGUAGE == dataMarks[j].MARK_ID) {
                finalData[finalDataLen][k++] = dataMarks[j].PROCESS;
                finalData[finalDataLen][k++] = dataMarks[j].PORTFOLIO;
                finalData[finalDataLen][k++] = dataMarks[j].UA;
                finalData[finalDataLen][k++] = dataMarks[j].CE;
                finalData[finalDataLen][k++] = dataMarks[j].TE;
            }
        }
        for (var j = 0; j < mlen; j++) {
            if (dataMarkMain[i].EVS == dataMarks[j].MARK_ID) {
                finalData[finalDataLen][k++] = dataMarks[j].PROCESS;
                finalData[finalDataLen][k++] = dataMarks[j].PORTFOLIO;
                finalData[finalDataLen][k++] = dataMarks[j].UA;
                finalData[finalDataLen][k++] = dataMarks[j].CE;
                finalData[finalDataLen][k++] = dataMarks[j].TE;
            }
        }
        for (var j = 0; j < mlen; j++) {
            if (dataMarkMain[i].MATHS == dataMarks[j].MARK_ID) {
                finalData[finalDataLen][k++] = dataMarks[j].PROCESS;
                finalData[finalDataLen][k++] = dataMarks[j].PORTFOLIO;
                finalData[finalDataLen][k++] = dataMarks[j].UA;
                finalData[finalDataLen][k++] = dataMarks[j].CE;
                finalData[finalDataLen][k++] = dataMarks[j].TE;
            }
        }
        finalData[finalDataLen][0] = dataMarkMain[i].TERM;

        finalDataLen++;
    }

    studInfo4(finalData, finalDataLen, k);
}

function studInfo4(finalData, finalDataLen, len) {


    var Tcol = ['TERM', 'ENGLISH', 'HINDI', 'LANGUAGE', 'EVS', 'MATHS'];
    var Tcol3 = ['PR', 'PF', 'UA', 'CE', 'TE'];

    var tbl = document.getElementById('sMarks');
    tbl.setAttribute('class', 'table');
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>Final Marks</b>";
    var thead = tbl.createTHead();
    var tr = thead.insertRow();


    for (var j = 0; j < 6; j++) {
        var th = tr.insertCell();
        if (j > 0)
            th.setAttribute('colspan', '5');
        th.innerHTML = "<b>" + Tcol[j] + "</b>";
        var th = tr.insertCell();
    }
    var tbdy = tbl.createTBody();
    var tr = tbdy.insertRow();
    var td = tr.insertCell();
    var td = tr.insertCell();
    for (var j = 0; j < 5; j++) {
        for (i = 0; i < 5; i++) {
            var td = tr.insertCell();
            td.innerHTML = Tcol3[i];
        }
        var td = tr.insertCell();
        td.innerHTML = "|";
    }
    //make loop here

    for (var j = 0; j < finalDataLen; j++) {
        var tr = tbdy.insertRow();
        var td = tr.insertCell();
        td.innerHTML = finalData[j][0];
        var td = tr.insertCell();
        for (var k = 1; k < 26;) {
            var td = tr.insertCell();
            td.innerHTML = finalData[j][k++];
            var td = tr.insertCell();
            td.innerHTML = finalData[j][k++];
            var td = tr.insertCell();
            td.innerHTML = finalData[j][k++];
            var td = tr.insertCell();
            td.innerHTML = finalData[j][k++];
            var td = tr.insertCell();
            td.innerHTML = finalData[j][k++];
            var td = tr.insertCell();
            td.innerHTML = "|";

        }
    }
}

function resetSt() {
    document.getElementById('sMarks').innerHTML = "";
    document.getElementById('column2').style.display = "block";
    document.getElementById('sComplete').innerHTML = "";
    document.getElementById('sMonthly').innerHTML = "";
    document.getElementById('search_text').value = "";
    document.getElementById('studComplete').style.display = "none";
}
