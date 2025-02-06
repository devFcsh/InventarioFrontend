export const validateMAC = (value: string) => {
    value = value.trim();
    const regex = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;
    return regex.test(value);
};
