var fs = require("fs");
var S = require("string");
var data = JSON.parse(S(fs.readFileSync("data/trainingdata.json")).ensureLeft('[').ensureRight(']').replaceAll('}{','},{').s);
var unique = [];
function comparator(a,b)
{
  for(var i=0;i<9;i++)
  {
    if(!(a.input[i]===b.input[i]&&a.output[i]===b.output[i]))
    {
      return false;
    }
  }
  return true;
}
for (var i=0;i<data.length;i++)
{
  for(var j=0;j<=i;j++)
  {
    if(i==j)
    {
      unique.push(data[i]);
    }
    if(j<i&&comparator(data[i],data[j]))
    {
      console.log("duplicate found");
      break;
    }
    
  }
}
console.log("generation done");
fs.writeFileSync("data/trainingdata.json",JSON.stringify(unique[0]));
for (var i=1;i<unique.length;i++)
{
  fs.appendFileSync("data/trainingdata.json",JSON.stringify(unique[i]));
}