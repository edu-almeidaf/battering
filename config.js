const rangeInput = document.getElementById('percentRange');
    const percentValue = document.getElementById('percentValue');
    const saveButton = document.getElementById('saveButton');
    const saveMessage = document.getElementById('saveMessage');

    rangeInput.addEventListener('input', () => {
      percentValue.textContent = rangeInput.value + '%';
      saveMessage.classList.add('hidden');
      saveMessage.textContent = '';
    });

    saveButton.addEventListener('click', () => {
      const selectedPercent = rangeInput.value;
      // Aqui você pode adicionar a lógica para salvar o valor, por exemplo, localStorage ou enviar para servidor
      localStorage.setItem('savedPercent', selectedPercent);
      saveMessage.textContent = `Porcentagem de ${selectedPercent}% salva com sucesso!`;
      saveMessage.classList.remove('hidden');
    });

    // Se quiser carregar o valor salvo ao abrir a página:
    window.addEventListener('load', () => {
      const saved = localStorage.getItem('savedPercent');
      if (saved) {
        rangeInput.value = saved;
        percentValue.textContent = saved + '%';
      }
    });