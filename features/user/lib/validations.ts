import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";

import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@/interfaces/data-table/lib/parsers";

export const usersSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(100),
  sort: getSortingStateParser().withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type UsersSearchParams = Awaited<
  ReturnType<typeof usersSearchParamsCache.parse>
>;
