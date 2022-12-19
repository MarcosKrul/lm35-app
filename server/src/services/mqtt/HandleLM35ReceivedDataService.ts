import { inject, injectable } from "tsyringe";

import { transaction } from "@infra/database/transaction";
import { IBaseMQTTService } from "@infra/mqtt";
import { ILM35DataRepository } from "@repositories/LM35Data";

@injectable()
class HandleLM35ReceivedDataService implements IBaseMQTTService {
  constructor(
    @inject("LM35DataRepository")
    private lm35DataRepository: ILM35DataRepository
  ) {}

  cb = async (payload: Buffer): Promise<void> => {
    console.log(payload.toString());
    await transaction([this.lm35DataRepository.save()]);
  };
}
export { HandleLM35ReceivedDataService };
