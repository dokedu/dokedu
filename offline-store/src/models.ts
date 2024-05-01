import {ManyToMany, ManyToOne, Model, modelMapping, OneToMany} from "./lib.ts";

class User extends Model {
    firstName: string = ''
    lastName: string = ''

    constructor(firstName: string, lastName: string) {
        super('User')

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

    @ManyToMany('File', 'entry_id', {through: 'EntryFile'})
    files!: File[]
}

modelMapping['EntryFile'] = EntryFile

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