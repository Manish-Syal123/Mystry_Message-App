import { z } from "zod";

// we will check while signUp:  user has put the valid userName or not (1st way)
export const usernameValidation = z
  .string()
  .min(2, "User Name must be atleast 2 characters")
  .max(20, "Usernme must be no more then 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

// second way if we want to validate multiple fields then we can use an object type and validate it inline
export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "Password must of atleast 6 characters" }),
});
