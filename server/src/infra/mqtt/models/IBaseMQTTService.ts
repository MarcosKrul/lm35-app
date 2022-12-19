interface IBaseMQTTService {
  cb: (payload: Buffer) => void;
}

export { IBaseMQTTService };
