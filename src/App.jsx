import { useState } from 'react'
import './App.css'

function App() {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [results, setResults] = useState(null)

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount)
    const annualRate = parseFloat(interestRate)
    const years = parseInt(loanTerm)

    if (!loanAmount || !interestRate || !loanTerm) {
      alert('Please fill in all fields')
      return
    }

    if (principal <= 0) {
      alert('Loan amount must be greater than 0')
      return
    }

    if (annualRate < 0 || annualRate > 50) {
      alert('Interest rate must be between 0% and 50%')
      return
    }

    if (years <= 0 || years > 50) {
      alert('Loan term must be between 1 and 50 years')
      return
    }

    const monthlyRate = annualRate / 100 / 12
    const numberOfPayments = years * 12

    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    
    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - principal

    // Generate amortization schedule
    const amortizationSchedule = []
    let remainingBalance = principal

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      remainingBalance = remainingBalance - principalPayment

      // Handle final payment rounding
      if (i === numberOfPayments && remainingBalance < 0.01) {
        remainingBalance = 0
      }

      amortizationSchedule.push({
        paymentNumber: i,
        monthlyPayment: monthlyPayment,
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        remainingBalance: remainingBalance
      })
    }

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      amortizationSchedule: amortizationSchedule
    })
  }

  const resetCalculator = () => {
    setLoanAmount('')
    setInterestRate('')
    setLoanTerm('')
    setResults(null)
  }

  return (
    <div className="mortgage-calculator">
      <h1>Mortgage Calculator</h1>
      
      <div className="calculator-form">
        <div className="input-group">
          <label htmlFor="loanAmount">Loan Amount ($)</label>
          <input
            type="number"
            id="loanAmount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
          />
        </div>

        <div className="input-group">
          <label htmlFor="interestRate">Annual Interest Rate (%)</label>
          <input
            type="number"
            step="0.01"
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Enter interest rate"
          />
        </div>

        <div className="input-group">
          <label htmlFor="loanTerm">Loan Term (Years)</label>
          <input
            type="number"
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="Enter loan term"
          />
        </div>

        <div className="button-group">
          <button onClick={calculateMortgage} className="calculate-btn">
            Calculate
          </button>
          <button onClick={resetCalculator} className="reset-btn">
            Reset
          </button>
        </div>
      </div>

      {results && (
        <>
          <div className="results">
            <h2>Calculation Results</h2>
            <div className="result-item">
              <span className="label">Monthly Payment:</span>
              <span className="value">${results.monthlyPayment}</span>
            </div>
            <div className="result-item">
              <span className="label">Total Payment:</span>
              <span className="value">${results.totalPayment}</span>
            </div>
            <div className="result-item">
              <span className="label">Total Interest:</span>
              <span className="value">${results.totalInterest}</span>
            </div>
          </div>

          <div className="amortization-schedule">
            <h2>Amortization Schedule</h2>
            <div className="table-container">
              <table className="amortization-table">
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Monthly Payment</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.amortizationSchedule.map((payment) => (
                    <tr key={payment.paymentNumber}>
                      <td>{payment.paymentNumber}</td>
                      <td>${payment.monthlyPayment.toFixed(2)}</td>
                      <td>${payment.principalPayment.toFixed(2)}</td>
                      <td>${payment.interestPayment.toFixed(2)}</td>
                      <td>${payment.remainingBalance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
