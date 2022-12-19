import { container } from "tsyringe";

import {
  ILM35DataRepository,
  LM35DataRepository,
} from "@repositories/LM35Data";

container.registerSingleton<ILM35DataRepository>(
  "LM35DataRepository",
  LM35DataRepository
);
