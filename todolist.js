document.addEventListener("DOMContentLoaded", ()=> {
    const storedtasks = JSON.parse(localStorage.getItem('tasks'));
    if(storedtasks){
        storedtasks.forEach((task)=> tasks.push(task));
        updatetasklist();
        updatestats();
    }
})

let tasks = [];

const savetasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addtask = () => {
    const taskinput = document.getElementById('taskinput');
    const deadlineInput = document.getElementById('taskdeadline');
    
    const text = taskinput.value.trim();
    const deadline = deadlineInput.value;

    if (text) {
        tasks.push({
            text: text,
            completed: false,
            deadline: deadline ? new Date(deadline).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            }) : "No deadline"
        });

        sortTasksByDeadline();
        updatetasklist();
        updatestats();
        savetasks();
    }

    taskinput.value = "";
    deadlineInput.value = "";
};

const toggletaskcomplete = (index) =>{
    tasks[index].completed = !tasks[index].completed;
    updatetasklist();
    updatestats();
    savetasks();
};

const deletetask = (index) =>{
    const confirmdelete = confirm("Are you sure you want to delete this task?");
    if (confirmdelete) {
        tasks.splice(index, 1);
        updatetasklist();
    }
    updatestats();
    savetasks();
};

const edittask = (index) =>{
    const taskinput = document.getElementById("taskinput");
    taskinput.value = tasks[index].text;
    tasks.splice(index,1);
    updatetasklist();
    sortTasksByDeadline();
    updatestats();
    savetasks();
};

const updatestats = ()=> {
    const completedtasks = tasks.filter(task=> task.completed).length;
    const totaltasks = tasks.length;
    const progress = (completedtasks/totaltasks)*100;
    const progressbar = document.getElementById("barp");
    progressbar.style.width = `${progress}%`;
    document.getElementById("num").innerText = `${completedtasks} / ${totaltasks}`;
};

function sortTasksByDeadline() {
    tasks.sort((a, b) => {
        if (a.deadline === "No deadline") return 1;
        if (b.deadline === "No deadline") return -1;
        return new Date(a.deadline) - new Date(b.deadline);
    });
}

function getDaysLeft(deadlineText) {
    if (deadlineText === "No deadline") return " ";

    const today = new Date();
    today.setHours(0,0,0,0); 

    const deadline = new Date(deadlineText);
    deadline.setHours(0,0,0,0);

    const diff = (deadline - today) / (1000 * 60 * 60 * 24);

    if (diff === 0) return "-- Due today";
    if (diff === 1) return "-- Due tomorrow";
    if (diff > 1) return `-- ${diff} days left`;
    if (diff === -1) return "-- Overdue by 1 day";
    if (diff < -1) return `-- Overdue by ${Math.abs(diff)} days`;
}

const updatetasklist = () => {
    sortTasksByDeadline();

    const tasklist = document.getElementById('tasklist');
    tasklist.innerHTML = "";

    tasks.sort((a, b) => {return a.completed - b.completed;});

    tasks.forEach((task, index) => {
        const listitem = document.createElement('li');

        listitem.innerHTML = `
            <div class="taskitem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}/>
                    
                    <div class="tasktext">
                        <p>${task.text}</p>
                        <small class="taskdeadline">
                            ${task.deadline} <span class="daysleft">${getDaysLeft(task.deadline)}</span>
                        </small>
                    </div>
                </div>

                <div class="icons">
                    <i class="fa-solid fa-pen" onclick="edittask(${index})"></i>
                    <i class="fa-solid fa-circle-minus" onclick="deletetask(${index})"></i>
                </div>
            </div>
        `;

        listitem.addEventListener("change", () => toggletaskcomplete(index));
        tasklist.append(listitem);
    });
};

document.getElementById("tasksubmit").addEventListener("click", function(e){
    e.preventDefault();
    addtask();
});
