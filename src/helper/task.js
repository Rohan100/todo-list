export default class Task{
    constructor(title,discription = '',dueDate = 'No date'){
        this.title = title
        this.discription = discription
        this.dueDate = dueDate
        this.complete = false; 
    }
    getDueDate(){
        return this.dueDate
    }
    getDiscription(){
        return this.discription
    }
    getTitle(){
        return this.title
    }
    setDueDate(dueDate){
        this.dueDate = dueDate
    }
    setDiscription(discription){
        this.discription = discription
    }
    setTitle(title){
        this.title = title
    }
}

