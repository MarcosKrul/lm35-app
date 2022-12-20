import { container } from "tsyringe";

import { DateProvider, IDateProvider } from "@providers/date";

container.registerSingleton<IDateProvider>("DateProvider", DateProvider);
