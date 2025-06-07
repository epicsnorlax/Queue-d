// Check if the current tab is a ChatGPT tab
function checkChatGPTTab(callback) {
  // Chrome and Edge use chrome.*; Firefox also supports browser.*
  const api = window.chrome || window.browser;
  api.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    if (tab && tab.url && tab.url.includes("chat.openai.com")) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

// Initial queue data for demonstration
let queues = [
  { id: 1, name: "Queue Alpha" },
  { id: 2, name: "Queue Beta" },
  { id: 3, name: "Queue Gamma" }
];

const queuesContainer = document.getElementById('queuesContainer');

function renderQueues() {
  queuesContainer.innerHTML = '';
  queues.forEach((queue, idx) => {
    const box = document.createElement('div');
    box.className = 'queue-box';
    box.draggable = true;
    box.textContent = queue.name;
    box.dataset.idx = idx;

    box.addEventListener('dragstart', handleDragStart);
    box.addEventListener('dragover', handleDragOver);
    box.addEventListener('drop', handleDrop);
    box.addEventListener('dragend', handleDragEnd);
    box.addEventListener('dragenter', handleDragEnter);
    box.addEventListener('dragleave', handleDragLeave);

    queuesContainer.appendChild(box);
  });
}

let draggedIdx = null;

function handleDragStart(e) {
  draggedIdx = Number(this.dataset.idx);
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function handleDragOver(e) {
  e.preventDefault();
  this.classList.add('over');
}
function handleDragEnter(e) {
  e.preventDefault();
  if (Number(this.dataset.idx) !== draggedIdx) {
    this.classList.add('over');
  }
}
function handleDragLeave(e) {
  this.classList.remove('over');
}
function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('over');
  const targetIdx = Number(this.dataset.idx);
  if (targetIdx !== draggedIdx) {
    const [removed] = queues.splice(draggedIdx, 1);
    queues.splice(targetIdx, 0, removed);
    renderQueues();
  }
}
function handleDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.queue-box.over').forEach(el => el.classList.remove('over'));
}

// On load, check if we're on ChatGPT
checkChatGPTTab(function(isChatGPT) {
  if (isChatGPT) {
    document.getElementById('notOnChatgpt').style.display = 'none';
    document.getElementById('queuesMain').style.display = '';
    renderQueues();
  } else {
    document.getElementById('notOnChatgpt').style.display = '';
    document.getElementById('queuesMain').style.display = 'none';
  }
});