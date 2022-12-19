interface IBaseMQTTService {
  cb: (payload: Buffer) => Promise<void>;
}

export { IBaseMQTTService };
