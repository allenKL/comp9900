export function timeConvert(time) {
    const now = new Date();
    const postDate = new Date(time);
    const timeDifference = now - postDate;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference < 24) {
        if (hoursDifference == 0) {
            return `${minutesDifference % 60} minutes ago`;
        }
        return `${hoursDifference} hours and ${minutesDifference % 60} minutes ago`;
    } else {
        const day = String(postDate.getDate()).padStart(2, '0');
        const month = String(postDate.getMonth() + 1).padStart(2, '0');
        const year = postDate.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
