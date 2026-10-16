document.addEventListener("DOMContentLoaded", () => {
  // Shared footer year
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  // Accessible mobile navigation
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-header nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "Close ✕" : "Menu ☰";
    });
  }

  // Academic planner: persistent in this browser using localStorage
  const taskForm = document.getElementById("task-form");
  if (taskForm) {
    const taskInput = document.getElementById("task-input");
    const dateInput = document.getElementById("task-date");
    const list = document.getElementById("task-list");
    const empty = document.getElementById("empty-state");
    const count = document.getElementById("task-count");
    const message = document.getElementById("planner-message");
    const storageKey = "oluebube-cos106-tasks";
    let tasks = [];
    try { tasks = JSON.parse(localStorage.getItem(storageKey) || "[]"); }
    catch (_) { tasks = []; }

    const save = () => localStorage.setItem(storageKey, JSON.stringify(tasks));
    const render = () => {
      list.replaceChildren();
      empty.hidden = tasks.length > 0;
      const done = tasks.filter(task => task.completed).length;
      count.textContent = `${done} of ${tasks.length} completed`;
      tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Mark ${task.title} completed`);
        checkbox.addEventListener("change", () => {
          task.completed = checkbox.checked; save(); render();
        });
        const content = document.createElement("div");
        content.className = "task-text" + (task.completed ? " completed" : "");
        const title = document.createElement("strong");
        title.textContent = task.title;
        content.append(title);
        if (task.date) {
          const meta = document.createElement("span");
          meta.className = "task-meta";
          meta.textContent = `Due: ${task.date}`;
          content.append(meta);
        }
        const del = document.createElement("button");
        del.className = "delete-task";
        del.type = "button";
        del.textContent = "Delete";
        del.setAttribute("aria-label", `Delete ${task.title}`);
        del.addEventListener("click", () => {
          tasks = tasks.filter(item => item.id !== task.id); save(); render();
        });
        li.append(checkbox, content, del);
        list.append(li);
      });
    };
    taskForm.addEventListener("submit", event => {
      event.preventDefault();
      const title = taskInput.value.trim();
      if (!title) {
        message.textContent = "Please enter a task before adding it.";
        message.className = "form-message error";
        taskInput.focus(); return;
      }
      tasks.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, title, date: dateInput.value, completed: false });
      save(); render(); taskForm.reset();
      message.textContent = "Task added successfully.";
      message.className = "form-message success";
      taskInput.focus();
    });
    render();
  }

  // Contact form validation. This front-end demo does not send data to a server.
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const status = document.getElementById("contact-status");
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = document.getElementById("contact-name").value.trim();
      const email = document.getElementById("contact-email").value.trim();
      const phone = document.getElementById("contact-phone").value.trim();
      const msg = document.getElementById("contact-message").value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^\d+$/;
      let error = "";
      if (!name || !email || !phone || !msg) error = "Please complete every field.";
      else if (!emailPattern.test(email)) error = "Enter a valid email address, for example name@example.com.";
      else if (!phonePattern.test(phone)) error = "Phone number must contain digits only (no spaces or symbols).";
      if (error) {
        status.textContent = error;
        status.className = "form-message error";
        return;
      }
      status.textContent = "Validation successful. This demo form does not send or store your message yet.";
      status.className = "form-message success";
      contactForm.reset();
    });
  }
});