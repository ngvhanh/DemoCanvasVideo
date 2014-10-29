// Biến đánh dấu bộ lọc nào sẽ được sử dụng
// Mặc định là Gray
var filter = 1;
var DEF_GRAY = 1;
var DEF_RED = 2;
var DEF_GREEN = 3;
var DEF_BLUE = 4;
var DEF_SOBEL = 5;
var DEF_PREWITT = 6
var DEF_LAPLACE = 7;
var DEF_AVERAGE = 8;
var DEF_MAX = DEF_AVERAGE;

var TXT_GRAY = "Gray"
var TXT_RED = "Red"
var TXT_GREEN = "Green"
var TXT_BLUE = "Blue"
var TXT_SOBEL = "Sobel"
var TXT_PREWITT = "Prewitt"
var TXT_LAPLACE = "Laplace"
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
    //Gray
    if(filterType == DEF_GRAY)
        resultFrame = gray(orgFrame);
    else if(filterType == DEF_RED)
        resultFrame = red(orgFrame);
    else if(filterType == DEF_GREEN)
        resultFrame = green(orgFrame);
    else if(filterType == DEF_BLUE)
        resultFrame = blue(orgFrame);
    else if(filterType == DEF_SOBEL)
        resultFrame = sobel(orgFrame);
    else if(filterType == DEF_PREWITT)
        resultFrame = prewitt(orgFrame);
    else if(filterType == DEF_LAPLACE)
        resultFrame = gaussBlur(orgFrame);
    else if(filterType == DEF_AVERAGE)
        resultFrame = average(orgFrame);
    
    // Vẽ lại kết quả xử lý lên canvas thể hiện video đích
    context.putImageData(resultFrame, 0, 0);

    // Thực hiện hành động này mỗi 40 mili giây (khoảng 25frame/giây)
    setTimeout(draw, 40, video, context, width, height, filter); 
}


//Change filter
function nextFilter()
{
    var filterText = document.getElementById('afterText');
    
    filter++;
    if(filter > DEF_MAX)
        filter = DEF_GRAY;

    if(filter == DEF_GRAY)
        filterText.innerHTML = TXT_GRAY;
    else if(filter == DEF_RED)
        filterText.innerHTML = TXT_RED;
    else if(filter == DEF_GREEN)
        filterText.innerHTML = TXT_GREEN;
    else if(filter == DEF_BLUE)
        filterText.innerHTML = TXT_BLUE;
    else if(filter == DEF_SOBEL)
        filterText.innerHTML = TXT_SOBEL;
    else if(filter == DEF_PREWITT)
        filterText.innerHTML = TXT_PREWITT;
    else if(filter == DEF_LAPLACE)
        filterText.innerHTML = TXT_LAPLACE;
    else if(filter == DEF_AVERAGE)
        filterText.innerHTML = TXT_AVERAGE;
   
}