 $(".phone").mask("+7(999) 999-99-99")
 $('.phone').click(function(){
    $(this).setCursorPosition(3);  // set position number
  });
$.fn.setCursorPosition = function(pos) {
  if ($(this).get(0).setSelectionRange) {
    $(this).get(0).setSelectionRange(pos, pos);
  } else if ($(this).get(0).createTextRange) {
    var range = $(this).get(0).createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
};
/******  И еще одна отдельная - это создание .error-message блока под формой  *******/
document.addEventListener('DOMContentLoaded', () => {
  const phoneInputs = document.querySelectorAll('.phoneForm');

  const getNumbers = input => input.value.replace(/\D/g, '');
  const getForm = input => input.closest('form');
  const getButton = form => form?.querySelector('[type="submit"]');

  const getError = form =>
    form.nextElementSibling?.classList.contains('error-message')
      ? form.nextElementSibling
      : null;

  const showError = form => {
    if (!getError(form)) {
      const error = document.createElement('div');
      error.className = 'error-message';
      error.textContent = 'Номер должен быть в формате +7 9XX XXX-XX-XX';
      form.after(error);
    }
    const btn = getButton(form);
    if (btn) btn.disabled = true;
  };

  const clearError = form => {
    const error = getError(form);
    if (error) error.remove();
  };

  const formatPhone = numbers => {
    if (!numbers) return '';

    if (numbers[0] === '9') numbers = '7' + numbers;
    if (numbers[0] === '8') numbers = '7' + numbers.slice(1);
    if (numbers[0] !== '7') return numbers;

    numbers = numbers.substring(0, 11);

    let result = '+7';

    if (numbers.length > 1)
      result += ' (' + numbers.substring(1, 4);

    if (numbers.length >= 5)
      result += ') ' + numbers.substring(4, 7);

    if (numbers.length >= 8)
      result += '-' + numbers.substring(7, 9);

    if (numbers.length >= 10)
      result += '-' + numbers.substring(9, 11);

    return result;
  };

  const validateStep = numbers => {
    if (!numbers.length) return true;

    if (!['7', '8', '9'].includes(numbers[0])) return false;

    if (numbers[0] === '7' && numbers.length > 1 && numbers[1] !== '9')
      return false;

    if (numbers.length > 11) return false;

    return true;
  };

  const validateFull = numbers =>
    numbers.length === 11 &&
    numbers[0] === '7' &&
    numbers[1] === '9';

  const handleInput = e => {
    const input = e.target;
    const form = getForm(input);
    const btn = getButton(form);

    let numbers = getNumbers(input);
    input.value = formatPhone(numbers);
    numbers = getNumbers(input);

    // Ошибка шага → показываем и блокируем
    if (!validateStep(numbers)) {
      showError(form);
      return;
    }

    // Если шаг корректный — убираем сообщение
    clearError(form);

    // Полная проверка
    if (validateFull(numbers)) {
      if (btn) btn.disabled = false;
    } else {
      if (btn) btn.disabled = true;
    }
  };

  phoneInputs.forEach(input => {
    const form = getForm(input);
    const btn = getButton(form);
    if (btn) btn.disabled = true;

    input.addEventListener('input', handleInput);
  });
});
/******  *******/

/****** а это тоже самое но error блок .error-message уже имеется над формой *******/
/****** МАСКА *******/
document.addEventListener('DOMContentLoaded', () => {
  const phoneInputs = document.querySelectorAll('.phoneForm');
  const errorText = 'Номер должен быть в формате +7 9XX XXX-XX-XX';

  const getNumbers = input => input.value.replace(/\D/g, '');

  const getError = form =>
    form?.closest('.consultation')?.querySelector('.error-message') ?? null;

  const showError = form => {
    const error = getError(form);

    if (error) {
      error.textContent = errorText;
      error.hidden = false;
    }
  };

  const clearError = form => {
    const error = getError(form);
    if (error) error.hidden = true;
  };

  const formatPhone = numbers => {
    if (!numbers) return '';

    if (numbers[0] === '9') numbers = '7' + numbers;
    if (numbers[0] === '8') numbers = '7' + numbers.slice(1);
    if (numbers[0] !== '7') return numbers;

    numbers = numbers.substring(0, 11);

    let result = '+7';

    if (numbers.length > 1)
      result += ' (' + numbers.substring(1, 4);

    if (numbers.length >= 5)
      result += ') ' + numbers.substring(4, 7);

    if (numbers.length >= 8)
      result += '-' + numbers.substring(7, 9);

    if (numbers.length >= 10)
      result += '-' + numbers.substring(9, 11);

    return result;
  };

  const validateStep = numbers => {
    if (!numbers.length) return true;

    if (!['7', '8', '9'].includes(numbers[0])) return false;

    if (numbers[0] === '7' && numbers.length > 1 && numbers[1] !== '9')
      return false;

    if (numbers.length > 11) return false;

    return true;
  };

  const validateFull = numbers =>
    numbers.length === 11 &&
    numbers[0] === '7' &&
    numbers[1] === '9';

  const updateValidity = input => {
    const numbers = getNumbers(input);

    // Пустое поле проверяет встроенный required.
    input.setCustomValidity(
      input.value === '' || validateFull(numbers) ? '' : errorText
    );
  };

  phoneInputs.forEach(input => {
    const form = input.closest('form');

    updateValidity(input);

    input.addEventListener('input', () => {
      input.value = formatPhone(getNumbers(input));

      const numbers = getNumbers(input);

      if (!validateStep(numbers)) {
        showError(form);
      } else {
        clearError(form);
      }

      updateValidity(input);
    });
  });
});
/******  *******/
