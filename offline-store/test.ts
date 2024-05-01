import { nanoid } from 'nanoid'

const GLOBAL_STORE: any[] = []

const OBJECT_STORE = {
  findOne(self: any, typename: string, foreignKey: string) {
    return GLOBAL_STORE.find(item => item.__typename === typename&& item.id === self[foreignKey])
  },
  findMany(self: any, typename: string, foreignKey: string) {
    return GLOBAL_STORE.filter(item => item.__typename === typename && item[foreignKey] === self.id)
  },
  insert(self: any) {
    const exists = GLOBAL_STORE.find(item => item.__typename === self.__typename && item.id === self.id)
    if (exists) {
      // replace object in store
      const index = GLOBAL_STORE.findIndex(item => item.__typename === self.__typename && item.id === self.id)
      GLOBAL_STORE[index] = self
    } else {
      GLOBAL_STORE.push(self)
    }
  }
}

class Model {
  id: string = nanoid()
  readonly __typename: string
  constructor(typename: string) {
    this.__typename = typename

    OBJECT_STORE.insert(this)
  }
}

class User extends Model {
  firstName: string = ''
  lastName: string = ''

  constructor(firstName: string, lastName: string) {
    super('User')

    this.id = nanoid()
    this.firstName = firstName
    this.lastName = lastName
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @ManyToOne('Entry', 'user_id')
  entries!: Entry[]
}

class Project extends Model {
  constructor() {
    super('Project')
  }
}

function OneToMany(entity: string, foreignKey: string) {
  return function(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function() {
        return OBJECT_STORE.findOne(this, entity,foreignKey)
      },
      set: function(value) {
        this[foreignKey] = value.id
      }
    })
  }
}

function ManyToOne(entity: string, foreignKey: string) {
  return function(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function() {
        return OBJECT_STORE.findMany(this, entity, foreignKey)
      },
      set: function(item: any) {
        // update the item by updating the foreign key on the item itself
        item[foreignKey] = this.id
      }
    })
  }
}

function ManyToMany(entity: string, foreignKey: string, _options: { through: string }) {
  return function(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function() {
        if (_options.through) {
          const _items = OBJECT_STORE.findMany(this, _options.through, foreignKey)
          const _itemIds = _items.map(i => i.file_id)
          return GLOBAL_STORE.filter(item => item.__typename === entity && _itemIds.includes(item.id))
        } else {
          return OBJECT_STORE.findMany(this, entity, foreignKey)
        }
      },
      set: function(items: any[]) {
        for (const item of items) {
          if (_options.through) {
            // @ts-ignore
            const through = new modelMapping[_options.through](this, item)
            OBJECT_STORE.insert(through)
          }
        }
      }
    })
  }
}

class File extends Model {
  name: string = ''

  constructor(name: string) {
    super('File')
    this.name = name
  }
}

class EntryFile extends Model {
  entry_id: string
  file_id: string

  constructor(entry: Entry, file: File) {
    super('EntryFile')
    this.entry_id = entry.id
    this.file_id = file.id
  }
}

const modelMapping = {
  'EntryFile': EntryFile,
}
class Entry extends Model {
  user_id?: string
  project_id: string

  constructor(user: User, project: Project) {
    super('Entry')

    this.user_id = user.id
    this.project_id = project.id
  }

  @OneToMany('User', 'user_id')
  user!: User

  @OneToMany('Project', 'project_id')
  project!: Project

  @ManyToMany('File', 'entry_id', { through: 'EntryFile' })
  files!: File[]
}

const user = new User('John', 'Doe')
const user2 = new User('Max', 'Mustermann')
const project = new Project()
const entry = new Entry(user, project)
const file = new File('application.pdf')

console.log(file)
console.log('---')
console.log(entry.user.fullName)
console.log(entry.user.entries[0].user.entries)
console.log('---')
entry.user = user2
console.log(entry.user.fullName)
console.log('---')
entry.files = [file]
console.log(entry.files)