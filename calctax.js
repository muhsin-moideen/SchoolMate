// JavaScript Document
var db = openDatabase('schoolMateDB', '1.0', 'SchoolMate Database', 100 * 1024 * 1024);
function calctax()
{
    var formVar = document.getElementById('taxCal');
    var input = formVar.getElementsByTagName('input');
    var flag = true;
    for (var i = 0; i < input.length; i++) {
        if(input[i].value==""){
            sweetAlert("Oops...", "Please fill all fields !", "error");
            flag = false;
            break;
        }
        if(isNaN(input[i].value)==true && i!=1){
            sweetAlert("Oops...", "Please enter valid values !", "error");
            flag = false;
            break;
        }
    }
    
    if(flag){
       var staffid=document.taxCal.staffId.value;
	var dat=document.taxCal.date.value;
	var basicpay =parseInt( document.taxCal.bas.value);
    var hraval = parseInt(document.taxCal.hra.value);
	var daper = parseInt(document.taxCal.da.value);
	var da=basicpay*daper;
  var all1 = parseInt(document.taxCal.other1.value);
  var all2 = parseInt(document.taxCal.other2.value);
  var all3 = parseInt(document.taxCal.other3.value);
  var pfval = parseInt(document.taxCal.pf.value);
  var licval = parseInt(document.taxCal.lic.value);
  var gpaisval = parseInt(document.taxCal.gpais.value);
  var slival = parseInt(document.taxCal.sli.value);
  var gival = parseInt(document.taxCal.gi.value);
  var ded1val= parseInt(document.taxCal.other.value);
   var income = parseInt(document.taxCal.incometax.value);
  var other= parseInt(document.taxCal.other.value);
if(all1=="")
{
	all1=0;
	all2=0;
	all3=0;
}
if(all2=="")
{
	
	all2=0;
	all3=0;
}
if(all3=="")
{

	all3=0;
}

  var grossval=basicpay+da+hraval+all1+all2+all3;
    var d=document.getElementById('gross').parentNode;
    d.className+=' input--filled';
  var netval=grossval-(pfval+licval+gpaisval+slival+gival+ded1val);
    var d=document.getElementById('net').parentNode;
    d.className+=' input--filled';
  
  
 document.getElementById('gross').value= grossval;
 document.getElementById('net').value=netval;
 db.transaction(function (tx) {
        tx.executeSql('INSERT INTO Tax (Staff_Id,Basic,date,Da,Hra,Allowance1,Allowance2,Allowance3,Pf,Sli,Gi,Gpais,Lic,Incometax,Other,Gross,Net) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [staffid,basicpay,dat, da, hraval, all1, all2, all3, pfval,slival,gival,gpaisval,licval,income,other,grossval,netval]);
    swal("Success !!", "Record Inserted Successfully !!", "success");
    }); 
    }
	
  
}
	