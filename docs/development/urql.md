# urql - Using GraphQL Client

In this project, we use [urql](https://formidable.com/open-source/urql/docs/) to manage our GraphQL client. Here's a guide to help you understand an important aspect related to document caching in urql.

## Understanding Document Cache Issues

### Problem Description

Imagine you have an empty list, and you add something to it, like a file. You might expect the list or view to update with the newly created item, but sometimes it doesn't. Here's why this can happen and how to fix it:

- When data is returned, urql fetches the `__typename`.
- If the list is empty, there won't be any `typenames`.
- If you call a mutation (e.g., uploading a file) that returns a `__typename`, urql will try to refetch all active queries with that `typename`.
- If no item in the empty list matches the exact `__typename`, the list won't update.

### Solution

Luckily, you can give urql more context by manually defining a typename to "listen" for. Here's how to do it:

1. Write your query as usual:

   ```ts
   const query = `query { todos { id name } }`;
   const result = { todos: [] };
   ```

2. Create a context with the additional typenames you want to monitor, keeping the reference stable:
   ```ts
   const context = { additionalTypenames: ["File"] };
   const [result] = useQuery({ query, context });
   ```
   This approach helps urql to recognize the type you're working with and updates the list accordingly.

For more details, please refer to the urql documentation on [Document Cache Gotchas](https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas).

This document provides a concise and clear explanation of a potential issue with document caching in urql and offers step-by-step instructions to solve it. It should be suitable for developers of any experience level.
