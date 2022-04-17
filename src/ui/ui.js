import Project from '../helper/project'
import Storage from '../helper/storage'
import Task from "../helper/task"
import './ui.css'
import format from "date-fns/format"
import { add,compareDesc } from 'date-fns'

export default class Ui {
    static list = []
    static activeProject = null;
    static initialLoad() {
        Ui.navbar()
        const mainDiv = document.querySelector('.main')
        const app = document.createElement('div')
        app.id = 'app'
        const projectList = document.createElement('div')
        const taskList = document.createElement('div')
        taskList.classList.add('task-list')
        projectList.classList.add('project-list')
        app.appendChild(projectList)
        app.appendChild(taskList)
        mainDiv.appendChild(app)
        Ui.initializeStorage()
        Ui.loadProject()
        Ui.loadTask()
    }
    static navbar() {
        const mainDiv = document.querySelector('.main')
        const nav = document.createElement('nav')
        nav.innerHTML = `<div><h1><i class="bi bi-journal-check"></i><span>JS TODO</span></h1></div>`
        const menu = document.createElement('h1')
        menu.classList.add('menu')
        const icon = document.createElement('i')
        icon.classList.add("bi")
        icon.classList.add("bi-list")
        menu.appendChild(icon)
        icon.addEventListener('click',()=>{
            document.querySelector('.project-list').classList.add('show')
        })
        nav.append(menu)
        mainDiv.appendChild(nav)
    }
    static initializeStorage() {
        Ui.list = []
        if (!localStorage.getItem("todoList")) {
            Ui.list = [new Project("inbox"), new Project("today"), new Project('tomorrow'), new Project('week')];
            Storage.saveTodoList([new Project("inbox"), new Project("today"), new Project('tomorrow'), new Project('week')])
        }
        else {
            Storage.getTodoList().map(i => Ui.list.push(i))
        }
        Ui.activeProject = Ui.list[0]
    }
    static loadProject() {
        const projectList = document.querySelector('.project-list')
        projectList.innerHTML = ''
        Ui.list.map((pr, i) => {
            const projectElement = Ui.createProject(pr)
            projectList.appendChild(projectElement)
            if (Ui.activeProject.name == pr.name)
                projectElement.classList.add('active')
            projectElement.addEventListener('click', () => {
                const projects = document.querySelectorAll('.project')
                projects.forEach(i => i.classList.remove('active'))
                projectElement.classList.add('active')
                Ui.activeProject = pr
                Ui.loadTask()
            })
        })
        Ui.addButton()
    }

    static loadTask() {
        const taskList = document.querySelector('.task-list')
        taskList.innerHTML = `<h1 class='task-name'>${Ui.activeProject.name}</h1>`
        Ui.activeProject.tasks.map(i => {
            taskList.appendChild(Ui.createTask(i))
        })
        if (Ui.activeProject.name == 'today')
            Ui.list[0].todaysTasks().map(i => {
                taskList.appendChild(Ui.createTask(i))
            })
        if (Ui.activeProject.name == 'tomorrow')
            Ui.list[0].tomorrowsTasks().map(i => {
                taskList.appendChild(Ui.createTask(i))
            })
        if (Ui.activeProject.name == 'week')
            Ui.list[0].weeksTasks().map(i => {
                taskList.appendChild(Ui.createTask(i))
            })

        Ui.newTaskBtn()
    }

    static createTask(task) {
        let div = document.createElement('div')
        div.classList.add('task')
        let h3 = document.createElement('h3')
        const r = document.createElement('input')
        r.type = 'radio'
        if(task.complete){
            div.classList.add('complete')
            r.checked = true
        }else{
            if(compareDesc(new Date,new Date(task.dueDate) ===1)){
                div.classList.add('overdue')
                r.readOnly = true
            }
            else if (compareDesc(new Date,new Date(task.dueDate) <=1))
                r.addEventListener('input',()=>{
                div.classList.add('complete')
                Ui.completeTask(r,task)
                })
        }

        h3.appendChild(r)
        let span = document.createElement('span')
        span.innerHTML = `${task.title}`
        h3.appendChild(span)
            let p = document.createElement('p')
        if (Ui.activeProject.name == 'today' || Ui.activeProject.name == 'tomorrow')
            p.innerText = Ui.activeProject.name
        else p.innerText = task.dueDate
        div.appendChild(h3)
        div.appendChild(p)
        let rI = document.createElement('span')
        rI.classList.add('remove')
        rI.innerHTML = "<i style='font-size:20px;' class='bi bi-trash-fill'></i>"
        div.appendChild(rI)
        const dis = document.createElement('div')
        dis.classList.add('discription')
        dis.innerText = task.discription
        div.appendChild(dis)
        rI.addEventListener('click', () => {
            div.remove()
            Ui.activeProject.tasks = Ui.activeProject.tasks.filter(i => i.title !== task.title)
            Ui.list[0].tasks = Ui.list[0].tasks.filter(i => i.title !== task.title)
            Storage.removeTask(Ui.activeProject.name, task.title)
            Storage.removeTask("inbox", task.title)
            Ui.loadTask()
        })
        return div
    }
    
    static createProject(project) {
        const div = document.createElement('div')
        div.classList.add('project')
        const heading = document.createElement('div')
        heading.classList.add('project-name')
        const icons = {
            "today": '<i class="bi bi-calendar-event-fill"></i>',
            "inbox": '<i class="bi bi-inbox-fill"></i>',
            "tomorrow": '<i class="bi bi-calendar-event-fill"></i>',
            "week": '<i class="bi bi-calendar-minus-fill"></i>'
        }
        heading.innerHTML = `${icons[project.name] ? icons[project.name] : '<i class="bi bi-list-ul"></i>'}<span>${project.name}</span>`
        div.appendChild(heading)
        if (Ui.list.indexOf(project) > 3) {
            const s = document.createElement('span')
            s.classList.add('remove-project')
            s.innerHTML = "<i style='font-size:20px;' class='bi bi-trash-fill'></i>"
            s.addEventListener('click', (e) => {
                e.stopPropagation();
                Ui.removeProject(project, div)
            }, { once: true })
            div.appendChild(s)
        }
        return div
    }

    static removeProject(project, div) {
        if (Ui.activeProject == project)
            Ui.activeProject = Ui.list[0]
        div.remove()
        Storage.removeProject(project.name)
        Ui.list = Ui.list.filter(i => i.name !== project.name)
        Ui.loadProject()
    }

    static addButton() {
        const div = document.createElement('div')
        div.classList.add("add-button")
        const projectlist = document.querySelector('.project-list')
        div.innerHTML = `
        <div class='new-project-btn'>   
            <h3>
                <i class="bi bi-plus"></i>
                Add new project
            </h3>
        </div>
        <form class='new-project-input hide'>
        <div>
            <input type="text" name="" id="" />
        </div>
        <div>
            <button type='submit' class='create' id='create'><i class="bi bi-check "></i></button>
            <button type='reset' class='cancel' id='cancel'><i class="bi bi-x "></i></button>
        </div>
    </form>
        `
        projectlist.appendChild(div)
        Ui.clickAdd()
    }

    static clickAdd() {
        const newPrBtn = document.querySelector('.new-project-btn')
        const addNewProject = document.querySelector('.new-project-input')
        Ui.showHide(newPrBtn, addNewProject)

        addNewProject.addEventListener('submit', (e) => {
            e.preventDefault()
            const newProject = new Project(addNewProject.elements[0].value)
            Ui.list.push(newProject)
            Storage.addProject(newProject)
            Ui.loadProject()
        })
        addNewProject.addEventListener('reset', (e) => {
            newPrBtn.classList.remove('hide')
            addNewProject.classList.add('hide')
        })

    }

    static newTaskBtn() {
        const taskList = document.querySelector('.task-list')
        const div = document.createElement('div')
        const dateElement = {
            min: format(new Date, "yyyy-MM-dd"),
            max: format(add(new Date, { days: 60 }), 'yyyy-MM-dd'),
            value: ''
        }
        if (Ui.activeProject.name == 'tomorrow')
            dateElement.value = format(add(new Date, { days: 1 }), "yyyy-MM-dd")
        else if (Ui.activeProject.name == 'today')
            dateElement.value = format(new Date, "yyyy-MM-dd")
        else if (Ui.activeProject.name == 'week') {
            let curr = new Date();
            let day = curr.getDay();
            let firstday = new Date(curr.getTime() - 60 * 60 * 24 * day * 1000);
            let lastday = new Date(firstday.getTime() + 60 * 60 * 24 * 6 * 1000);
            dateElement.max = format(lastday, 'yyyy-MM-dd')
        }

        div.classList.add('new-task-btn')
        div.innerHTML = `<div class='add-task-btn task'>
        <h3> + Add new task</h3></div><form class='task-form hide'>
        <input type="text" required/> <input type="text" required/> <input requird type="date" min='${dateElement.min}' max='${dateElement.max}' ${dateElement.value && "readOnly"} value='${dateElement.value ? dateElement.value : dateElement.min}' />
        <div className="form-btn"><button class='create' type'submit'>Add</button><button class='cancel' type='reset'>Cancel</button></div>        
        </form>`
        taskList.appendChild(div)
        Ui.showHide(document.querySelector('.add-task-btn'), document.querySelector('.task-form'))
        Ui.addNewTask()
    }

    static showHide(e1, e2) {
        e1.addEventListener('click', () => {
            e1.classList.add('hide')
            e2.classList.remove('hide')
        })
    }

    static addNewTask() {
        const form = document.querySelector('.task-form')
        form.addEventListener('submit', (e) => {
            e.preventDefault()
            const title = form.elements[0].value
            const discription = form.elements[1].value
            const dueDate = form.elements[2].value
            const task = new Task(title, discription, dueDate)
            Ui.activeProject.tasks.push(task)
            Storage.addTask(Ui.activeProject.name, task)
            Ui.loadTask()
        })
        form.addEventListener('reset', (e) => {
            document.querySelector('.add-task-btn').classList.remove('hide')
            document.querySelector('.task-form').classList.add('hide')
        })
    }

    static completeTask(i,task){
        Ui.activeProject.tasks.map(i =>{
            if( i.title == task.title )
                i.complete = true
        })
        Storage.completeTask(Ui.activeProject.name,task.title)
    }
}