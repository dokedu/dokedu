import type * as Types from '../../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ZeCompetenceParentsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ZeCompetenceParentsQuery = { __typename?: 'Query', competence: { __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, grades: Array<number>, parents: Array<{ __typename?: 'Competence', id: string, name: string, type: Types.CompetenceType, grades: Array<number> }> } };


export const ZeCompetenceParentsDocument = gql`
    query zeCompetenceParents($id: ID!) {
  competence(id: $id) {
    id
    name
    type
    grades
    parents {
      id
      name
      type
      grades
    }
  }
}
    `;

export function useZeCompetenceParentsQuery(options?: Omit<Urql.UseQueryArgs<never, ZeCompetenceParentsQueryVariables | undefined>, 'query'>) {
  return Urql.useQuery<ZeCompetenceParentsQuery, ZeCompetenceParentsQueryVariables | undefined>({ query: ZeCompetenceParentsDocument, variables: undefined, ...options });
};