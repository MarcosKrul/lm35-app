import { IBaseMQTTService } from "@infra/mqtt";

class HandleLM35ReceivedDataService implements IBaseMQTTService {
  cb = (payload: Buffer): void => {
    console.log(payload.toString());
  };
}
export { HandleLM35ReceivedDataService };
