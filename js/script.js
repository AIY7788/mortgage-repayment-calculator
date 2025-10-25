import { formatCurrency , formatNumberWithCommas} from "./util/formatCurrency.js";

const loanAmount = document.getElementById('amount');
const term = document.getElementById('term');
const rate = document.getElementById('rate');
const calculate_btn = document.getElementById('calculate-btn');
const clear_btn = document.getElementById('clear-btn')

const contain_Result_El = document.getElementById('container-result');
const contain_amount_field = document.getElementById('mortgage-amount-field');
const contain_term_field = document.getElementById('mortgage-term-field');
const contain_rate_field = document.getElementById('mortgage-rate-field');
const contain_radio_field = document.getElementById('input-radio');

loanAmount.addEventListener('input', (e) => {
  const cursorPosition = e.target.selectionStart;
  const rawValue = e.target.value;

  const formatted = formatNumberWithCommas(rawValue);
  e.target.value = formatted;

  const oldCommas = (rawValue.slice(0, cursorPosition).match(/,/g) || []).length;
  const newCommas = (formatted.slice(0, cursorPosition).match(/,/g) || []).length;
  const diff = newCommas - oldCommas;

  const newCursor = cursorPosition + diff;
  e.target.setSelectionRange(newCursor, newCursor);
});

calculate_btn.addEventListener('click', () => {
  const mortgageType = document.querySelector('input[name="mortgage-type"]:checked');

  validation(loanAmount, term, rate, mortgageType);

});

clear_btn.addEventListener('click', () => {
  const mortgageType = document.querySelector('input[name="mortgage-type"]:checked');

  document.querySelectorAll('.err').forEach(el => el.remove());
  document.querySelectorAll('.span-err').forEach(el => el.classList.remove('span-err'));
  document.querySelectorAll('.input-err').forEach(el => el.classList.remove('input-err'));

  loanAmount.value = '';
  term.value = '';
  rate.value = '';

  if (mortgageType) {
    mortgageType.checked = false;
  }

  contain_Result_El.style.display = "flex";
  contain_Result_El.style.textAlign = "center";
  contain_Result_El.innerHTML = `
    <img src="assets/images/illustration-empty.svg">
    <h3>Results shown here</h3>
    <p>Complete the form and click "calculate repayments" to see your monthly repayments would be.</p>
  `
})

function validation(loanAmount, term, rate, mortgageType) {

  const fields = [
    { el: loanAmount, container: contain_amount_field },
    { el: term, container: contain_term_field },
    { el: rate, container: contain_rate_field },
    { el: mortgageType, container: contain_radio_field, isRadio: true }
  ];

  document.querySelectorAll('.err').forEach(el => el.remove());
  document.querySelectorAll('.span-err').forEach(el => el.classList.remove('span-err'));
  document.querySelectorAll('.input-err').forEach(el => el.classList.remove('input-err'));

  let hasError = [];

  fields.forEach(field => {
    const value = field.isRadio ? field.el : field.el.value;
    
    if (!value) {
      if (!field.isRadio) {
        const span = field.container.querySelector('span')
        const input = field.el
        span.classList.add('span-err');
        input.classList.add('input-err');
      }
      
      const err = document.createElement('p');
      err.classList.add('err');
      err.textContent = 'This field is required';
      field.container.appendChild(err);
      hasError.push('true');
    } else {
      hasError.push('false');
    }
  });
  
  if (hasError.some(el => el === "true")) return;

  const { monthlyPayment, totalRepay } = calculateRepayments(loanAmount, term, rate, mortgageType);

  shownResult(monthlyPayment, totalRepay);
}

function calculateRepayments(loanAmount, term, rate, mortgageType) {
  const loan = parseFloat(loanAmount.value.replace(/,/g , ''))
  
  let monthlyRate = (rate.value / 100) / 12;

  let totalPayments = term.value * 12;

  let monthlyPayment = 0;
  let totalRepay = 0;

  if (mortgageType.value === 'repayment') {
    monthlyPayment = loan *
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
  }
  else if (mortgageType.value === 'interest-only') {
    monthlyPayment = loan * monthlyRate;
  }

  totalRepay = monthlyPayment * totalPayments;

  return {
    monthlyPayment,
    totalRepay
  };
  
}

function shownResult(monthlyPayment, totalRepay) {

  contain_Result_El.style.display = "block";
  contain_Result_El.style.textAlign = "start";

  contain_Result_El.innerHTML = `
    <h3>Your results</h3>

    <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click "calculate repayments" again.</p>

    <div class="result">
      <p>Your monthly repayments</p>
      <div class="result-amount">£${formatCurrency(monthlyPayment)}</div>

      <p>Total you'll repay over the term</p>
      <div class="total-repay">£${formatCurrency(totalRepay)}</div>
    </div>
  `
}