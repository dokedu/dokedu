export type PageVariables = {
  limit?: number;
  order?: string;
  search?: string;
  sortBy?: string;
  offset?: number;
  nextPage?: boolean;
  filter?: { [key: string]: any };
  showDeleted?: boolean;
};
