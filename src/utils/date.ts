// Hàm so sánh thời gian mà chúng ta truyền vào so với thời gian hiện tại đã trôi qua bao nhiêu ngày
export const getTimePast = (date: Date, t: any) => {
  const currentDate: Date = new Date()
  const millisecondsInDay: number = 1000 * 24 * 60 * 60

  // Số giây đã trôi qua được bao nhiêu ms
  const pastTimeSecond: number = currentDate.getTime() - date.getTime() // Lấy ra ms
  // lấy ra được đã trôi qua được bao nhiêu ngày rồi -> lấy ra được số ngày đã trôi qua
  const pastTimeDate: number = pastTimeSecond / millisecondsInDay // -> Lúc này lấy ra được ngày
  if (pastTimeDate < 30) {
    if (pastTimeDate < 1) {
      return `${'recently'}`
    }
    return `${Math.floor(pastTimeDate)} ${t('Review_day')}`
  } else if (pastTimeDate < 365) {
    // Làm tròn xuống, số ngày đã cmt
    const month: number = Math.floor(pastTimeDate / 30)

    return `${month} ${t('Review_month')}`
  } else {
    const year: number = Math.floor(pastTimeDate / 365)

    return `${year} ${t('Review_year')}`
  }
}
