import { hash } from "bcryptjs";

const hashPassowrd = (value, saltValue) => {
  const result = hash(value, saltValue);
  return result;
};

export default hashPassowrd;