function blafunc(){
    var formVar=document.getElementById('blaF');
    var input=formVar.getElementsByTagName('input');
    for(var i=0;i<input.length;i++){
        alert(input[i].value);
    }
}