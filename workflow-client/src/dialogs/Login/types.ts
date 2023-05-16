import { InferType } from "yup";

import { validationSchema } from "./formSchema";

export type LoginFormType = InferType<typeof validationSchema>;
