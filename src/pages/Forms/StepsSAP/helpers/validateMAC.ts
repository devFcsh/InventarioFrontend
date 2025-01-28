export const validateMAC = (value: string) => {
    value = value.trim();
    const regex = /^[a-zA-Z0-9]+$/;
    if (value.length >= 1 && value.length <= 12 && regex.test(value)) {
        return true;
    }
    return false;
};
