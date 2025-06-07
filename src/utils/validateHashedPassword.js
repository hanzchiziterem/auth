import { compare } from "bcryptjs";

const validateHashedPassword = (value, hashedValue) => {
    const result = compare(value, hashedValue);
    return result;
}

export default validateHashedPassword;