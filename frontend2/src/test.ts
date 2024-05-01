import { nanoid } from 'nanoid'

const GLOBAL_STORE: any[] = [];

class ObjectStore {
  pool: any[] = [];

  find(id: string, typename: string) {
    return this.pool.find(item => item.id === id && item.__typename === typename);
  }
}

class User {
  id: string = nanoid();
  __typename: string = 'User';
  firstName: string = "";
  lastName: string = "";

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @ManyToOne
  entries!: Entry[]
}

class Project {
  id: string = nanoid();
  __typename: string = 'Project';
}

function transformPropertyKeyToCamelCase(propertyKey: string) {
  return propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1);
}

function OneToMany(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    get: function() {
      const relatedTypeName = transformPropertyKeyToCamelCase(propertyKey);
      const relationKey = propertyKey + '_id';
      return GLOBAL_STORE.find(item => item.__typename === relatedTypeName && item.id === this[relationKey]);
    },
    set: function(value) {
      this[propertyKey + '_id'] = value.id;
      GLOBAL_STORE.push(value);  // Assuming we might need to add newly related entities to the store
    }
  });
}

function ManyToOne(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    get: function() {
      // const relatedTypeName = transformPropertyKeyToCamelCase(propertyKey);
      // const relationKey = propertyKey + '_id';
      return GLOBAL_STORE.filter(item => item.__typename === "Entry" && item.user_id === this.id);
    },
    set: function(value) {
      this[propertyKey + '_id'] = value.id;
      GLOBAL_STORE.push(value);  // Assuming we might need to add newly related entities to the store
    }
  });
}

class Entry {
  id: string = nanoid();
  user_id?: string;
  project_id: string;
  __typename: string = 'Entry';

  constructor(user: User, project: Project) {
    this.user_id = user.id;
    this.project_id = project.id;
  }

  @OneToMany
  user!: User;

  @OneToMany
  project!: Project;
}

const user = new User("John", "Doe");
const user2 = new User("Max", "Mustermann");
const project = new Project();
const entry = new Entry(user, project);

GLOBAL_STORE.push(user);
GLOBAL_STORE.push(user2);
GLOBAL_STORE.push(project);
GLOBAL_STORE.push(entry);

console.log(entry.user.fullName);
console.log(entry.project.id);
console.log("---");
entry.user = user2;
console.log(entry.user.fullName);
console.log(entry.project.id);
console.log(entry.user.entries[0].user.fullName)