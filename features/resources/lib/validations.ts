import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";

import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser().withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetResourceSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;