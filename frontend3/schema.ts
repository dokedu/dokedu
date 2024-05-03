import { getIntrospectionQuery } from 'graphql';

import { getIntrospectedSchema, minifyIntrospectionQuery } from '@urql/introspection';

const result = await fetch('http://localhost:8080/graph', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        variables: {},
        query: getIntrospectionQuery({ descriptions: false }),
    }),
})


const json = await result.json();

const minified = minifyIntrospectionQuery(getIntrospectedSchema(json.data));

await Bun.write('./schema.json', JSON.stringify(minified));