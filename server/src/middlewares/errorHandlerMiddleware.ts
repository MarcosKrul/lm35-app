import { NextFunction, Request, Response } from "express";

import { i18n } from "@config/i18n";
import { AppError } from "@handlers/errors/AppError";
import { getErrorStackTrace } from "@helpers/getErrorStackTrace";
import { HttpStatus, IResponseMessage } from "@infra/http";
import { logger } from "@infra/log";

const errorHandlerMiddleware = async (
  err: Error,
  _: Request,
  res: Response<IResponseMessage>,
  next: NextFunction
): Promise<void> => {
  logger.error(getErrorStackTrace(err));

  const [statusCode, message] = ((): [number, string] => {
    if (err instanceof AppError) return [err.statusCode, err.message];

    return [HttpStatus.INTERNAL_SERVER_ERROR, i18n.__("ErrorGenericUnknown")];
  })();

  res.status(statusCode).json({
    message,
    success: false,
  });

  return next();
};

export { errorHandlerMiddleware };
