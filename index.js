const today = new Date(); 
const dayname = today.toLocaleDateString("en-US", { weekday: "long" });
const daynumber = today.getDate();
const monthname = today.toLocaleDateString("en-US", { month: "long" });
const year = today.getFullYear();

document.getElementById("dayname").textContent = dayname;
document.getElementById("daynumber").textContent = daynumber;
document.getElementById("monthname").textContent = monthname;
document.getElementById("year").textContent = year;