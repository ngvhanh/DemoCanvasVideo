//Init
//Global variable for filter type
var filter = 1;   //1 = Grayscale

//Handle events
document.addEventListener('DOMContentLoaded', function(){
    var v = document.getElementById('video');
        
    //For showing processed video
    var c = document.getElementById('dstCanvas');
    var ctx = c.getContext('2d');
    
    //When user click PLAY
    v.addEventListener('play', function(){
        //Set video size to canvas            
        c.width = v.clientWidth;
        c.height = v.clientHeight;
        
        //Draw video to canvas
        draw(this, ctx, c.width, c.height, filter);
    },false);
},false);

//Drawing canvas
function draw(video, context, width, height, filterType)
{
    if(video.paused || video.ended) return false;
        
    //Draw on Canvas
    context.drawImage(video, 0, 0, width, height);
    
    if(filterType != 0)
    {
        //Get image data from the canvas
        var frmData = context.getImageData(0, 0, width, height);
        
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
}

//Video processing-------------------------------------------------------------------------------------------------------------------
//Convolute with kernel 3x3
function convolute(iData, kernel, delta)
{
    var w = iData.width;    
    var pData = iData.data;
    var rData = iData.data;
    var length = pData.length;
    var i;
    var step = w*4;
    
    for (i=0; i<length; i++)
    {
        if(i%4 == 3)
        {
            continue;
        }       
        
        iPrev = i - step;
        iNext = i + step;
        pData[i] = rData[iPrev-4]*kernel[8] + rData[iPrev]*kernel[7] + rData[iPrev+4]*kernel[6]
                    + rData[i-4]*kernel[5] + rData[i]*kernel[4] + rData[i+4]*kernel[3]
                    + rData[iNext-4]*kernel[2] + rData[iNext]*kernel[1] + rData[iNext+4]*kernel[0] + delta;
    }    
    iData.data = pData;
}

//Edge detection
function edgeDetect(frameData)
{
    var iData = frameData;
    
    var kernel = [0, -1, 0,
                 -1, 2, 0,
                 0, 0, 0];
    
    convolute(iData, kernel, 100);
    
    return iData;
}

//Gaussian blur
function gaussBlur(frameData)
{
    var iData = frameData;
    
    var kernel = [0.0625, 0.125, 0.0625,
                 0.125, 0.25, 0.125,
                 0.0625, 0.125, 0.0625];
    
    convolute(iData, kernel, 0);
    
    return iData;
}

//Grayscale
function grayscale(frameData)
{
    var iData = frameData;
    var pData = iData.data;
    
    //Acess all pixels and grayscale them
    var length = pData.length;
    for (var i=0; i<length; i+=4)
    {                    
        var gray = pData[i]*0.3 + pData[i+1]*0.59 + pData[i+2]*0.11;
        pData[i] = gray;
        pData[i+1] = gray;
        pData[i+2] = gray;
    }
    
    iData.data = pData;
    return iData;
}

//Video controller-------------------------------------------------------------------------------------------------------------------
//Play video
function playVid()
{
    var v = document.getElementById('video');
    var but = document.getElementById('playBut');
    if (v.paused)
    {
        v.play();
        but.textContent = 'PAUSE';
    }
    else
    {
        v.pause();
        but.textContent = 'PLAY';
    }
}

//Pause video
function replayVid()
{
    var v = document.getElementById('video');
    v.currentTime = 0;
}

//Change filter
function changeFilter()
{
    var fTxt = document.getElementById('filterText');
    
    if(filter == 1)
    {
        filter++;
        fTxt.innerHTML = 'Edge Detection';
    }
    else if(filter == 2)
    {
        filter++;
        fTxt.innerHTML = 'Gaussian Blur with 3x3 kernel';
    }
    else if(filter == 3)
    {
        filter = 1;
        fTxt.innerHTML = 'Grayscale';
    }
}








////Convolute with kernel 3x3
//function convolute(iData, hKernel, vKernel, mean)
//{
//    var w = iData.width;    
//    var pData = iData.data;
//    var pData2 = iData.data;
//    var length = pData.length;
//    var i;
//    var step = w*4;
//    
//    //Horizontal filtering
//    for (i=0; i<length; i++)
//    {
//        if(i%4 == 3)
//        {
//            continue;
//        }        
//        pData2[i] = pData[i-4]*hKernel[2] + pData[i]*hKernel[1] + pData[i + 4]*hKernel[0] + mean;        
//    }
//    
//    //Vertical filtering
//    for (i=0; i<length; i++)
//    {
//        if(i%4 == 3)
//        {
//            continue;
//        }        
//        pData[i] = pData2[i-step]*vKernel[2] + pData2[i]*vKernel[1] + pData2[i + step]*vKernel[0] + mean;      
//    }
//    
//    iData.data = pData;
//}