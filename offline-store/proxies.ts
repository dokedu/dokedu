import { nanoid } from 'nanoid'

const userId = nanoid()

const GLOBAL_STORE: any[] = [
    {
        id: userId,
        __typename: 'User',
        firstName: 'John',
        lastName: 'Doe',
    },
    {
        id: nanoid(),
        __typename: 'User',
        firstName: 'Max',
        lastName: 'Mustermann',
    }
]

class GlobalStore {
    static defaultTarget<T>(id: string, typename: string) {
        return GLOBAL_STORE.find(item => item.__typename === typename && item.id === id)
    }
}

console.log('proxies.ts')
console.log("")

function defaultTarget() {
    return {
        id: nanoid(),
    }
}

const handler = {
    get(target: any, name: string) {
        return name in target ? target[name] : 42;
    },
    set(obj: any, prop: string, value: any) {
        if (prop in obj) {
            obj[prop] = value;
            return true;
        } else {
            console.log("warning: property not found", prop);
        }
        return true;
    }
};

class Model {
    id: string = nanoid()
    readonly __typename: string
    constructor(typename: string) {
        this.__typename = typename
    }
}

interface User {
    id: string
    firstName: string
    lastName: string
}

interface Entry {
    id: string
    body: string
    user: User
}

const user = new Proxy<User>(GlobalStore.defaultTarget<User>(userId, "User"), handler);
console.log(user.firstName);