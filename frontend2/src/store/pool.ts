// Import the necessary utility to generate unique IDs
import { nanoid } from 'nanoid'

function ManyToOne(targetEntity: typeof Model, foreignKey: string) {
  return function(target: any, propertyKey: string | symbol) {
    // Register propertyKey in a metadata storage or similar mechanism
    if (!target.__relations) {
      target.__relations = {}
    }
    target.__relations[propertyKey] = { targetEntity, foreignKey }

    // Create a proxy in the constructor of the target class
    const originalConstructor = target.constructor
    const newConstructor = function(...args: any[]) {
      const instance = new originalConstructor(...args)
      return new Proxy(instance, {
        get(target, key, receiver) {
          if (key === propertyKey && !target[key]) {
            // Lazy-load the related entity when the property is accessed
            const store = target.objectStore
            if (!store) {
              throw new Error('Object store is not initialized')
            }
            target[key] = store.get(target[foreignKey]) as InstanceType<typeof targetEntity>
          }
          return Reflect.get(target, key, receiver)
        }
      })
    }
    // Replace the original constructor with the proxied one
    target.constructor = newConstructor
  }
}

function loggedMethod<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  const methodName = String(context.name)

  function replacementMethod(this: This, ...args: Args): Return {
    console.log(`LOG: Entering method '${methodName}'.`)
    const result = target.call(this, ...args)
    console.log(`LOG: Exiting method '${methodName}'.`)
    return result
  }

  return replacementMethod
}


function OneToMany(targetEntity: typeof Model) {
  return function(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function() {
        // Ensure `this.objectStore` is initialized
        if (!this.objectStore) {
          throw new Error('Object store is not initialized')
        }
        return this.objectStore.getByType(targetEntity.name)
      },
      configurable: true,
      enumerable: true
    })
  }
}


// Model base class
abstract class Model {
  id: string
  __typename: string

  protected constructor(typename: string) {
    this.id = nanoid()
    this.__typename = typename
  }
}


// Entry model
class Entry extends Model {
  date: Date
  body: string
  readonly userId: string
  private objectStore: ObjectStore // Reference to the ObjectStore

  constructor(date: Date, body: string, userId: string, objectStore: ObjectStore) {
    super('Entry')
    this.date = date
    this.body = body
    this.userId = userId
    this.objectStore = objectStore
  }

  user!: User
}

function deprecatedMethod(target: Function, context: any) {
  if (context.kind === "method") {
    return function (this: any,...args: any[]) {
      console.log(`${context.name} is deprecated and will be removed in a future version.`)
      return target.apply(this, args)
    }
  }
}

function deprecatedProperty(_: any, context: any) {
  if (context.kind === "field") {
    return function (initialValue: any) {
      console.log(`${context.name} is deprecated and will be removed in a future version.`)
      return initialValue
    }
  }
}


// User model
class User extends Model {
  firstName: string
  lastName: string

  private objectStore: ObjectStore // Reference to the ObjectStore

  constructor(first_name: string, last_name: string, objectStore: ObjectStore) {
    super('User')
    this.firstName = first_name
    this.lastName = last_name
    this.objectStore = objectStore
  }

  @deprecatedMethod
  greet() {
    console.log('Hello, my name is ' + this.firstName + ' ' + this.lastName)
  }

  @deprecatedProperty
  name: string = 'John Doe'

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}

// ObjectStore class
class ObjectStore {
  private store: { [id: string]: Model } = {}

  add(model: Model) {
    this.store[model.id] = model
  }

  get(id: string): Model | undefined {
    return this.store[id]
  }

  getByType(typename: string): Model[] {
    return Object.values(this.store).filter(model => model.__typename === typename)
  }
}


// ObjectGraph class
class ObjectGraph {
  private objectStore: ObjectStore

  constructor(objectStore: ObjectStore) {
    this.objectStore = objectStore
  }
}

// Example usage
const objectStore = new ObjectStore()
const graph = new ObjectGraph(objectStore)

const user = new User('John', 'Doe', objectStore)
objectStore.add(user)
const entry = new Entry(new Date(), 'My first diary entry', user.id, objectStore)
objectStore.add(entry)

// console.log(entry.user.fullName) // Should log the user associated with the entry
console.log(user.name)
