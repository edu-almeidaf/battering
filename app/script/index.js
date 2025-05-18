const elements = {
  sections: document.querySelectorAll('section'),
  loading: document.getElementById('loading'),
  batteryPercent: document.getElementById('batteryPercent'),
  progress: document.getElementById('progress'),
  batteryStatus: document.getElementById('batteryStatus'),
  statusColor: document.getElementById('statusColor'),
  message: document.getElementById('message'),
  batteryThreshold: document.getElementById('batteryThreshold'),
  saveThreshold: document.getElementById('saveThreshold')
};

const colors = {
  charging: {
    progress: 'text-orange-500',
    status: 'bg-orange-500'
  },
  good: {
    progress: 'text-green-500',
    status: 'bg-green-500'
  },
  low: {
    progress: 'text-red-500',
    status: 'bg-red-500'
  }
};

function showInterface() {
  elements.sections.forEach(section => section.classList.remove('hidden'));
  elements.loading.classList.add('hidden');
}

function updateBatteryUI(data) {
  elements.batteryPercent.textContent = `${data.percent}%`;
  elements.progress.value = data.percent;
  
  const classesToRemove = [
    colors.charging.progress, colors.good.progress, colors.low.progress,
    colors.charging.status, colors.good.status, colors.low.status
  ];
  elements.progress.classList.remove(...classesToRemove);
  elements.statusColor.classList.remove(...classesToRemove);
  
  if (data.isCharging) {
    elements.batteryStatus.textContent = 'Conectado ao carregador';
    
    if (data.percent > 20 && data.percent < 80) {
      elements.progress.classList.add(colors.charging.progress);
      elements.statusColor.classList.add(colors.charging.status);
    }
  } else {
    elements.batteryStatus.textContent = 'Descarregando';
    elements.progress.classList.add(colors.low.progress);
    elements.statusColor.classList.add(colors.low.status);
  }
  
  if (data.percent === 100) {
    elements.batteryStatus.textContent = 'Carregado';
    elements.progress.classList.add(colors.good.progress);
    elements.statusColor.classList.add(colors.good.status);
  } else if (data.percent >= 80) {
    elements.progress.classList.add(colors.good.progress);
    elements.statusColor.classList.add(colors.good.status);
  } else if (data.percent < 20) {
    elements.progress.classList.add(colors.low.progress);
    elements.statusColor.classList.add(colors.low.status);
  }
}

function clearMessage(className) {
  setTimeout(() => {
    elements.message.textContent = '';
    elements.message.classList.remove(className);
  }, 3000);
}

function handleThresholdSave() {
  let value = parseInt(elements.batteryThreshold.value, 10);
  
  if (value < 5) {
    elements.message.classList.add('text-red-500');
    elements.message.textContent = 'Valor mínimo de 5%';
    clearMessage('text-red-500');
    return;
  }
  
  elements.message.classList.add('text-green-500');
  elements.message.textContent = `Valor ajustado para ${value}%`;
  window.electronAPI.updateBatteryThreshold(value);
  clearMessage('text-green-500');
}

window.electronAPI.onBatteryInfo((_event, data) => {
  if (data) {
    showInterface();
    updateBatteryUI(data);
  }
});

window.electronAPI.onPlatformInfo((platform) => {
  document.getElementById('platform').textContent = platform;
});

elements.saveThreshold.addEventListener('click', handleThresholdSave);