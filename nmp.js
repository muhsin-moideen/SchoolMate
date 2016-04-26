var db = openDatabase('schoolMateDB', '1.0', 'SchoolMate Database', 100 * 1024 * 1024);

function loadfunc() {
    document.getElementById('userName').innerHTML = localStorage.staffName;
}

function menu(value) {
    resetThis();
    switch (value) {
        case "DA":
            document.getElementById("DAttn").style.display = "block";
            break;

        case "DEX":
            document.getElementById("DExp").style.display = "block";

            break;
        case "RR":
            document.getElementById("RReceipt").style.display = "block";
            break;
        case "ST":
            updatStock();
            break;
        case "editDEX":
            document.getElementById("EExp").style.display = "block";
            break;
        case "viewDEX":
            document.getElementById("VExp").style.display = "block";
            break;
        case "viewAT":
            document.getElementById("VAttn").style.display = "block";
            break;
        case "viewST":
            document.getElementById("VStk").style.display = "block";
            viewStk();
            break;
    }
}

function resetThis() {
    document.getElementById('DAttn').style.display = "none";
    document.getElementById('DExp').style.display = "none";
    document.getElementById('RReceipt').style.display = "none";
    document.getElementById('EExp').style.display = "none";
    document.getElementById('VExp').style.display = "none";
    document.getElementById('VAttn').style.display = "none";
    document.getElementById('VStk').style.display = "none";
    document.Dattend.reset();
    document.addExp.reset();
    document.riceR.reset();
    document.editExp.reset();
    document.viewExp.reset();
    document.viewAtn.reset();
    document.viewStk.reset();
}

function addAttn1() {
    var flag = true;
    // to find class id
    var formVar = document.getElementById('Dattend');
    var input = formVar.getElementsByTagName('input');
    for (var i = 0; i < input.length; i++) {
        if (input[i].value == "" || isNaN(input[i].value) == true) {
            flag = false;
            sweetAlert("Oops...", "Please fill all fields with numbers only !", "error");
        }
    }
    if (flag) {
        var date;
        var class1 = document.getElementById('classA').value;
        var section = document.getElementById('section').value;
        var boys = document.getElementById('boys').value;
        var girls = document.getElementById('girls').value;
        var class_id;
        //get class id
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Class WHERE class=(?) AND section=(?)', [class1, section], function (tx, results) {
                class_id = results.rows.item(0).Class_Id;
                addAttn2(class_id, boys, girls);
            });
        });
    }

}

function addAttn2(class_id, boys, girls) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yy = today.getFullYear();
    var newDate = dd + '/' + mm + '/' + yy;
    var atnflag = false;

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM attendance ', [], function (tx, results) {
            var len = results.rows.length;
            for (var z = 0; z < len; z++) {
                if (results.rows.item(z).Date == newDate && results.rows.item(z).Class_Id == class_id) {
                    atnflag = true;
                    sweetAlert("Oops...", "Attendance for this class has been already entered for today !! !", "error");
                    break;
                }
            }
            if (atnflag == false) {
                addAttn3(newDate, class_id, boys, girls)
            }

        });
    });
}

function addAttn3(newDate, class_id, boys, girls) {
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO attendance (Date,Class_Id,B,G) VALUES (?,?,?,?)', [newDate, class_id, boys, girls]);
        swal("Done!", "Record has Been Added!", "success");
        document.getElementById('DAttn').style.display = "none";
        document.Dattend.reset();
    });
}

function addExp1() {

    var flag = true;
    var newDate;

    console.log("expDate: ", localStorage.expDate);
    if (localStorage.expDate != "null") {
        console.log("expDate not null");
        var newDate = localStorage.expDate;
    } else {
        console.log("expDate null");
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yy = today.getFullYear();
        newDate = dd + '/' + mm + '/' + yy;
    }
    console.log("check flag");
    var formVar = document.getElementById('addExp');
    var input = formVar.getElementsByTagName('input');
    for (var i = 0; i < input.length; i++) {
        if (input[i].value == "" || isNaN(input[i].value) == true || input[i].value < 1) {
            flag = false;
            sweetAlert("Oops...", "Please fill all fields with numbers only !", "error");
            break;
        }
    }
    console.log("flag: ", flag);
    if (flag) {
        var condiments = parseInt(document.getElementById('condiments').value);
        var fuel = parseInt(document.getElementById('fuel').value);
        var transport = parseInt(document.getElementById('transport').value);
        var egg = parseInt(document.getElementById('egg').value);
        var milk = parseInt(document.getElementById('milk').value);
        var other = parseInt(document.getElementById('other').value);

        var total = condiments + fuel + transport + egg + milk + other;
        console.log("total: ", total);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO EXPENDITURE (EXPDATE,CONDIMENTS,FUEL,TRANSPORT,EGG,MILK,OTHER,TOTAL) VALUES (?,?,?,?,?,?,?,?)', [newDate, condiments, fuel, transport, egg, milk, other, total]);
            swal("Done!", "Record has Been Added!", "success");
        });
        document.getElementById('DExp').style.display = "none";
        localStorage.expDate = null;
        document.addExp.reset();
    }

}

function editExp1() {
    var flag = true;
    var dat = document.getElementById('editExpDate').value;

    var d = dat;
    var m = d.substring(d.indexOf("/") + 1, d.lastIndexOf("/"));
    var dt = d.substring(0, d.indexOf("/"));
    var y = d.substring(d.lastIndexOf("/") + 1, d.length);
    var today = new Date;
    var year = today.getFullYear();
    var dated = today.getDate();
    var mon = today.getMonth() + 1;

    m = parseInt(m);
    dt = parseInt(dt);
    y = parseInt(y);
    if ((isNaN(dt) == true) || (isNaN(m) == true) || (isNaN(y) == true)) {
        sweetAlert("Oops...", "Please Enter a valid date (eg: 1/12/2016) !", "error");
        flag = false;
    }

    if ((y > year) || (dt > 31) || (m > 12) || ((m == 2) && (dt > 29)) || (y < 1970) || (y == year && m > mon) || (y == year && m <= mon && dt > dated)) {
        sweetAlert("Oops...", "Please Enter a valid date (eg: 1/12/2016) !", "error");
        flag = false;

    }
    console.log("flag: ", flag);
    if (flag) {
        document.getElementById('DExp').style.display = "block";
        document.getElementById('EExp').style.display = "none";
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM EXPENDITURE WHERE EXPDATE=(?) ', [dat], function (tx, results) {
                document.getElementById('condiments').value = results.rows.item(0).CONDIMENTS;
                document.getElementById('fuel').value = results.rows.item(0).FUEL;
                document.getElementById('transport').value = results.rows.item(0).TRANSPORT;
                document.getElementById('egg').value = results.rows.item(0).EGG;
                document.getElementById('milk').value = results.rows.item(0).MILK;
                document.getElementById('other').value = results.rows.item(0).OTHER;

                var d = document.getElementById('condiments').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('fuel').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('transport').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('egg').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('milk').parentNode;
                d.className += ' input--filled';
                var d = document.getElementById('other').parentNode;
                d.className += ' input--filled';

            });
        });
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM EXPENDITURE WHERE EXPDATE=(?)', [dat]);
            localStorage.expDate = dat;
        });
        doc.getElementById('EExp').style.display = "none";
        document.editExp.reset();
    }

}

function viewExp1() {
    var dateData = {};
    var mon = document.getElementById('monExp').value;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM EXPENDITURE', [], function (tx, results) {
            var len = results.rows.length,
                i, dataLen = 0;
            for (i = 0; i < len; i++) {
                if (processDate(results.rows.item(i).ExpDate, mon) == true) {
                    dateData[dataLen++] = results.rows.item(i);
                }
            }
            drawExpTable(dateData, dataLen);
        });
    });
}

function processDate(d, m) {
    if (d.substring(d.indexOf("/") + 1, d.lastIndexOf("/")) == m) {
        return true;
    } else {
        return false;
    }
}

function drawExpTable(dateData, len) {
    document.getElementById('viewExpTable').innerHTML = "";
    var col = ['Date', 'CONDIMENTS', 'FUEL', 'EGG', 'MILK', 'OTHER', 'TOTAL'];
    var tbl = document.getElementById('viewExpTable');
    tbl.setAttribute('class', 'table');
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>Expenditure Details</b>";
    var thead = tbl.createTHead();
    var tr = thead.insertRow();
    for (var j = 0; j < 7; j++) {
        var th = tr.insertCell();
        th.innerHTML = "<b>" + col[j] + "</b>";
    }
    var tbdy = tbl.createTBody();
    for (var i = 0; i < len; i++) {
        var tr = tbdy.insertRow();
        var td = tr.insertCell();
        td.innerHTML = dateData[i].ExpDate;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].CONDIMENTS;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].FUEL;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].EGG;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].MILK;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].OTHER;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].TOTAL;
    }
}

function addRiceRec() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yy = today.getFullYear();
    var newDate = dd + '/' + mm + '/' + yy;
    var stock;
    if (document.getElementById('riceQ').value == "" || isNaN(document.getElementById('riceQ').value) == true) {
        sweetAlert("Oops...", "Please Enter a valid value!", "error");
    } else {
        var rQty = parseInt(document.getElementById('riceQ').value);


        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO Rice_Reciepts (Date,qty) VALUES (?,?)', [newDate, rQty]);
        });
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Stock ', [], function (tx, results) {
                var len = results.rows.length,
                    i;
                stock = parseInt(results.rows.item(len - 1).Rice_Remaining);
                addRiceRec2(newDate, rQty + stock);
            });
        });
    }

}

function addRiceRec2(newDate, newstock) {
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO Stock (Date,Total_S,Rice_Remaining) VALUES (?,?,?)', [newDate, 0, newstock]);
        swal("Done!", "Stock has Been updated!", "success");
    });
}

function updatStock() {
    var classData = {};
    var attenData = {};
    var len, data_len;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Class ', [], function (tx, results) {
            var i;
            len = results.rows.length;
            for (i = 0; i < len; i++) {
                classData[i] = results.rows.item(i);
            }
        });
    });
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM attendance ', [], function (tx, results) {
            var len1 = results.rows.length,
                j;
            data_len = 0;
            for (j = 0; j < len1; j++) {
                if (processMonth(results.rows.item(j).Date) == true)
                    attenData[data_len++] = results.rows.item(j);
            }
            updatStock2(classData, attenData, len, data_len);
        });
    });
}

function updatStock2(classData, attenData, len, data_len) {
    var flag;
    var bigFlag = true;
    for (var i = 0; i < len; i++) {
        flag = false;
        for (var j = 0; j < data_len; j++) {
            if (classData[i].Class_Id == attenData[j].Class_Id) {
                flag = true;
            }
        }
        if (flag == false) {
            sweetAlert("Oops...", "Class: " + classData[i].class + " Section: " + classData[i].section + " data for today has not been entered!!", "error");
            bigFlag = false;
        }
    }
    updatStock3(attenData, data_len, bigFlag);
}

function updatStock3(attenData, data_len, bigFlag) {

    var boys = 0,
        girls = 0,
        total = 0;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yy = today.getFullYear();
    var newDate = dd + '/' + mm + '/' + yy;
    if (bigFlag) {
        for (var i = 0; i < data_len; i++) {
            boys += attenData[i].B;
            girls += attenData[i].G;
        }
        total = boys + girls;
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Stock ', [], function (tx, results) {
                var len = results.rows.length;
                stock = parseInt(results.rows.item(len - 1).Rice_Remaining);
                console.log("total s: ", results.rows.item(len - 1).Total_S);
                console.log("date: ", results.rows.item(len - 1).Date);
                console.log("results.rows.item(len - 1).Date: ", results.rows.item(len - 1).Date);
                console.log("results.rows.item(len - 1).Total_S: ", results.rows.item(len - 1).Total_S);
                console.log("newDate: ", newDate);
                if (results.rows.item(len - 1).Date == newDate) {
                    if (results.rows.item(len - 1).Total_S == 0) {
                        if (results.rows.item(len - 2).Date != newDate)
                            updatStock4(boys, girls, stock, newDate);
                        else
                            sweetAlert("Oops...", "Stock has been Already Updated !!", "error");
                    } else
                        sweetAlert("Oops...", "Stock has been Already Updated !!", "error");
                } else
                    updatStock4(boys, girls, stock, newDate);

            });
        });

    } else {

    }
}

function updatStock4(boys, girls, stock, newDate) {


    var total = boys + girls;
    var utilized = total / 10;
    var remaining = stock - utilized;

    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO Stock (Date,Total_B,Total_G,Total_S,Rice_Utilized,Rice_Remaining) VALUES (?,?,?,?,?,?)', [newDate, boys, girls, total, utilized, remaining]);
        swal({
            title: "Done!",
            text: "Stock Updated Suucessfully!",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Show Remaining Stock?",
            closeOnConfirm: false
        }, function () {
            if (remaining < 250) {
                swal("Oh NO !", "Remaining Stock: " + remaining, "error");
            } else {
                swal("Hey !", "Remaining Stock: " + remaining, "success");
            }

        });
    });


}

function processMonth(adate) {
    var today = new Date();
    var d = today.getDate();
    if (adate.substring(0, adate.indexOf("/")) == d) {
        return true;
    } else {
        return false;
    }
}

function viewAttn() {
    var AtnData = {};
    var AdataLen = 0;
    var mon = document.getElementById('monAtn').value;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM attendance', [], function (tx, results) {
            var len = results.rows.length,
                i, dataLen = 0;
            for (i = 0; i < len; i++) {
                if (processDate(results.rows.item(i).Date, mon) == true) {
                    AtnData[AdataLen++] = results.rows.item(i);
                }
            }
            drawAtnTable(AtnData, AdataLen);
        });
    });
}


function drawAtnTable(dateData, len) {
    document.getElementById('viewAtnTable').innerHTML = "";
    var col = ['Date', 'Class_Id', 'B', 'G'];
    var tbl = document.getElementById('viewAtnTable');
    tbl.setAttribute('class', 'table');
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>Attendance Details</b>";
    var thead = tbl.createTHead();
    var tr = thead.insertRow();
    for (var j = 0; j < 4; j++) {
        var th = tr.insertCell();
        th.innerHTML = "<b>" + col[j] + "</b>";
    }
    var tbdy = tbl.createTBody();
    for (var i = 0; i < len; i++) {
        var tr = tbdy.insertRow();
        var td = tr.insertCell();
        td.innerHTML = dateData[i].Date;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].Class_Id;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].B;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].G;

    }
}

function viewStok() {
    var StkData = {};
    var SdataLen = 0;
    var mon = document.getElementById('monStk').value;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Stock', [], function (tx, results) {
            var len = results.rows.length,
                i, dataLen = 0;
            for (i = 0; i < len; i++) {
                if (processDate(results.rows.item(i).Date, mon) == true) {
                    StkData[SdataLen++] = results.rows.item(i);
                }
            }
            drawStkTable(StkData, SdataLen);
        });
    });
}


function drawStkTable(dateData, len) {
    document.getElementById('stockTable').innerHTML = "";
    var col = ['Date', 'Total_B', 'Total_G', 'Total_S', 'Rice_Utilized', 'Rice_Remaining'];
    var tbl = document.getElementById('stockTable');
    tbl.setAttribute('class', 'table');
    var cap = tbl.createCaption();
    cap.innerHTML = "<b>Stock Details</b>";
    var thead = tbl.createTHead();
    var tr = thead.insertRow();
    for (var j = 0; j < 6; j++) {
        var th = tr.insertCell();
        th.innerHTML = "<b>" + col[j] + "</b>";
    }
    var tbdy = tbl.createTBody();
    for (var i = 0; i < len; i++) {
        var tr = tbdy.insertRow();
        var td = tr.insertCell();
        td.innerHTML = dateData[i].Date;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].Total_B;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].Total_G;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].Total_S;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].Rice_Utilized;
        var td = tr.insertCell();
        td.innerHTML = dateData[i].Rice_Remaining;

    }
}
