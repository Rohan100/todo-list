import { isToday, isThisWeek,isTomorrow,subDays,toDate } from "date-fns"
export default class Project {
  constructor(name) {
    this.name = name
    this.tasks = []
  }
  getName() {
    return this.name
  }
  setName(name) {
    this.name = name
  }
  getTasks() {
    return this.tasks
  }
  addTask(task) {
    this.tasks.push(task)
  }
  removeTask(title) {
    this.tasks = this.tasks.filter(item => item.title !== title)
  }
  todaysTasks() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return isToday(taskDate)
    })
  }

  tomorrowsTasks() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return isTomorrow(taskDate)
    })
  }

  weeksTasks() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return isThisWeek(subDays(toDate(taskDate), 1))
    })
  }

}