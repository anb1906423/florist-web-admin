
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
  