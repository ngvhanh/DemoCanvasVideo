var filter = 1; 

//Handle events
// document.addEventListener('DOMContentLoaded', function(){
   
//     //For showing processed video
//     var cv = document.getElementById('cvShowVid');
//     var ctx = cv.getContext('2d');
    
//     var vid = document.getElementById("OrginalVid");

//     //When user click PLAY
//     vid.addEventListener('play', function(){
//         //Set video size to canvas            
//         cv.width = vid.clientWidth;
//         cv.height = vid.clientHeight;
//         //Draw video to canvas
//         draw(this, ctx, cv.width, cv.height, filter);
//     },false);
// },false);


function btGrayClick(){
	// var c = document.getElementById("myCanvas");
	// var ctx = c.getContext("2d");
	// var imgData = ctx.getImageData(0,0,c.width,c.height);
	// // gray colors
	// for (var i= 0; i < imgData.data.length; i += 4)
 //  	{
 //  		var brightness = 0.2126 * imgData.data[i] + 0.7152 * imgData.data[i+1] + 0.0722 * imgData.data[i+2];
 //  		imgData.data[i] = brightness;
 //  		imgData.data[i+1] = brightness;
 //  		imgData.data[i+2] = brightness;
 // 		  imgData.data[i+3] = 255;
 //  	}
	// ctx.putImageData(imgData,0,0);
  filter = 1;
}

function btInvertClick(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var imgData = ctx.getImageData(0,0,c.width,c.height);
	// invert colors
	for (var i= 0; i < imgData.data.length; i += 4)
  	{
  		imgData.data[i] = 255 - imgData.data[i];
  		imgData.data[i+1] = 255 - imgData.data[i+1];
  		imgData.data[i+2] = 255 - imgData.data[i+2];
 		imgData.data[i+3] = 255;
  	}
	ctx.putImageData(imgData,0,0);
}

function btStartClick(){
	var btStart = document.getElementById('bt_start');
	var vid = document.getElementById('OrginalVid');

	if(vid.paused)
	{
		btStart.textContent = 'Pause';
		vid.play();
	}
	else
	{
		btStart.textContent = 'Start';
		vid.pause();
	}
}

function btReplayClick(){
	var vid = document.getElementById('OrginalVid');
	var btStart = document.getElementById('bt_start');

	vid.currentTime = 0;
	vid.play();
	btStart.textContent = 'Pause';
}


//Drawing canvas
// function draw(video, context, width, height, filterType)
// {
//     //if(video.paused || video.ended) return false;
        
//     //Draw on Canvas
//     context.drawImage(video, 0, 0, width, height);
    
//     if(filterType != 0)
//     {
//         //Get image data from the canvas
//         var frmData = context.getImageData(0, 0, width, height);
        
//         //Processing
//         //Grayscale
//         if(filterType == 1)
//         {
//             frmData = grayscale(frmData);
//         }
//         //Edge detect
//         if(filterType == 2)
//         {
//             frmData = edgeDetect(frmData);
//         }        
//         //Gaussian blur
//         if(filterType == 3)
//         {
//             frmData = gaussBlur(frmData);
//         }
        
//         //Redraw on the canvas
//         context.putImageData(frmData, 0, 0);
//     }
    
//     //Repeat
//     setTimeout(draw, 20, video, context, width, height, filter); 
// }

//Grayscale
function grayscale(frameData)
{
	//return frameData
    var src = frameData;
    var result = src.data;
    
    //Acess all pixels and grayscale them
    var length = pData.length;
    for (var i=0; i<length; i+=4)
    {                    
  		var brightness = 0.2126 * src.data[i] + 0.7152 * src.data[i+1] + 0.0722 * src.data[i+2];
  		result.data[i] = brightness;
      alert("c");
  		result.data[i+1] = brightness;
  		result.data[i+2] = brightness;
 		  result.data[i+3] = 255;
    }
    
    src.data = result;
    return src;
}

//Init
//Global variable for filter type
var filter = 1;   //1 = Grayscale

//Handle events
document.addEventListener('DOMContentLoaded', function()
{
    var v = document.getElementById('OrginalVid');
        
    //For showing processed video
    var c = document.getElementById('cvShowVid');
    var ctx = c.getContext('2d');
    
    //When user click PLAY
    v.addEventListener('play', function(){
        //Set video size to canvas            
        c.width = v.clientWidth;
        c.height = v.clientHeight;

        //Draw video to canvas
        draw(v, ctx, c.width, c.height, filter);
    },false);
},false);

//Drawing canvas
function draw(video, context, width, height, filterType)
{
    if(video.paused || video.ended)
    	return false;

    //Draw on Canvas
    context.drawImage(video, 0, 0, width, height);
    
    if(filterType != 0)
    {
        //Get image data from the canvas
        var frmData = context.getImageData(0, 0, width, height);
        alert(filterType);
        //Processing
        //Grayscale
        if(filterType == 1)
        {
            frmData = grayscale(frmData);
        }
        //Edge detect
        if(filterType == 2)
        {
            frmData = edgeDetect(frmData);
        }        
        //Gaussian blur
        if(filterType == 3)
        {
            frmData = gaussBlur(frmData);
        }
        
        //Redraw on the canvas
        context.putImageData(frmData, 0, 0);
    }
    
    //Repeat
    setTimeout(draw, 20, video, context, width, height, filter); 
    //setTimeout("draw(video, context, width, height, filter)",20); 
}