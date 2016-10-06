//User Labelling & Tracking Script from ragul <3
function userCheckIn() {
  var uid=getLocalStorageStuff("id");
  document.title+=" @ "+uid;
}

function getLocalStorageStuff(a){
  b=localStorage.getItem(a);
  if(b==null){
    if(a=="id"){
      localStorage.setItem(a,makeNewUserID());
    }else{
      localStorage.setItem(a,0);
    }
  }
  return localStorage.getItem(a);
}

function makeNewUserID(){
  return chance.color({format: 'name'}) + "" + chance.age();
}

userCheckIn();
