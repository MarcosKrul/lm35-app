import { AppError } from "@handlers/errors/AppError";

type IsNumberValidationModel = {
  value: any;
  error: AppError;
};

export { IsNumberValidationModel };
