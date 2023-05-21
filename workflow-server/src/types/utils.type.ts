export interface Pagination {
  page: number;
  limit: number;
}

export interface PaginatedCollection extends Pagination {
  fields?: string;
}
