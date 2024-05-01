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

export class Model {
    id: string = nanoid()
    readonly __typename: string
    constructor(typename: string) {
        this.__typename = typename

        OBJECT_STORE.insert(this)
    }
}

export function OneToMany(entity: string, foreignKey: string) {
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

export function ManyToOne(entity: string, foreignKey: string) {
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

export function ManyToMany(entity: string, foreignKey: string, _options: { through: string }) {
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

function handler(target: any, name: string) {
    return name in target ? target[name] : 42;
}

export let modelMapping: any = new Proxy({}, handler)

