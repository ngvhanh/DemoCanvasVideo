// Biến đánh dấu bộ lọc nào sẽ được sử dụng
// Mặc định là Grayscale
var filter = 1;
var DEF_GRAYSCALE = 1;
var DEF_RED = 2;
var DEF_GREEN = 3;
var DEF_BLUE = 4;
var DEF_SOBEL = 5;
var DEF_GAUSS = 6;
var DEF_AVERAGE = 7;
var DEF_MAX = DEF_AVERAGE;
var TXT_GRAYSCALE = "Grayscale"
var TXT_RED = "Red"
var TXT_GREEN = "Green"
var TXT_BLUE = "Blue"
var TXT_SOBEL = "Sobel"
var TXT_GAUSS = "Gauss"
var TXT_AVERAGE = "Average"

var DEF_ADD = 50;

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
    if(filterType == DEF_GRAYSCALE)
        resultFrame = grayscale(orgFrame);
    if(filterType == DEF_RED)
        resultFrame = red(orgFrame);
    if(filterType == DEF_GREEN)
        resultFrame = green(orgFrame);
    if(filterType == DEF_BLUE)
        resultFrame = blue(orgFrame);
    if(filterType == DEF_SOBEL)
        resultFrame = edgeDetect(orgFrame);
    if(filterType == DEF_GAUSS)
        resultFrame = gaussBlur(orgFrame);
    if(filterType == DEF_AVERAGE)
        resultFrame = grayscale(orgFrame);
    
    // Vẽ lại kết quả xử lý lên canvas thể hiện video đích
    context.putImageData(resultFrame, 0, 0);

    // Thực hiện hành động này mỗi 40 mili giây (khoảng 25frame/giây)
    setTimeout(draw, 40, video, context, width, height, filter); 
}

// ---------------- CÁC HÀM XỬ LÝ VIDEO THEO CÁC BỘ LỌC --------------

// Nhận vào một frame và trả về video frame dưới dạng grayscale
function grayscale(orgFrame)
{;
    var resultFrame = orgFrame;
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và chuyển pixel đó sang dạng grayscale
    var length = tempData.length;
    for (var i = 0; i < length; i += 4)
    {                    
        var brightness = 0.2126 * tempData[i] + 0.7152 * tempData[i+1] + 0.0722 * tempData[i+2];
        tempData[i] = brightness;
        tempData[i+1] = brightness;
        tempData[i+2] = brightness;
        tempData[i+3] = 255;
    }
    resultFrame.data = tempData;

    return resultFrame;
}

// Nhận vào một frame và trả về video frame được thêm màu ở kênh Red
function red(orgFrame)
{
    var resultFrame = orgFrame;
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và chuyển pixel đó sang dạng grayscale
    var length = tempData.length;
    for (var i = 0; i < length; i += 4)
    {                    
        var temp = tempData[i] + DEF_ADD;
        if(temp > 225)
            temp = 225;
        tempData[i] = temp;
    }

    resultFrame.data = tempData;

    return resultFrame;
}


// Nhận vào một frame và trả về video frame được thêm màu ở kênh Green
function green(orgFrame)
{
    var resultFrame = orgFrame;
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và chuyển pixel đó sang dạng grayscale
    var length = tempData.length;
    for (var i = 0; i < length; i += 4)
    {                    
        var temp = tempData[i+1] + DEF_ADD;
        if(temp > 225)
            temp = 225;
        tempData[i+1] = temp;
    }

    resultFrame.data = tempData;

    return resultFrame;
}


// Nhận vào một frame và trả về video frame được thêm màu ở kênh Blue
function blue(orgFrame)
{
    var resultFrame = orgFrame;
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và chuyển pixel đó sang dạng grayscale
    var length = tempData.length;
    for (var i = 0; i < length; i += 4)
    {                    
        var temp = tempData[i+2] + DEF_ADD;
        if(temp > 225)
            temp = 225;
        tempData[i+2] = temp;
    }

    resultFrame.data = tempData;

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

//Change filter
function nextFilter()
{
    var fTxt = document.getElementById('filterText');
    
    filter++;
    if(filter > DEF_MAX)
        filter = DEF_GRAYSCALE;

    if(filter == DEF_GRAYSCALE)
        fTxt.innerHTML = TXT_GRAYSCALE;
    if(filter == DEF_RED)
        fTxt.innerHTML = TXT_RED;
    if(filter == DEF_GREEN)
        fTxt.innerHTML = TXT_GREEN;
    if(filter == DEF_BLUE)
        fTxt.innerHTML = TXT_BLUE;
    if(filter == DEF_SOBEL)
        fTxt.innerHTML = TXT_SOBEL;
    if(filter == DEF_GAUSS)
        fTxt.innerHTML = TXT_GAUSS;
    if(filter == DEF_AVERAGE)
        fTxt.innerHTML = TXT_AVERAGE;

    
}