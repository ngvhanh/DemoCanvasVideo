// ---------------- CÁC HÀM XỬ LÝ VIDEO THEO CÁC BỘ LỌC --------------

// Nhận vào một frame và trả về video frame dưới dạng gray
function gray(orgFrame)
{
    var resultFrame = orgFrame;
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và chuyển pixel đó sang dạng gray
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
    
    // Duyệt qua từng pixel và cộng thêm vào kênh red
    var length = tempData.length;
    for (var i = 0; i < length; i += 4)
    {                    
        var temp = tempData[i] + DEF_ADD;
        if(temp > 255)
            temp = 255;
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
    
    // Duyệt qua từng pixel và cộng thêm vào kênh green
    var length = tempData.length;
    for (var i = 1; i < length; i += 4)
    {                    
        var temp = tempData[i] + DEF_ADD;
        if(temp > 255)
            temp = 255;
        tempData[i] = temp;
    }

    resultFrame.data = tempData;

    return resultFrame;
}


// Nhận vào một frame và trả về video frame được thêm màu ở kênh Blue
function blue(orgFrame)
{
    var resultFrame = orgFrame;
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và cộng thêm vào kênh blue
    var length = tempData.length;
    for (var i = 2; i < length; i += 4)
    {                    
        var temp = tempData[i] + DEF_ADD;
        if(temp > 255)
            temp = 255;
        tempData[i] = temp;
    }

    resultFrame.data = tempData;

    return resultFrame;
}

// Nhận vào một frame và trả về video frame được lọc trung bình
function average(orgFrame)
{
    var resultFrame = orgFrame;
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và gán bằng giá trị trung bình của các pixel xung quanh
    var width = resultFrame.width;

    // biến giữ vị trí của pixel cùng cột ở dòng liền trước
    var prvLine = 4;
    // biến giữ vị trí của pixel cùng cột ở dòng liền sau
    var nxtLine = 2*width*4 + 4;

    var length = tempData.length;
    for(var i = width*4 + 4; i < length - width*4 - 4; i++)
    {
        tempData[i] = (tempData[prvLine-4] + tempData[prvLine] + tempData[prvLine+4]
                        + tempData[i-4] + tempData[i] + tempData[i+4]
                        + tempData[nxtLine-4] + tempData[nxtLine] + tempData[nxtLine+4]) / 9;
        // cập nhật vị trí dòng liền trước và dòng liền sau cho bước tiếp theo
        prvLine++;
        nxtLine++;
    }

    resultFrame.data = tempData;

    return resultFrame;
}

// Nhận vào một frame và trả về video frame được lọc Sobel
function sobel(orgFrame)
{
    var resultFrame = (orgFrame);
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và gán bằng giá trị trung bình của các pixel xung quanh
    var width = resultFrame.width;
    var height = resultFrame.height;

    for(var r = 1; r < height - 1; r++)
    {
        for(c = 1; c < width - 1; c++)
        {
        }
    }


    resultFrame.data = tempData;

    return resultFrame;
}

// Nhận vào một frame và trả về video frame được lọc Prewitt
function prewitt(orgFrame)
{
    return orgFrame;
    var resultFrame = gray(orgFrame);
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và gán bằng giá trị trung bình của các pixel xung quanh
    var width = orgFrame.width;

    // biến giữ vị trí của pixel cùng cột ở dòng liền trước
    var prvLine = 0;
    // biến giữ vị trí của pixel cùng cột ở dòng liền sau
    var nxtLine = 2*width*4;

    var length = tempData.length;
    for(var i = width*4; i < length - width; i++)
    {
        // Tính đạo hàm theo chiều ngang
        var temp1 = (tempData[prvLine-4] + tempData[prvLine] + tempData[prvLine+4]
                    - tempData[nxtLine-4] - tempData[nxtLine] - tempData[nxtLine+4]);
        // Tính đạo hàm theo chiều dọc
        var temp2 = (tempData[prvLine-4] -  tempData[prvLine+4]
                    + tempData[i-4] - tempData[i+4]
                    + tempData[nxtLine-4] - tempData[nxtLine+4]);
        // Lấy đạo hàm theo 2 chiều
        tempData[i] = Math.sqrt(Math.pow(temp1, 2) + Math.pow(temp2, 2));

        // cập nhật vị trí dòng liền trước và dòng liền sau cho bước tiếp theo
        prvLine = i;
        nxtLine = nxtLine + width;
    }

    resultFrame.data = tempData;

    return resultFrame;
}

// Nhận vào một frame và trả về video frame được lọc Laplace
function laplace(orgFrame)
{
    var resultFrame = gray(orgFrame);
    var tempData = resultFrame.data;
    
    // Duyệt qua từng pixel và gán bằng giá trị trung bình của các pixel xung quanh
    var width = orgFrame.width;

    // Duyệt qua từng pixel và gán bằng giá trị trung bình của các pixel xung quanh
    var width = resultFrame.width;
    var height = resultFrame.height;

    var step = width * 4;

    for(var r = 1; r < height - 1; r++)
    {
        for(c = 1; c < width - 1; c++)
        {
            var i = 4 * (r*width + c);

            var temp = (tempData[i-step] + tempData[i-4] - 4*tempData[i] + tempData[i+4] + tempData[i+step]);
            // Lấy đạo hàm theo 2 chiều
            var newValue = Math.abs(temp) + 100;//Math.sqrt(Math.abs(temp));
            
            if(newValue > 255)
                newValue = 255;
            tempData[i] = newValue;
            tempData[i+1] = newValue;
            tempData[i+2] = newValue;
        }
    }

    return resultFrame;
}