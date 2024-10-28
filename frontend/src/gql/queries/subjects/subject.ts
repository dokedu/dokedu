import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubjectQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type SubjectQuery = { __typename?: 'Query', subject: { __typename?: 'Subject', id: string, name: string } };


export const SubjectDocument = gql`
    query subject($id: ID!) {
  subject(id: $id) {
    id
    name
  }
}
    `;

export function useSubjectQuery(options?: Omit<Urql.UseQueryArgs<never, SubjectQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<SubjectQuery, SubjectQueryVariables | undefined>({ query: SubjectDocument, variables: undefined, ...options });
};