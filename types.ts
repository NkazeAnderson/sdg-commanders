import { z } from "zod";
import { userModes } from "./constants";
import { usersSchema } from "./zodSchema";

export type userModesT = typeof userModes[number]

export type userT = z.infer<typeof usersSchema>