import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { AppError } from "@handlers/errors/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { toNumber } from "@helpers/toNumber";
import { transaction } from "@infra/database/transaction";
import { logger } from "@infra/log";
import { IBaseMQTTService } from "@infra/mqtt";
import { LM35Data } from "@prisma/client";
import { ILM35DataRepository } from "@repositories/LM35Data";

@injectable()
class HandleLM35ReceivedDataService implements IBaseMQTTService {
  constructor(
    @inject("LM35DataRepository")
    private lm35DataRepository: ILM35DataRepository
  ) {}

  cb = async (payload: Buffer): Promise<void> => {
    const json = JSON.parse(payload.toString());

    if (!json)
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        i18n.__mf("MQTTErrorPayloadEmpty", [
          "armazenamento de informações do sensor LM35",
        ])
      );

    if (stringIsNullOrEmpty(json.analog) || stringIsNullOrEmpty(json.temp))
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        i18n.__mf("MQTTErrorNullOrEmptyValues", [
          "armazenamento de informações do sensor LM35",
        ])
      );

    const analog = toNumber({
      value: json.analog,
      error: new AppError(
        "INTERNAL_SERVER_ERROR",
        i18n.__mf("MQTTErrorValueIsNotNumber", [
          "armazenamento de informações do sensor LM35",
        ])
      ),
    });

    const temp = toNumber({
      value: json.temp,
      error: new AppError(
        "INTERNAL_SERVER_ERROR",
        i18n.__mf("MQTTErrorValueIsNotNumber", [
          "armazenamento de informações do sensor LM35",
        ])
      ),
    });

    const now = new Date();

    await transaction([
      this.lm35DataRepository.save({
        temp,
        analog,
        timestamp: now,
      } as LM35Data),
    ]);

    logger.info("MQTT objeto saved successfully.");
  };
}
export { HandleLM35ReceivedDataService };
