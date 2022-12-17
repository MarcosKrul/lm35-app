import "reflect-metadata";
import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import i18n from "i18n";

import { Languages } from "@infra/utils";
import { errorHandlerMiddleware } from "@middlewares/errorHandlerMiddleware";
import { routes } from "@routes/index";

const app = express();

i18n.setLocale(Languages.PORTUGUESE);

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(routes);
app.use(errorHandlerMiddleware);

process.on("SIGTERM", () => {
  process.exit();
});

export { app };
