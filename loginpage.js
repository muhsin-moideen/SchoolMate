  var db = openDatabase('schoolMateDB', '1.0', 'SchoolMate Database', 100 * 1024 * 1024);


function login(access,staffid) {
  localStorage.access=access;
  localStorage.staffid=staffid;
  if(access=="ADMIN"){
  window.open('adminHome.html','_self');
  }else {
  window.open('Home.html','_self');
  }
}
function verify() {
  var flag=false;
    if(document.loginform.loginusername.value=="" || document.loginform.loginpassword.value=="")
       sweetAlert("Oops...", "Please Enter Username And Password!", "error"); 
    else{
      var username = document.loginform.loginusername.value;
  var password = document.loginform.loginpassword.value;

  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM LOGIN',[],function(tx,results){
      var len=results.rows.length, i;
      for(i=0;i<len;i++){
        if(results.rows.item(i).UNAME==username && results.rows.item(i).PASS == password){
                    flag=true;
    
            login(results.rows.item(i).ACCESS,results.rows.item(i).STAFF_ID);
        }
      }
      if(!flag){
      sweetAlert("Oops...", "Invalid username or password!", "error");
      document.loginform.reset();
    }
    });
  });  
    }
  
}

function forgot(){
    if(document.forgotform.adminUsername.value=="" || document.forgotform.adminPassword.value=="" ||document.forgotform.loginusername.value=="" || document.forgotform.loginpassword.value=="" ||document.forgotform.loginConfirm.value=="")
        sweetAlert("Oops...", "Please fill all fields !", "error"); 
    else{
      var Auname = document.forgotform.adminUsername.value;
    var Apass = document.forgotform.adminPassword.value;
    var Suname = document.forgotform.loginusername.value;
    var Spass = document.forgotform.loginpassword.value;
    var SpassC = document.forgotform.loginConfirm.value;

    if(Spass!=SpassC){
        sweetAlert("Oops...", "Passwords does not match!!", "error");
        document.forgotform.reset();

    }else{
        checkAdmin(Auname,Apass,Suname,Spass);
    }  
    }
    
}

function checkAdmin(Auname,Apass,Suname,Spass){
    db.transaction(function(tx){
        var access="ADMIN";
    tx.executeSql('SELECT * FROM LOGIN WHERE ACCESS=(?)',[access],function(tx,results){
      var len=results.rows.length, i;
      for(i=0;i<len;i++){
        if(results.rows.item(i).UNAME==Auname && results.rows.item(i).PASS == Apass){
            flag=true; 
            sweetAlert({   title: "Are you sure?",   text: "Your Password will be changed!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, change it!",   closeOnConfirm: false }, function(){  changePass(Suname,Spass);   });
           
        }
      }
      if(!flag){
        sweetAlert("Oops...", "Invalid Admin username or password!!", "error");
      document.forgotform.reset();
    }
    });
  });
}

function changePass(Suname,Spass){
    
    db.transaction(function(tx){
    tx.executeSql('UPDATE LOGIN SET PASS=(?) WHERE UNAME=(?)',[Spass,Suname]);
    sweetAlert("Awesome!", "password change succesfull!", "success");
        window.open('loginPage.html','_self');
  });
}

function updatePass(){
    if(document.changeform.loginusername.value=="" || document.changeform.loginpassword.value=="" ||document.changeform.Npassword1.value=="" || document.changeform.Npassword1.value=="")
        sweetAlert("Oops...", "Please fill all fields !", "error"); 
    else{
        var uname=document.changeform.loginusername.value;
    var upass=document.changeform.loginpassword.value;
    var npass=document.changeform.Npassword1.value;
    var npass2=document.changeform.Npassword2.value;
    if(npass!=npass2){
        sweetAlert("Oops...", "Passwords do not match!!", "error");
        document.changeform.reset();
    }else{
        db.transaction(function(tx){
        tx.executeSql('SELECT * FROM LOGIN',[],function(tx,results){
        var len=results.rows.length, i;
        for(i=0;i<len;i++){
        if(results.rows.item(i).UNAME==uname && results.rows.item(i).PASS == upass){
                    flag=true;

            updatepass2(npass2,results.rows.item(i).STAFF_ID);
        }
      }
      if(!flag){
        sweetAlert("Oops...", "Invalid username or password!!", "error");
      document.changeform.reset();
    }
    });
  });
    }
    }
}

function updatepass2(npass2,STAFF_ID){
    
    db.transaction(function(tx){
    tx.executeSql('UPDATE LOGIN SET PASS=(?) WHERE STAFF_ID=(?)',[npass2,STAFF_ID]);
                    swal("Awesome!", "password change succesfull!", "success");
        window.open('loginPage.html','_self');
  });
    
}