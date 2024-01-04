import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ExportEventsQueryVariables = Types.Exact<{
  input: Types.ExportEventsInput;
}>;


export type ExportEventsQuery = (
  { __typename?: 'Query' }
  & { exportEvents: Array<Types.Maybe<(
    { __typename?: 'ExportEventsPayload' }
    & Pick<Types.ExportEventsPayload, 'id' | 'title' | 'body' | 'startsAt' | 'endsAt' | 'subjects'>
  )>> }
);


export const ExportEventsDocument = gql`
    query exportEvents($input: ExportEventsInput!) {
  exportEvents(input: $input) {
    id
    title
    body
    startsAt
    endsAt
    subjects
  }
}
    `;

export function useExportEventsQuery(options: Omit<Urql.UseQueryArgs<never, ExportEventsQueryVariables>, 'query'>) {
  return Urql.useQuery<ExportEventsQuery, ExportEventsQueryVariables>({ query: ExportEventsDocument, ...options });
};