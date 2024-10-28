import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ExportEventsQueryVariables = Types.Exact<{
  input: Types.ExportEventsInput;
}>;


export type ExportEventsQuery = { __typename?: 'Query', exportEvents: Array<{ __typename?: 'ExportEventsPayload', id: string, title: string, body: string, startsAt: string, endsAt: string, subjects: string } | null> };


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

export function useExportEventsQuery(options?: Omit<Urql.UseQueryArgs<never, ExportEventsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<ExportEventsQuery, ExportEventsQueryVariables | undefined>({ query: ExportEventsDocument, variables: undefined, ...options });
};