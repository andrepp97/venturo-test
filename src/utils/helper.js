export const BASE_URL = "https://tes-mobile.landa.id/api";

export const thousandSeparator = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}