
var docRef =app.activeDocument;
var rasterItems = docRef.rasterItems; // list of raster images in document
var textFrames = docRef.textFrames; //list of all the text objects in the document
var paths = docRef.pathItems;


var theCutline = 0; //variable that will contain the path object that is the cutline
var cutlineW = 0;
var cutlineH =0; //real cutline dimensions
var widthLabel= 0;
var heightLabel =0; //the size numbers on the proof

var quoteMark = new RegExp(/[0-9]\”$/);
var quoteMark2 = new RegExp(/[0-9]\"$/);




var progLoop=true;

while(progLoop){
//look for path likely to be cutline and give it the selected:true property:
    //if has stroke
    //if stroke color is the CutContour spot color
    //if paths are more than 8
var selectedPath;

for(var i =0; i< paths.length; i++){
if(paths[i].stroked && paths[i].strokeColor.typename=="SpotColor"){
    if(paths[i].strokeColor.spot.name === "CutContour"){
       if(paths[i].pathPoints.length > 8){

         paths[i].selected =true; //select cutline path so it is caught by next part of the script
         selectedPath=paths[i];
         break; //for when there is two cutlines on the page
       }
    }
  }
}

//if paths 8 or less it might be the cutline key, but could also be a rectangle sticker therefore:
//end script and prompt the user to select the cutline before restarting the script

//check if only one path is selected:
var s=0; //variable for counting number of paths selected
var checkSpotColor=0;
for (var i=0; i< paths.length; i++){
   if(paths[i].selected){
     selectedPath=paths[i];
     s++;
    }
}
if(s<1){
  alert("I am confused by there are too many paths pleaz try \n 1. deselecting everything \n 2. or just the one cutline path \n and restart script");
  progLoop=false;
  break;
}else if(s>1){
  alert("I am confused by there are too many paths pleaz select either zero or one cutline path and restart script");
  progLoop=false;
  break;
}

//cutline info
theCutline=selectedPath;
cutlineH= Math.round(theCutline.height/72*10)/10;
cutlineW= Math.round(theCutline.width/72*10)/10;
//which is larger dimension
var larger=0;
if(cutlineH>0){
  larger=cutlineH;
} else {
  larger=cutlineW;
}




//check if stroke color is right
var wrongSpotColor=false;
if(theCutline.strokeColor.typename === "SpotColor"){
  if(theCutline.strokeColor.spot.name != "CutContour"){
    wrongSpotColor=true;
  }
  }else{
    wrongSpotColor=true;
  }
  if(wrongSpotColor){
  var spotCheck="the cutline stroke color doesn't seem to be the right spot color";
  if(confirmStop(spotCheck)){
    break;
  }
}


//check number of points in cutline
var numPoints = theCutline.pathPoints.length;
var excessive= numPoints > 70;

if(excessive){
  if(confirmStop("Smooth Check \n possibly excessive points -- is that ok?")){

    break;
  }
}

//Resolution check
var big;
var small;
for (var i=0; i< rasterItems.length; i++){
  var resolution = 72 / (rasterItems[i].matrix.mValueA);
  if( resolution > 720){
    big=true;
  }else if (resolution<300){
    small= true;
  }
}
if(big){
  if(confirmStop("something has big resolution. Do you want continue anyway?")){
      break;
  }

}
if(small){
  if(confirmStop("something has resolution less than 300 DPI. Do you want continue anyway?")){
      break;
  }

}



//finding size sizeNumbers
var sizeNumbers =[];
//are there size numbers labeled in the layers panel as widthVal and heightVal
var labeled=false;
for (var i=0; i< textFrames.length; i++){
  if(textFrames[i].name == "widthVal"){
      widthLabel= justTheNumber(textFrames[i].contents);
      sizeNumbers.push(widthLabel);
  }

  if(textFrames[i].name == "heightVal"){
    heightLabel= justTheNumber(textFrames[i].contents);
    sizeNumbers.push(heightLabel);
  }
}
//check if labeled
if(widthLabel.length > 0 && heightLabel.length > 0){
  labeled=true;
}
 else{
   //empty array incase there was one labeled number that snuck through
   sizeNumbers=[];
   //if not labeled, find based on text contents
  for(var i=0; i< textFrames.length; i++){
    if(quoteMark.test(textFrames[i].contents)){
      textFrames[i].selected=true;
      sizeNumbers.push(justTheNumber(textFrames[i].contents));
    }
  }
}


//are there only two sizebumbers
if(sizeNumbers.length>2){
  alert("too many size labels detected")
  progLoop=false;
  break;
}else if (sizeNumbers.length<2){
    alert("too few size labels detected")
    progLoop=false;
    break;
}

//check for matching
var match= false;
if(sizeNumbers[0] == cutlineW){
  if(sizeNumbers[1]==cutlineH){
    match=true;
  }
}
else if(sizeNumbers[1]==cutlineW){
  if(sizeNumbers[0]==cutlineH){
    match=true;
  }
}

if(!match){
  if(confirmStop("size labels don't match cutline dimensions")){
    break;
  }
}
//switchCheck
var switched=false;
if (labeled){
  if(widthLabel == cutlineH && heightLabel == cutlineW){
    if(cutlineH !=cutlineW){ //if width and height are the same
      switched = true
    }
  }
}

if(switched){
  if(confirmStop("Switched numbers detected \n LOOK AT SIZES ON PROOF. Is the BIGGER number on the longer side and the sMaller number on the shorter side?")){
    break;
  }
}


//ellipse check - check for small 1/8" ellipse commonly used to check safety trim width
var strayEllipse=false;
//check for path that is ellipse based on pi area equation and check that the ellipse is less than ~ 0.2" based on that area value
for(var i=0; i<paths.length; i++){
  var area =paths[i].width/2*paths[i].height/2*Math.PI;

   if(Math.round(area*10) === Math.round(paths[i].area*10)){
    if(Math.round(area)<165 && Math.round(area)> 1){
      strayEllipse=true;
      paths[i].selected=true;
      break;
    }
  }
}

if(strayEllipse){
  if(confirmStop("possible 1/8\" ellipse detected -- ignore?")){
    break;
  }

}

//Interview zome
var checkOrder= "Dimensions CHECK \n" +"Dimensions of actual cutline: \n"+cutlineW+"\" wide and "+cutlineH+"\" high \n"+
      "\nSQUARED: \n"+ cutlineW*cutlineH ;
if(confirmStop(checkOrder)){
  break;
}else{
  alert("LOOK AT SIZES ON ORDER PAGE >;-0")
}

alert("Resolution check: PASS \n Dimension check: PASS \n Spot color check: PASS :]");

alert ("close your eyes and take one (1) medium breath");
alert ("check order notes");



if(!labeled){
  var checkSwitch= "LOOK AT SIZES ON PROOF. Is the BIGGER number on the longer side and the sMaller number on they shorter side?  >:-0";
    if(confirmStop(checkSwitch)){
      break;
    }
}

var checkRush= "IS THE PRODUCTION TIME CORRECT";
if(confirmStop(checkRush)){
  break;
}


var checkTemplate= "IS THE TEMPLATE RIGHT";
if(confirmStop(checkTemplate)){
  break;
}

var checkBleed= "Did you check EVERRY spot in the bleed for spots?";
if(confirmStop(checkBleed)){
  break;
}


//kiss check
var kiss=checkForText("kiss");

if(kiss){
  var backing="Does this need backing?";
  var shape="Is this the right shape?"

  if(confirmStop(backing)){
    break;
  }
  if(confirmStop(shape)){
    break;
  }


}

//label check
var labelProof=checkForText("label");


if(labelProof){
  confirmStop("does this follow the label rules?");
}


alert("proof seems okay. give the layers panel and the actual page a once-over and save as PDF :)")

progLoop=false;
}

//check if there is certain text in the document
function checkForText(modelText){
  for (var i=0; i< textFrames.length; i++){
    var textToCheck= textFrames[i].contents.toLowerCase();
   if(textToCheck.indexOf(modelText)> -1){
        return true;
      }
  }
}

//function to get size integer value from text frame
function justTheNumber(text){
  var numbo=0;
  var decimal= new RegExp(/\./g);
  if (decimal.test(text)){
    numbo= text.match(/[0-9]+\.[0-9]+/g);
  }else{
    numbo= text.match(/[0-9]+/g);
  }

  return numbo;

}

//confirmation dialog template
function confirmStop(message){
  var c = confirm(message+" \n \n Yes: That's fine please continue \n No: stop script to fix");
    if(!c){
//alert("stopping script so you can fix :-)");
      progloop=false;
      return true;
    }
}
