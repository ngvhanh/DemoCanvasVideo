// Biến đánh dấu bộ lọc nào sẽ được sử dụng
// Mặc định là Grayscale
var filter = 1;

/*------------------------------------------------------------------------------
Bắt đầu đoạn mã nguồn tham khảo tại HTML5 Doctor
Địa chỉ tham khảo: http://html5doctor.com/video-canvas-magic/
Các ghi chú được tự thêm vào, một số tên biến và vị trí xuống dòng được thay đổi
-------------------------------------------------------------------------------*/

// Bắt sự kiện
document.addEventListener('DOMContentLoaded',
    function(){
        // Lấy biến trỏ tới video nguồn
        var vid = document.getElementById('beforeVideo');
        // Lấy biến trỏ tới video đích     
        var c = document.getElementById('afterVideo');
        var ctx = c.getContext('2d');
        
        // Gán kích thước của canvas chứa kết quả xử lý bằng với kích thước video gốc
        c.width = vid.clientWidth;
        c.height = vid.clientHeight;

        // Thêm hàm xử lý sự kiện video play
        // Hàm này sẽ xử lý dựa vào bộ lọc hiện tại do người dùng chọn    
        vid.addEventListener('play',
        function(){
            // Vẽ kết quả xử lý lên cavas (video)
            draw(this, ctx, c.width, c.height, filter);
        },false);
    },false);


// Đoạn code tham khảo một phần tại địa chỉ như trên
// Lấy nội dung trong "video" xử lý dựa vào "filterType"
// Kết quả được vẽ lên canvas đựa trỏ đến bởi biến "context"
// Video gốc có kích thức "width" và "height" tương ứng
function draw(video, context, width, height, filterType)
{
    // Không xử lý nếu video gốc hiện không chạy
    if(video.paused || video.ended)
        return false;
        
    // Gán dữ liệu trên video nguồn bằng frame hiện tại ở video gốc
    context.drawImage(video, 0, 0, width, height);
    
    // Lấy lại frame đó từ canvas (do không lấy trực tiếp frame vừ video gốc được)
    var orgFrame = context.getImageData(0, 0, width, height);
    // Tạo biến chứa frame kết quả
    resultFrame = orgFrame;

    // Xử lý dựa vào bộ lọc hiện tại
    //Grayscale
    if(filterType == 1)
        resultFrame = grayscale(orgFrame);
    //Edge detect
    else if(filterType == 2)
        resultFrame = edgeDetect(orgFrame);
    //Gaussian blur
    else if(filterType == 3)
        resultFrame = gaussBlur(orgFrame);
    
    // Vẽ lại kết quả xử lý lên canvas thể hiện video đích
    context.putImageData(resultFrame, 0, 0);

    // Thực hiện hành động này mỗi 40 mili giây (khoảng 25frame/giây)
    setTimeout(draw, 40, video, context, width, height, filter); 
}

// ---------------- CÁC HÀM XỬ LÝ VIDEO THEO CÁC BỘ LỌC --------------


// Chuyển frame đầu vào thành màu xám
function grayscale(orgFrame)
{
    var resultFrame = orgFrame;
    var pData = resultFrame.data;
    
    //Acess all pixels and grayscale them
    var length = pData.length;
    for (var i=0; i<length; i+=4)
    {                    
        var gray = pData[i]*0.3 + pData[i+1]*0.59 + pData[i+2]*0.11;
        pData[i] = gray;
        pData[i+1] = gray;
        pData[i+2] = gray;
    }
    
    resultFrame.data = pData;
    orgFrame = resultFrame;
    return resultFrame;
}


// Hàm thực hiện tính tích chập với các kernal
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