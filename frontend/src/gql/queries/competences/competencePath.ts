import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CompetencePathQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type CompetencePathQuery = { __typename?: 'Query', competence: { __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, color: string, grades: Array<number>, parents: Array<{ __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, grades: Array<number>, color: string }> } };


export const CompetencePathDocument = gql`
    query competencePath($id: ID!) {
  competence(id: $id) {
    id
    name
    type
    color
    grades
    parents {
      id
      name
      type
      grades
      color
    }
  }
}
    `;

export function useCompetencePathQuery(options?: Omit<Urql.UseQueryArgs<never, CompetencePathQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<CompetencePathQuery, CompetencePathQueryVariables | undefined>({ query: CompetencePathDocument, variables: undefined, ...options });
};