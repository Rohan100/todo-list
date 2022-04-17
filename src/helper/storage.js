import Project from './project'
export default class Storage {
    static saveTodoList(data) {
        localStorage.setItem('todoList', JSON.stringify(data))
    }

    static getTodoList() {
        const todoList = JSON.parse(localStorage.getItem('todoList')).map((i) =>
            Object.assign(new Project(), i)
        )
        return todoList
    }

    static addProject(project = new Project()) {
        const todoList = Storage.getTodoList()
        todoList.push(project)
        Storage.saveTodoList(todoList)
    }

    static removeProject(projectName) {
        const todoList = Storage.getTodoList().filter(i => i.name !== projectName)
        Storage.saveTodoList(todoList)
    }
    static addTask(projectName, task) {
        const todoList = Storage.getTodoList().map(i => {
            if (i.name == projectName) {
                i.addTask(task)
            }
            return i
        })
        Storage.saveTodoList(todoList)
    }
    static removeTask(projectName, name) {
        const todoList = Storage.getTodoList().map(i => {
            if (i.name == projectName)
                i.tasks = i.tasks.filter(t => t.title !== name)
            return i
        })
        Storage.saveTodoList(todoList)
    }

    static completeTask(projectName, task) {
        const todoList = Storage.getTodoList().map(i => {
            if (i.name == projectName)
                i.tasks = i.tasks.map(t => {
                    if(t.title == task)
                        t.complete = true
                    return t
                })
            return i
        })
        Storage.saveTodoList(todoList)
    }
}