
export const convertTime = (created_at) => {
    const date = new Date(created_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // tháng (giá trị từ 0 đến 11, nên cộng thêm 1)
    const day = date.getDate(); // ngày trong tháng
    const hours = date.getHours(); // giờ
    const minutes = date.getMinutes(); // phút
    const seconds = date.getSeconds(); // giây
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return (
        <>
            {formattedDate} <br /> {formattedTime}
        </>
    )
}

export function getPathAfterPublic(fullPath) {
    const publicIndex = fullPath.indexOf("public");
    if (publicIndex !== -1) {
        return fullPath.substring(publicIndex + 6);
    }
    return fullPath;
}

export function getTotal(total, deliveryCharges) {
    var num1 = parseFloat(total); // Chuyển chuỗi thành số
    var num2 = parseFloat(deliveryCharges); // Chuyển chuỗi thành số

    if (isNaN(num1) || isNaN(num2)) {
        // Kiểm tra nếu không thể chuyển đổi chuỗi thành số
        return "Invalid input"; // Hoặc giá trị bạn mong muốn khi đầu vào không hợp lệ
    }

    var sum = num1 + num2; // Thực hiện phép cộng hai số

    return sum.toString(); // Chuyển kết quả thành chuỗi và trả về
}
